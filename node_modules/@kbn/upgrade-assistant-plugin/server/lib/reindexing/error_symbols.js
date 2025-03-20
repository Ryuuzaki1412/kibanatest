"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReindexTaskFailed = exports.ReindexTaskCannotBeDeleted = exports.ReindexIsNotInQueue = exports.ReindexCannotBeCancelled = exports.ReindexAlreadyInProgress = exports.MultipleReindexJobsFound = exports.IndexNotFound = exports.CannotCreateIndex = exports.AccessForbidden = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const AccessForbidden = Symbol('AccessForbidden');
exports.AccessForbidden = AccessForbidden;
const IndexNotFound = Symbol('IndexNotFound');
exports.IndexNotFound = IndexNotFound;
const CannotCreateIndex = Symbol('CannotCreateIndex');
exports.CannotCreateIndex = CannotCreateIndex;
const ReindexTaskFailed = Symbol('ReindexTaskFailed');
exports.ReindexTaskFailed = ReindexTaskFailed;
const ReindexTaskCannotBeDeleted = Symbol('ReindexTaskCannotBeDeleted');
exports.ReindexTaskCannotBeDeleted = ReindexTaskCannotBeDeleted;
const ReindexAlreadyInProgress = Symbol('ReindexAlreadyInProgress');
exports.ReindexAlreadyInProgress = ReindexAlreadyInProgress;
const ReindexIsNotInQueue = Symbol('ReindexIsNotInQueue');
exports.ReindexIsNotInQueue = ReindexIsNotInQueue;
const ReindexCannotBeCancelled = Symbol('ReindexCannotBeCancelled');
exports.ReindexCannotBeCancelled = ReindexCannotBeCancelled;
const MultipleReindexJobsFound = Symbol('MultipleReindexJobsFound');
exports.MultipleReindexJobsFound = MultipleReindexJobsFound;