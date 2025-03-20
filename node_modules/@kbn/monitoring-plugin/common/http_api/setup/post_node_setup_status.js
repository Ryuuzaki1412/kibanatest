"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postNodeSetupStatusResponsePayloadRT = exports.postNodeSetupStatusRequestQueryRT = exports.postNodeSetupStatusRequestPayloadRT = exports.postNodeSetupStatusRequestParamsRT = void 0;
var rt = _interopRequireWildcard(require("io-ts"));
var _shared = require("../shared");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const postNodeSetupStatusRequestParamsRT = rt.type({
  nodeUuid: rt.string
});
exports.postNodeSetupStatusRequestParamsRT = postNodeSetupStatusRequestParamsRT;
const postNodeSetupStatusRequestQueryRT = rt.partial({
  // This flag is not intended to be used in production. It was introduced
  // as a way to ensure consistent API testing - the typical data source
  // for API tests are archived data, where the cluster configuration and data
  // are consistent from environment to environment. However, this endpoint
  // also attempts to retrieve data from the running stack products (ES and Kibana)
  // which will vary from environment to environment making it difficult
  // to write tests against. Therefore, this flag exists and should only be used
  // in our testing environment.
  skipLiveData: rt.union([_shared.booleanFromStringRT, (0, _shared.createLiteralValueFromUndefinedRT)(false)])
});
exports.postNodeSetupStatusRequestQueryRT = postNodeSetupStatusRequestQueryRT;
const postNodeSetupStatusRequestPayloadRT = rt.partial({
  ccs: _shared.ccsRT,
  timeRange: _shared.timeRangeRT
});
exports.postNodeSetupStatusRequestPayloadRT = postNodeSetupStatusRequestPayloadRT;
const postNodeSetupStatusResponsePayloadRT = rt.type({
  // TODO: add payload entries
});
exports.postNodeSetupStatusResponsePayloadRT = postNodeSetupStatusResponsePayloadRT;