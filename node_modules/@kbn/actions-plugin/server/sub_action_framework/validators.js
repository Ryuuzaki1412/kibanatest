"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildValidators = void 0;
var _configSchema = require("@kbn/config-schema");
var _types = require("./types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildValidators = ({
  connector,
  configurationUtilities
}) => {
  const {
    config,
    secrets
  } = buildCustomValidators(connector.validators);
  return {
    config: {
      schema: connector.schema.config,
      customValidator: config
    },
    secrets: {
      schema: connector.schema.secrets,
      customValidator: secrets
    },
    params: {
      schema: _configSchema.schema.object({
        subAction: _configSchema.schema.string(),
        /**
         * With this validation we enforce the subActionParams to be an object.
         * Each sub action has different parameters and they are validated inside the executor
         * (x-pack/plugins/actions/server/sub_action_framework/executor.ts). For that reason,
         * we allow all unknowns at this level of validation as they are not known at this
         * time of execution.
         */
        subActionParams: _configSchema.schema.object({}, {
          unknowns: 'allow'
        })
      })
    }
  };
};
exports.buildValidators = buildValidators;
const buildCustomValidators = validators => {
  const partitionedValidators = {
    config: [],
    secrets: []
  };
  for (const validatorInfo of validators !== null && validators !== void 0 ? validators : []) {
    if (validatorInfo.type === _types.ValidatorType.CONFIG) {
      partitionedValidators.config.push(validatorInfo.validator);
    } else {
      partitionedValidators.secrets.push(validatorInfo.validator);
    }
  }
  return {
    config: createCustomValidatorFunction(partitionedValidators.config),
    secrets: createCustomValidatorFunction(partitionedValidators.secrets)
  };
};
const createCustomValidatorFunction = validators => {
  if (validators.length <= 0) {
    return;
  }
  return (value, validatorServices) => {
    for (const validate of validators) {
      validate(value, validatorServices);
    }
  };
};