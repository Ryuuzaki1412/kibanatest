"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NoMlPluginError = exports.MissingContextValuesError = void 0;
exports.assertHasInfraMlPlugins = assertHasInfraMlPlugins;
exports.assertHasInfraPlugins = assertHasInfraPlugins;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable max-classes-per-file */

class MissingContextValuesError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
exports.MissingContextValuesError = MissingContextValuesError;
class NoMlPluginError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
exports.NoMlPluginError = NoMlPluginError;
function assertHasInfraPlugins(context) {
  if (context.infra == null) {
    throw new MissingContextValuesError('Failed to access "infra" context values.');
  }
}
async function assertHasInfraMlPlugins(context) {
  assertHasInfraPlugins(context);
  const infraContext = await context.infra;
  if ((infraContext === null || infraContext === void 0 ? void 0 : infraContext.mlAnomalyDetectors) == null || (infraContext === null || infraContext === void 0 ? void 0 : infraContext.mlSystem) == null) {
    throw new NoMlPluginError('Failed to access ML plugin.');
  }
  return context;
}