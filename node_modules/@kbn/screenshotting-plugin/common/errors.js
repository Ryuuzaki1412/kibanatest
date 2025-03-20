"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PdfWorkerOutOfMemoryError = exports.InvalidLayoutParametersError = exports.InsufficientMemoryAvailableOnCloudError = exports.FailedToSpawnBrowserError = exports.FailedToCaptureScreenshot = exports.DisallowedOutgoingUrl = exports.BrowserClosedUnexpectedly = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable max-classes-per-file */
class InvalidLayoutParametersError extends Error {}
exports.InvalidLayoutParametersError = InvalidLayoutParametersError;
class PdfWorkerOutOfMemoryError extends Error {}
exports.PdfWorkerOutOfMemoryError = PdfWorkerOutOfMemoryError;
class FailedToSpawnBrowserError extends Error {}
exports.FailedToSpawnBrowserError = FailedToSpawnBrowserError;
class BrowserClosedUnexpectedly extends Error {}
exports.BrowserClosedUnexpectedly = BrowserClosedUnexpectedly;
class DisallowedOutgoingUrl extends Error {}
exports.DisallowedOutgoingUrl = DisallowedOutgoingUrl;
class FailedToCaptureScreenshot extends Error {}
exports.FailedToCaptureScreenshot = FailedToCaptureScreenshot;
class InsufficientMemoryAvailableOnCloudError extends Error {}
exports.InsufficientMemoryAvailableOnCloudError = InsufficientMemoryAvailableOnCloudError;