"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuleDataWriterInitializationError = exports.RuleDataWriteDisabledError = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable max-classes-per-file */
class RuleDataWriteDisabledError extends Error {
  constructor({
    reason,
    registrationContext,
    message
  }) {
    let errMessage = message;
    if (!errMessage) {
      if (reason === 'config') {
        if (registrationContext) {
          errMessage = `Rule registry writing is disabled. Make sure that "xpack.ruleRegistry.write.enabled" configuration is not set to false and "${registrationContext}" is not disabled in "xpack.ruleRegistry.write.disabledRegistrationContexts" within "kibana.yml".`;
        } else {
          errMessage = `Rule registry writing is disabled. Make sure that "xpack.ruleRegistry.write.enabled" configuration is not set to false within "kibana.yml".`;
        }
      } else if (reason === 'error') {
        errMessage = `Rule registry writing is disabled due to an error during Rule Data Client initialization.`;
      }
    }
    super(errMessage);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'RuleDataWriteDisabledError';
  }
}
exports.RuleDataWriteDisabledError = RuleDataWriteDisabledError;
class RuleDataWriterInitializationError extends Error {
  constructor(resourceType, registrationContext, error) {
    super(`There has been a catastrophic error trying to install ${resourceType} level resources for the following registration context: ${registrationContext}. This may have been due to a non-additive change to the mappings, removal and type changes are not permitted. Full error: ${error.toString()}`);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'RuleDataWriterInitializationError';
  }
}
exports.RuleDataWriterInitializationError = RuleDataWriterInitializationError;