"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SyntheticsNetworkEventsApiResponseType = void 0;
var t = _interopRequireWildcard(require("io-ts"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const NetworkTimingsType = t.type({
  queueing: t.number,
  connect: t.number,
  total: t.number,
  send: t.number,
  blocked: t.number,
  receive: t.number,
  wait: t.number,
  dns: t.number,
  proxy: t.number,
  ssl: t.number
});
const CertificateDataType = t.partial({
  validFrom: t.string,
  validTo: t.string,
  issuer: t.string,
  subjectName: t.string
});
const NetworkEventType = t.intersection([t.type({
  timestamp: t.string,
  requestSentTime: t.number,
  loadEndTime: t.number,
  url: t.string
}), t.partial({
  certificates: CertificateDataType,
  ip: t.string,
  method: t.string,
  status: t.number,
  mimeType: t.string,
  responseHeaders: t.record(t.string, t.string),
  requestHeaders: t.record(t.string, t.string),
  timings: NetworkTimingsType,
  transferSize: t.number,
  resourceSize: t.number
})]);
const SyntheticsNetworkEventsApiResponseType = t.type({
  events: t.array(NetworkEventType),
  total: t.number,
  isWaterfallSupported: t.boolean,
  hasNavigationRequest: t.boolean
});
exports.SyntheticsNetworkEventsApiResponseType = SyntheticsNetworkEventsApiResponseType;