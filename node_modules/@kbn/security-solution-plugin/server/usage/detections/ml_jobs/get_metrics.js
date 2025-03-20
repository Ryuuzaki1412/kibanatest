"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMlJobMetrics = void 0;
var _helpers = require("../../../../common/machine_learning/helpers");
var _is_security_job = require("../../../../common/machine_learning/is_security_job");
var _get_initial_usage = require("./get_initial_usage");
var _update_usage = require("./update_usage");
var _get_job_correlations = require("./transform_utils/get_job_correlations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getMlJobMetrics = async ({
  mlClient,
  savedObjectsClient,
  logger
}) => {
  let jobsUsage = (0, _get_initial_usage.getInitialMlJobUsage)();
  if (mlClient == null) {
    logger.debug('Machine learning client is null/undefined, therefore not collecting telemetry from it');
    // early return if we don't have ml client
    return {
      ml_job_usage: (0, _get_initial_usage.getInitialMlJobUsage)(),
      ml_job_metrics: []
    };
  }
  try {
    const fakeRequest = {
      headers: {}
    };
    const modules = await mlClient.modulesProvider(fakeRequest, savedObjectsClient).listModules();
    const moduleJobs = modules.flatMap(module => module.jobs);
    const jobs = await mlClient.jobServiceProvider(fakeRequest, savedObjectsClient).jobsSummary();
    jobsUsage = jobs.filter(_is_security_job.isSecurityJob).reduce((usage, job) => {
      const isElastic = moduleJobs.some(moduleJob => moduleJob.id === job.id);
      const isEnabled = (0, _helpers.isJobStarted)(job.jobState, job.datafeedState);
      return (0, _update_usage.updateMlJobUsage)({
        isElastic,
        isEnabled
      }, usage);
    }, (0, _get_initial_usage.getInitialMlJobUsage)());
    const jobsType = 'security';
    const securityJobStats = await mlClient.anomalyDetectorsProvider(fakeRequest, savedObjectsClient).jobStats(jobsType);
    const jobDetails = await mlClient.anomalyDetectorsProvider(fakeRequest, savedObjectsClient).jobs(jobsType);
    const jobDetailsCache = new Map();
    jobDetails.jobs.forEach(detail => jobDetailsCache.set(detail.job_id, detail));
    const datafeedStats = await mlClient.anomalyDetectorsProvider(fakeRequest, savedObjectsClient).datafeedStats();
    const datafeedStatsCache = new Map();
    datafeedStats.datafeeds.forEach(datafeedStat => datafeedStatsCache.set(`${datafeedStat.datafeed_id}`, datafeedStat));
    const jobMetrics = securityJobStats.jobs.map(stat => {
      const jobId = stat.job_id;
      const jobDetail = jobDetailsCache.get(stat.job_id);
      const datafeed = datafeedStatsCache.get(`datafeed-${jobId}`);
      return (0, _get_job_correlations.getJobCorrelations)({
        stat,
        jobDetail,
        datafeed
      });
    });
    return {
      ml_job_usage: jobsUsage,
      ml_job_metrics: jobMetrics
    };
  } catch (e) {
    // ignore failure, usage will be zeroed. We don't log the message below as currently ML jobs when it does
    // not have a "security" job will cause a throw. If this does not normally throw eventually on normal operations
    // we should log a debug message like the following below to not unnecessarily worry users as this will not effect them:
    // logger.debug(
    //  `Encountered unexpected condition in telemetry of message: ${e.message}, object: ${e}. Telemetry for "ml_jobs" will be skipped.`
    // );
    return {
      ml_job_usage: (0, _get_initial_usage.getInitialMlJobUsage)(),
      ml_job_metrics: []
    };
  }
};
exports.getMlJobMetrics = getMlJobMetrics;