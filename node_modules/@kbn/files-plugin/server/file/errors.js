"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UploadInProgressError = exports.NoDownloadAvailableError = exports.ContentAlreadyUploadedError = exports.AlreadyDeletedError = exports.AbortedUploadError = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/* eslint-disable max-classes-per-file */

class FileError extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this);
  }
}
class ContentAlreadyUploadedError extends FileError {}
exports.ContentAlreadyUploadedError = ContentAlreadyUploadedError;
class NoDownloadAvailableError extends FileError {}
exports.NoDownloadAvailableError = NoDownloadAvailableError;
class UploadInProgressError extends FileError {}
exports.UploadInProgressError = UploadInProgressError;
class AlreadyDeletedError extends FileError {}
exports.AlreadyDeletedError = AlreadyDeletedError;
class AbortedUploadError extends FileError {}
exports.AbortedUploadError = AbortedUploadError;