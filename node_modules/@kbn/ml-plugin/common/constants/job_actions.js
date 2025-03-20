"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JOB_ACTION_TASKS = exports.JOB_ACTION_TASK = exports.JOB_ACTION = void 0;
exports.getJobActionString = getJobActionString;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const JOB_ACTION = {
  DELETE: 'delete',
  RESET: 'reset',
  REVERT: 'revert'
};
exports.JOB_ACTION = JOB_ACTION;
function getJobActionString(action) {
  switch (action) {
    case JOB_ACTION.DELETE:
      return 'deleting';
    case JOB_ACTION.RESET:
      return 'resetting';
    case JOB_ACTION.REVERT:
      return 'reverting';
  }
}
const JOB_ACTION_TASK = {
  'cluster:admin/xpack/ml/job/delete': JOB_ACTION.DELETE,
  'cluster:admin/xpack/ml/job/reset': JOB_ACTION.RESET,
  'cluster:admin/xpack/ml/job/model_snapshots/revert': JOB_ACTION.REVERT
};
exports.JOB_ACTION_TASK = JOB_ACTION_TASK;
const JOB_ACTION_TASKS = Object.keys(JOB_ACTION_TASK);
exports.JOB_ACTION_TASKS = JOB_ACTION_TASKS;