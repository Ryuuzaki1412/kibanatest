"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTaskRunAggregator = createTaskRunAggregator;
exports.summarizeTaskRunStat = summarizeTaskRunStat;
var _rxjs = require("rxjs");
var _operators = require("rxjs/operators");
var _lodash = require("lodash");
var _task_events = require("../task_events");
var _result_type = require("../lib/result_type");
var _task_running = require("../task_running");
var _fill_pool = require("../lib/fill_pool");
var _task_run_calcultors = require("./task_run_calcultors");
var _monitoring_stats_stream = require("./monitoring_stats_stream");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createTaskRunAggregator(taskPollingLifecycle, runningAverageWindowSize) {
  const taskRunEventToStat = createTaskRunEventToStat(runningAverageWindowSize);
  const taskRunEvents$ = taskPollingLifecycle.events.pipe((0, _operators.filter)(taskEvent => (0, _task_events.isTaskRunEvent)(taskEvent) && hasTiming(taskEvent)), (0, _operators.map)(taskEvent => {
    const {
      task,
      result,
      persistence
    } = (0, _result_type.unwrap)(taskEvent.event);
    return taskRunEventToStat(task, persistence, taskEvent.timing, result);
  }));
  const loadQueue = (0, _task_run_calcultors.createRunningAveragedStat)(runningAverageWindowSize);
  const taskManagerLoadStatEvents$ = taskPollingLifecycle.events.pipe((0, _operators.filter)(taskEvent => (0, _task_events.isTaskManagerStatEvent)(taskEvent) && taskEvent.id === 'load' && (0, _result_type.isOk)(taskEvent.event)), (0, _operators.map)(taskEvent => {
    return {
      load: loadQueue(taskEvent.event.value)
    };
  }));
  const resultFrequencyQueue = (0, _task_run_calcultors.createRunningAveragedStat)(runningAverageWindowSize);
  const pollingDurationQueue = (0, _task_run_calcultors.createRunningAveragedStat)(runningAverageWindowSize);
  const claimDurationQueue = (0, _task_run_calcultors.createRunningAveragedStat)(runningAverageWindowSize);
  const claimConflictsQueue = (0, _task_run_calcultors.createRunningAveragedStat)(runningAverageWindowSize);
  const claimMismatchesQueue = (0, _task_run_calcultors.createRunningAveragedStat)(runningAverageWindowSize);
  const polledTasksByPersistenceQueue = (0, _task_run_calcultors.createRunningAveragedStat)(runningAverageWindowSize);
  const taskPollingEvents$ = (0, _rxjs.combineLatest)([
  // get latest polling stats
  taskPollingLifecycle.events.pipe((0, _operators.filter)(taskEvent => (0, _task_events.isTaskPollingCycleEvent)(taskEvent) && (0, _result_type.isOk)(taskEvent.event)), (0, _operators.map)(taskEvent => {
    var _taskEvent$timing$sto, _taskEvent$timing, _taskEvent$timing$sta, _taskEvent$timing2;
    const {
      result,
      stats: {
        tasksClaimed,
        tasksUpdated,
        tasksConflicted
      } = {}
    } = taskEvent.event.value;
    const duration = ((_taskEvent$timing$sto = taskEvent === null || taskEvent === void 0 ? void 0 : (_taskEvent$timing = taskEvent.timing) === null || _taskEvent$timing === void 0 ? void 0 : _taskEvent$timing.stop) !== null && _taskEvent$timing$sto !== void 0 ? _taskEvent$timing$sto : 0) - ((_taskEvent$timing$sta = taskEvent === null || taskEvent === void 0 ? void 0 : (_taskEvent$timing2 = taskEvent.timing) === null || _taskEvent$timing2 === void 0 ? void 0 : _taskEvent$timing2.start) !== null && _taskEvent$timing$sta !== void 0 ? _taskEvent$timing$sta : 0);
    return {
      polling: {
        last_successful_poll: new Date().toISOString(),
        // Track how long the polling cycle took from begining until all claimed tasks were marked as running
        duration: duration ? pollingDurationQueue(duration) : pollingDurationQueue(),
        // Track how many version conflicts occured during polling
        claim_conflicts: (0, _lodash.isNumber)(tasksConflicted) ? claimConflictsQueue(tasksConflicted) : claimConflictsQueue(),
        // Track how much of a mismatch there is between claimed and updated
        claim_mismatches: (0, _lodash.isNumber)(tasksClaimed) && (0, _lodash.isNumber)(tasksUpdated) ? claimMismatchesQueue(tasksUpdated - tasksClaimed) : claimMismatchesQueue(),
        result_frequency_percent_as_number: resultFrequencyQueue(result)
      }
    };
  })),
  // get DateTime of latest polling delay refresh
  taskPollingLifecycle.events.pipe((0, _operators.filter)(taskEvent => (0, _task_events.isTaskManagerStatEvent)(taskEvent) && taskEvent.id === 'pollingDelay'), (0, _operators.map)(() => new Date().toISOString())),
  // get the average ratio of polled tasks by their persistency
  taskPollingLifecycle.events.pipe((0, _operators.filter)(taskEvent => (0, _task_events.isTaskClaimEvent)(taskEvent) && (0, _result_type.isOk)(taskEvent.event)), (0, _operators.map)(taskClaimEvent => {
    const claimedTask = taskClaimEvent.event.value;
    return polledTasksByPersistenceQueue(claimedTask.schedule ? _task_events.TaskPersistence.Recurring : _task_events.TaskPersistence.NonRecurring);
  }),
  // unlike the other streams that emit once TM polls, this will only emit when a task is actually
  // claimed, so to make sure `combineLatest` doesn't stall until a task is actually emitted we seed
  // the stream with an empty queue
  (0, _operators.startWith)([])),
  // get duration of task claim stage in polling
  taskPollingLifecycle.events.pipe((0, _operators.filter)(taskEvent => (0, _task_events.isTaskManagerStatEvent)(taskEvent) && taskEvent.id === 'claimDuration' && (0, _result_type.isOk)(taskEvent.event)), (0, _operators.map)(claimDurationEvent => {
    const duration = claimDurationEvent.event.value;
    return duration ? claimDurationQueue(duration) : claimDurationQueue();
  }))]).pipe((0, _operators.map)(([{
    polling
  }, pollingDelay, persistence, claimDuration]) => ({
    polling: {
      last_polling_delay: pollingDelay,
      claim_duration: claimDuration,
      persistence,
      ...polling
    }
  })));
  return (0, _rxjs.combineLatest)([taskRunEvents$.pipe((0, _operators.startWith)({
    drift: [],
    drift_by_type: {},
    execution: {
      duration: {},
      duration_by_persistence: {
        [_task_events.TaskPersistence.Recurring]: [],
        [_task_events.TaskPersistence.NonRecurring]: [],
        [_task_events.TaskPersistence.Ephemeral]: []
      },
      result_frequency_percent_as_number: {},
      persistence: []
    }
  })), taskManagerLoadStatEvents$.pipe((0, _operators.startWith)({
    load: []
  })), taskPollingEvents$.pipe((0, _operators.startWith)({
    polling: {
      duration: [],
      claim_duration: [],
      claim_conflicts: [],
      claim_mismatches: [],
      result_frequency_percent_as_number: [],
      persistence: []
    }
  }))]).pipe((0, _operators.map)(([taskRun, load, polling]) => {
    return {
      key: 'runtime',
      value: {
        ...taskRun,
        ...load,
        ...polling
      }
    };
  }));
}
function hasTiming(taskEvent) {
  return !!(taskEvent !== null && taskEvent !== void 0 && taskEvent.timing);
}
function createTaskRunEventToStat(runningAverageWindowSize) {
  const driftQueue = (0, _task_run_calcultors.createRunningAveragedStat)(runningAverageWindowSize);
  const taskPersistenceQueue = (0, _task_run_calcultors.createRunningAveragedStat)(runningAverageWindowSize);
  const driftByTaskQueue = (0, _task_run_calcultors.createMapOfRunningAveragedStats)(runningAverageWindowSize);
  const taskRunDurationQueue = (0, _task_run_calcultors.createMapOfRunningAveragedStats)(runningAverageWindowSize);
  const taskRunDurationByPersistenceQueue = (0, _task_run_calcultors.createMapOfRunningAveragedStats)(runningAverageWindowSize);
  const resultFrequencyQueue = (0, _task_run_calcultors.createMapOfRunningAveragedStats)(runningAverageWindowSize);
  return (task, persistence, timing, result) => {
    const drift = timing.start - task.runAt.getTime();
    const duration = timing.stop - timing.start;
    return {
      drift: driftQueue(drift),
      drift_by_type: driftByTaskQueue(task.taskType, drift),
      execution: {
        persistence: taskPersistenceQueue(persistence),
        duration: taskRunDurationQueue(task.taskType, duration),
        duration_by_persistence: taskRunDurationByPersistenceQueue(persistence, duration),
        result_frequency_percent_as_number: resultFrequencyQueue(task.taskType, result)
      }
    };
  };
}
const DEFAULT_TASK_RUN_FREQUENCIES = {
  [_task_running.TaskRunResult.Success]: 0,
  [_task_running.TaskRunResult.SuccessRescheduled]: 0,
  [_task_running.TaskRunResult.RetryScheduled]: 0,
  [_task_running.TaskRunResult.Failed]: 0
};
const DEFAULT_POLLING_FREQUENCIES = {
  [_fill_pool.FillPoolResult.Failed]: 0,
  [_fill_pool.FillPoolResult.NoAvailableWorkers]: 0,
  [_fill_pool.FillPoolResult.NoTasksClaimed]: 0,
  [_fill_pool.FillPoolResult.RanOutOfCapacity]: 0,
  [_fill_pool.FillPoolResult.RunningAtCapacity]: 0,
  [_fill_pool.FillPoolResult.PoolFilled]: 0
};
function summarizeTaskRunStat(logger, {
  polling: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    last_successful_poll,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    last_polling_delay,
    duration: pollingDuration,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    claim_duration,
    result_frequency_percent_as_number: pollingResultFrequency,
    claim_conflicts: claimConflicts,
    claim_mismatches: claimMismatches,
    persistence: pollingPersistence
  },
  drift,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  drift_by_type,
  load,
  execution: {
    duration,
    duration_by_persistence: durationByPersistence,
    persistence,
    result_frequency_percent_as_number: executionResultFrequency
  }
}, config) {
  return {
    value: {
      polling: {
        ...(last_successful_poll ? {
          last_successful_poll
        } : {}),
        ...(last_polling_delay ? {
          last_polling_delay
        } : {}),
        ...(claim_duration ? {
          claim_duration: (0, _task_run_calcultors.calculateRunningAverage)(claim_duration)
        } : {}),
        duration: (0, _task_run_calcultors.calculateRunningAverage)(pollingDuration),
        claim_conflicts: (0, _task_run_calcultors.calculateRunningAverage)(claimConflicts),
        claim_mismatches: (0, _task_run_calcultors.calculateRunningAverage)(claimMismatches),
        result_frequency_percent_as_number: {
          ...DEFAULT_POLLING_FREQUENCIES,
          ...(0, _task_run_calcultors.calculateFrequency)(pollingResultFrequency)
        },
        persistence: {
          [_task_events.TaskPersistence.Recurring]: 0,
          [_task_events.TaskPersistence.NonRecurring]: 0,
          ...(0, _task_run_calcultors.calculateFrequency)(pollingPersistence)
        }
      },
      drift: (0, _task_run_calcultors.calculateRunningAverage)(drift),
      drift_by_type: (0, _lodash.mapValues)(drift_by_type, typedDrift => (0, _task_run_calcultors.calculateRunningAverage)(typedDrift)),
      load: (0, _task_run_calcultors.calculateRunningAverage)(load),
      execution: {
        duration: (0, _lodash.mapValues)(duration, typedDurations => (0, _task_run_calcultors.calculateRunningAverage)(typedDurations)),
        duration_by_persistence: (0, _lodash.mapValues)(durationByPersistence, typedDurations => (0, _task_run_calcultors.calculateRunningAverage)(typedDurations)),
        persistence: {
          [_task_events.TaskPersistence.Recurring]: 0,
          [_task_events.TaskPersistence.NonRecurring]: 0,
          [_task_events.TaskPersistence.Ephemeral]: 0,
          ...(0, _task_run_calcultors.calculateFrequency)(persistence)
        },
        result_frequency_percent_as_number: (0, _lodash.mapValues)(executionResultFrequency, (typedResultFrequencies, taskType) => {
          var _config$monitored_tas;
          return summarizeTaskExecutionResultFrequencyStat(logger, {
            ...DEFAULT_TASK_RUN_FREQUENCIES,
            ...(0, _task_run_calcultors.calculateFrequency)(typedResultFrequencies)
          }, (_config$monitored_tas = config.monitored_task_execution_thresholds.custom[taskType]) !== null && _config$monitored_tas !== void 0 ? _config$monitored_tas : config.monitored_task_execution_thresholds.default);
        })
      }
    },
    status: _monitoring_stats_stream.HealthStatus.OK
  };
}
function summarizeTaskExecutionResultFrequencyStat(logger, resultFrequencySummary, executionErrorThreshold) {
  const status = getHealthStatus(logger, resultFrequencySummary, executionErrorThreshold);
  return {
    ...resultFrequencySummary,
    status
  };
}
function getHealthStatus(logger, resultFrequencySummary, executionErrorThreshold) {
  if (resultFrequencySummary.Failed > executionErrorThreshold.warn_threshold) {
    if (resultFrequencySummary.Failed > executionErrorThreshold.error_threshold) {
      logger.debug(`Health Status error threshold has been exceeded, resultFrequencySummary.Failed (${resultFrequencySummary.Failed}) is greater than error_threshold (${executionErrorThreshold.error_threshold})`);
    } else {
      logger.debug(`Health Status warn threshold has been exceeded, resultFrequencySummary.Failed (${resultFrequencySummary.Failed}) is greater than warn_threshold (${executionErrorThreshold.warn_threshold})`);
    }
  }
  return _monitoring_stats_stream.HealthStatus.OK;
}