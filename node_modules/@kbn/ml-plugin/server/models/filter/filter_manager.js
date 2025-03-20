"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilterManager = void 0;
var _boom = _interopRequireDefault(require("@hapi/boom"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class FilterManager {
  constructor(_mlClient) {
    this._mlClient = _mlClient;
  }
  async getFilter(filterId) {
    const {
      filters: [filter]
    } = await this._mlClient.getFilters({
      filter_id: filterId
    });
    if (filter === undefined) {
      // could be an empty list rather than a 404 if a wildcard was used,
      // so throw our own 404
      throw _boom.default.notFound(`Filter with the id "${filterId}" not found`);
    }
    const {
      jobs
    } = await this._mlClient.getJobs();
    const filtersInUse = this.buildFiltersInUse(jobs);
    return {
      ...filter,
      used_by: filtersInUse[filter.filter_id],
      item_count: 0
    };
  }
  async getAllFilters() {
    const body = await this._mlClient.getFilters({
      size: 1000
    });
    return body.filters;
  }
  async getAllFilterStats() {
    const [JOBS, FILTERS] = [0, 1];
    const results = await Promise.all([this._mlClient.getJobs(), this._mlClient.getFilters({
      size: 1000
    })]);

    // Build a map of filter_ids against jobs and detectors using that filter.
    let filtersInUse = {};
    if (results[JOBS] && results[JOBS].jobs) {
      filtersInUse = this.buildFiltersInUse(results[JOBS].jobs);
    }

    // For each filter, return just
    //  filter_id
    //  description
    //  item_count
    //  jobs using the filter
    const filterStats = [];
    if (results[FILTERS] && results[FILTERS].filters) {
      results[FILTERS].filters.forEach(filter => {
        const stats = {
          filter_id: filter.filter_id,
          description: filter.description,
          item_count: filter.items.length,
          used_by: filtersInUse[filter.filter_id]
        };
        filterStats.push(stats);
      });
    }
    return filterStats;
  }
  async newFilter(filter) {
    const {
      filterId,
      ...body
    } = filter;

    // Returns the newly created filter.
    return await this._mlClient.putFilter({
      filter_id: filterId,
      body
    });
  }
  async updateFilter(filterId, filter) {
    const body = {
      filter_id: filterId
    };
    if (filter.description !== undefined) {
      body.description = filter.description;
    }
    if (filter.addItems !== undefined) {
      body.add_items = filter.addItems;
    }
    if (filter.removeItems !== undefined) {
      body.remove_items = filter.removeItems;
    }

    // Returns the newly updated filter.
    const resp = await this._mlClient.updateFilter({
      filter_id: filterId,
      body
    });
    return resp;
  }
  async deleteFilter(filterId) {
    return await this._mlClient.deleteFilter({
      filter_id: filterId
    });
  }
  buildFiltersInUse(jobsList) {
    // Build a map of filter_ids against jobs and detectors using that filter.
    const filtersInUse = {};
    jobsList.forEach(job => {
      const detectors = job.analysis_config.detectors;
      detectors.forEach(detector => {
        if (detector.custom_rules) {
          const rules = detector.custom_rules;
          rules.forEach(rule => {
            if (rule.scope) {
              const ruleScope = rule.scope;
              const scopeFields = Object.keys(ruleScope);
              scopeFields.forEach(scopeField => {
                const filter = ruleScope[scopeField];
                const filterId = filter.filter_id;
                if (filtersInUse[filterId] === undefined) {
                  filtersInUse[filterId] = {
                    jobs: [],
                    detectors: []
                  };
                }
                const jobs = filtersInUse[filterId].jobs;
                const dtrs = filtersInUse[filterId].detectors;
                const jobId = job.job_id;

                // Label the detector with the job it comes from.
                const detectorLabel = `${detector.detector_description} (${jobId})`;
                if (jobs.indexOf(jobId) === -1) {
                  jobs.push(jobId);
                }
                if (dtrs.indexOf(detectorLabel) === -1) {
                  dtrs.push(detectorLabel);
                }
              });
            }
          });
        }
      });
    });
    return filtersInUse;
  }
}
exports.FilterManager = FilterManager;