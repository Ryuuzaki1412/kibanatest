"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.identifyEsError = identifyEsError;
exports.isEsCannotExecuteScriptError = isEsCannotExecuteScriptError;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function extractCausedByChain(causedBy = {}, accumulator = []) {
  const {
    reason,
    caused_by: innerCausedBy
  } = causedBy;
  if (reason && !accumulator.includes(reason)) {
    accumulator.push(reason);
  }
  if (innerCausedBy) {
    return extractCausedByChain(innerCausedBy, accumulator);
  }
  return accumulator;
}

/**
 * Identified causes for ES Error
 *
 * @param err Object Error thrown by ES JS client
 * @return ES error cause
 */
function identifyEsError(err) {
  if (!err.meta) {
    return [];
  }
  const {
    meta: {
      body: response
    }
  } = err;
  if (response) {
    const {
      error
    } = response;
    if (error) {
      const {
        root_cause: rootCause = [],
        caused_by: causedBy
      } = error;
      return [...extractCausedByChain(causedBy), ...rootCause.reduce((acc, innerRootCause) => extractCausedByChain(innerRootCause, acc), [])];
    }
  }
  return [];
}
function isEsCannotExecuteScriptError(err) {
  return identifyEsError(err).includes('cannot execute [inline] scripts');
}