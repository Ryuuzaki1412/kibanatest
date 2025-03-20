"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authorizationProvider = authorizationProvider;
var _saved_objects = require("../../common/types/saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function authorizationProvider(authorization) {
  async function authorizationCheck(request) {
    var _authorization$mode$u;
    const shouldAuthorizeRequest = (_authorization$mode$u = authorization === null || authorization === void 0 ? void 0 : authorization.mode.useRbacForRequest(request)) !== null && _authorization$mode$u !== void 0 ? _authorization$mode$u : false;
    if (shouldAuthorizeRequest === false) {
      return {
        canCreateJobsGlobally: true,
        canCreateJobsAtSpace: true,
        canCreateTrainedModelsGlobally: true,
        canCreateTrainedModelsAtSpace: true
      };
    }
    const checkPrivilegesWithRequest = authorization.checkPrivilegesWithRequest(request);
    // Checking privileges "dynamically" will check against the current space, if spaces are enabled.
    // If spaces are disabled, then this will check privileges globally instead.
    // SO, if spaces are disabled, then you don't technically need to perform this check, but I included it here
    // for completeness.
    const checkPrivilegesDynamicallyWithRequest = authorization.checkPrivilegesDynamicallyWithRequest(request);
    const createMLJobAuthorizationAction = authorization.actions.savedObject.get(_saved_objects.ML_JOB_SAVED_OBJECT_TYPE, 'create');
    const createMLTrainedMOdelAuthorizationAction = authorization.actions.savedObject.get(_saved_objects.ML_TRAINED_MODEL_SAVED_OBJECT_TYPE, 'create');
    const canCreateJobsGlobally = (await checkPrivilegesWithRequest.globally({
      kibana: [createMLJobAuthorizationAction]
    })).hasAllRequested;
    const canCreateJobsAtSpace = (await checkPrivilegesDynamicallyWithRequest({
      kibana: [createMLJobAuthorizationAction]
    })).hasAllRequested;
    const canCreateTrainedModelsGlobally = (await checkPrivilegesWithRequest.globally({
      kibana: [createMLTrainedMOdelAuthorizationAction]
    })).hasAllRequested;
    const canCreateTrainedModelsAtSpace = (await checkPrivilegesDynamicallyWithRequest({
      kibana: [createMLTrainedMOdelAuthorizationAction]
    })).hasAllRequested;
    return {
      canCreateJobsGlobally,
      canCreateJobsAtSpace,
      canCreateTrainedModelsGlobally,
      canCreateTrainedModelsAtSpace
    };
  }
  return {
    authorizationCheck
  };
}