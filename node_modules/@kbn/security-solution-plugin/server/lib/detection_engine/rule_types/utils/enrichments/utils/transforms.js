"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeEnrichments = exports.applyEnrichmentsToEvents = void 0;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function customizer(objValue, srcValue) {
  if ((0, _lodash.isArray)(objValue)) {
    return objValue.concat(srcValue);
  }
}
const mergeEnrichments = (enrichmentsList = []) => {
  return enrichmentsList.reduce((acc, val) => (0, _lodash.mergeWith)(acc, val, customizer), {});
};
exports.mergeEnrichments = mergeEnrichments;
const applyEnrichmentsToEvents = ({
  events,
  enrichmentsList,
  logger
}) => {
  const mergedEnrichments = mergeEnrichments(enrichmentsList);
  logger.debug(`${Object.keys(mergedEnrichments).length} events ready to be enriched`);
  const enrichedEvents = events.map(event => {
    const enrichFunctions = mergedEnrichments[event._id];
    if (!enrichFunctions) return event;
    return enrichFunctions.reduce((acc, enrichFunction) => enrichFunction(acc), event);
  });
  return enrichedEvents;
};
exports.applyEnrichmentsToEvents = applyEnrichmentsToEvents;