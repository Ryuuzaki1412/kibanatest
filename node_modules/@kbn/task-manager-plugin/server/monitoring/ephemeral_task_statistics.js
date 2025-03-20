"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEphemeralTaskAggregator = createEphemeralTaskAggregator;
exports.summarizeEphemeralStat = summarizeEphemeralStat;
var _operators = require("rxjs/operators");
var _rxjs = require("rxjs");
var _result_type = require("../lib/result_type");
var _task_events = require("../task_events");
var _task_run_calcultors = require("./task_run_calcultors");
var _monitoring_stats_stream = require("./monitoring_stats_stream");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createEphemeralTaskAggregator(ephemeralTaskLifecycle, runningAverageWindowSize, maxWorkers) {
  const ephemeralTaskRunEvents$ = ephemeralTaskLifecycle.events.pipe((0, _operators.filter)(taskEvent => (0, _task_events.isTaskRunEvent)(taskEvent)));
  const ephemeralQueueSizeEvents$ = ephemeralTaskLifecycle.events.pipe((0, _operators.filter)(taskEvent => (0, _task_events.isTaskManagerStatEvent)(taskEvent) && taskEvent.id === 'queuedEphemeralTasks' && (0, _result_type.isOk)(taskEvent.event)), (0, _operators.map)(taskEvent => {
    return taskEvent.event.value;
  }),
  // as we consume this stream twice below (in the buffer, and the zip)
  // we want to use share, otherwise ther'll be 2 subscribers and both will emit event
  (0, _operators.share)());
  const ephemeralQueueExecutionsPerCycleQueue = (0, _task_run_calcultors.createRunningAveragedStat)(runningAverageWindowSize);
  const ephemeralQueuedTasksQueue = (0, _task_run_calcultors.createRunningAveragedStat)(runningAverageWindowSize);
  const ephemeralTaskLoadQueue = (0, _task_run_calcultors.createRunningAveragedStat)(runningAverageWindowSize);
  const ephemeralPollingCycleBasedStats$ = (0, _rxjs.zip)(ephemeralTaskRunEvents$.pipe((0, _operators.buffer)(ephemeralQueueSizeEvents$), (0, _operators.map)(taskEvents => taskEvents.length)), ephemeralQueueSizeEvents$).pipe((0, _operators.map)(([tasksRanSincePreviousQueueSize, ephemeralQueueSize]) => ({
    queuedTasks: ephemeralQueuedTasksQueue(ephemeralQueueSize),
    executionsPerCycle: ephemeralQueueExecutionsPerCycleQueue(tasksRanSincePreviousQueueSize),
    load: ephemeralTaskLoadQueue(calculateWorkerLoad(maxWorkers, tasksRanSincePreviousQueueSize))
  })), (0, _operators.startWith)({
    queuedTasks: [],
    executionsPerCycle: [],
    load: []
  }));
  const ephemeralTaskDelayQueue = (0, _task_run_calcultors.createRunningAveragedStat)(runningAverageWindowSize);
  const ephemeralTaskDelayEvents$ = ephemeralTaskLifecycle.events.pipe((0, _operators.filter)(taskEvent => (0, _task_events.isTaskManagerStatEvent)(taskEvent) && taskEvent.id === 'ephemeralTaskDelay' && (0, _result_type.isOk)(taskEvent.event)), (0, _operators.map)(taskEvent => {
    return ephemeralTaskDelayQueue(taskEvent.event.value);
  }), (0, _operators.startWith)([]));
  return (0, _rxjs.combineLatest)([ephemeralPollingCycleBasedStats$, ephemeralTaskDelayEvents$]).pipe((0, _operators.map)(([stats, delay]) => {
    return {
      key: 'ephemeral',
      value: {
        ...stats,
        delay
      }
    };
  }));
}
function calculateWorkerLoad(maxWorkers, tasksExecuted) {
  return Math.round(tasksExecuted * 100 / maxWorkers);
}
function summarizeEphemeralStat({
  queuedTasks,
  executionsPerCycle,
  load,
  delay
}) {
  return {
    value: {
      queuedTasks: (0, _task_run_calcultors.calculateRunningAverage)(queuedTasks.length ? queuedTasks : [0]),
      load: (0, _task_run_calcultors.calculateRunningAverage)(load.length ? load : [0]),
      executionsPerCycle: (0, _task_run_calcultors.calculateRunningAverage)(executionsPerCycle.length ? executionsPerCycle : [0]),
      delay: (0, _task_run_calcultors.calculateRunningAverage)(delay.length ? delay : [0])
    },
    status: _monitoring_stats_stream.HealthStatus.OK
  };
}