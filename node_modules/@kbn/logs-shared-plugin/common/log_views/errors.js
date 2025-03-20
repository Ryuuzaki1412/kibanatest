"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResolveLogViewError = exports.PutLogViewError = exports.FetchLogViewStatusError = exports.FetchLogViewError = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable max-classes-per-file */

class ResolveLogViewError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'ResolveLogViewError';
  }
}
exports.ResolveLogViewError = ResolveLogViewError;
class FetchLogViewError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'FetchLogViewError';
  }
}
exports.FetchLogViewError = FetchLogViewError;
class FetchLogViewStatusError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'FetchLogViewStatusError';
  }
}
exports.FetchLogViewStatusError = FetchLogViewStatusError;
class PutLogViewError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'PutLogViewError';
  }
}
exports.PutLogViewError = PutLogViewError;