"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildHandlers = void 0;
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _count = require("./alerts/count");
var _details = require("./alerts/details");
var _actions = require("./actions");
var _connectors = require("./connectors");
var _lifespan = require("./lifespan");
var _mttr = require("./all_cases/mttr");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const isSingleCaseMetrics = params => params.caseId != null;
const buildHandlers = (params, casesClient, clientArgs) => {
  let handlers = [];
  if (isSingleCaseMetrics(params)) {
    handlers = [_count.AlertsCount, _details.AlertDetails, _actions.Actions, _connectors.Connectors, _lifespan.Lifespan].map(ClassName => new ClassName({
      caseId: params.caseId,
      casesClient,
      clientArgs
    }));
  } else {
    handlers = [_mttr.MTTR].map(ClassName => new ClassName({
      owner: params.owner,
      from: params.from,
      to: params.to,
      casesClient,
      clientArgs
    }));
  }
  const uniqueFeatures = new Set(params.features);
  const handlerFeatures = new Set();
  const handlersToExecute = new Set();
  for (const handler of handlers) {
    for (const handlerFeature of handler.getFeatures()) {
      if (uniqueFeatures.has(handlerFeature)) {
        var _handler$setupFeature;
        (_handler$setupFeature = handler.setupFeature) === null || _handler$setupFeature === void 0 ? void 0 : _handler$setupFeature.call(handler, handlerFeature);
        handlersToExecute.add(handler);
      }
      handlerFeatures.add(handlerFeature);
    }
  }
  checkAndThrowIfInvalidFeatures(params, handlerFeatures);
  return handlersToExecute;
};
exports.buildHandlers = buildHandlers;
const checkAndThrowIfInvalidFeatures = (params, handlerFeatures) => {
  const invalidFeatures = params.features.filter(feature => !handlerFeatures.has(feature));
  if (invalidFeatures.length > 0) {
    const invalidFeaturesAsString = invalidFeatures.join(', ');
    const validFeaturesAsString = [...handlerFeatures.keys()].sort().join(', ');
    throw _boom.default.badRequest(`invalid features: [${invalidFeaturesAsString}], please only provide valid features: [${validFeaturesAsString}]`);
  }
};