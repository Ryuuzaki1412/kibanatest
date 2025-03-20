"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.secondsToMillis = exports.getNetworkEvents = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const secondsToMillis = seconds =>
// -1 is a special case where a value was unavailable
seconds === -1 ? -1 : seconds * 1000;
exports.secondsToMillis = secondsToMillis;
const getNetworkEvents = async ({
  uptimeEsClient,
  checkGroup,
  stepIndex
}) => {
  const params = {
    track_total_hits: true,
    query: {
      bool: {
        filter: [{
          term: {
            'synthetics.type': 'journey/network_info'
          }
        }, {
          term: {
            'monitor.check_group': checkGroup
          }
        }, {
          term: {
            'synthetics.step.index': Number(stepIndex)
          }
        }]
      }
    },
    // NOTE: This limit may need tweaking in the future. Users can technically perform multiple
    // navigations within one step, and may push up against this limit, however this manner
    // of usage isn't advised.
    size: 1000
  };
  const {
    body: result
  } = await uptimeEsClient.search({
    body: params
  });
  let isWaterfallSupported = false;
  let hasNavigationRequest = false;
  const events = result.hits.hits.map(event => {
    var _docSource$tls, _docSource$tls$server, _docSource$synthetics, _docSource$http, _docSource$http$reque, _docSource$url, _docSource$http2, _docSource$http2$resp, _docSource$http3, _docSource$http3$resp, _securityDetails$issu, _docSource$http4, _docSource$http4$requ, _docSource$http5, _docSource$http5$resp, _docSource$http6, _docSource$http6$resp;
    const docSource = event._source;
    if (docSource.http && docSource.url) {
      isWaterfallSupported = true;
    }
    const requestSentTime = secondsToMillis(docSource.synthetics.payload.request_sent_time);
    const loadEndTime = secondsToMillis(docSource.synthetics.payload.load_end_time);
    const securityDetails = (_docSource$tls = docSource.tls) === null || _docSource$tls === void 0 ? void 0 : (_docSource$tls$server = _docSource$tls.server) === null || _docSource$tls$server === void 0 ? void 0 : _docSource$tls$server.x509;
    if ((_docSource$synthetics = docSource.synthetics.payload) !== null && _docSource$synthetics !== void 0 && _docSource$synthetics.is_navigation_request) {
      // if step has navigation request, this means we will display waterfall metrics in ui
      hasNavigationRequest = true;
    }
    return {
      timestamp: docSource['@timestamp'],
      method: (_docSource$http = docSource.http) === null || _docSource$http === void 0 ? void 0 : (_docSource$http$reque = _docSource$http.request) === null || _docSource$http$reque === void 0 ? void 0 : _docSource$http$reque.method,
      url: (_docSource$url = docSource.url) === null || _docSource$url === void 0 ? void 0 : _docSource$url.full,
      status: (_docSource$http2 = docSource.http) === null || _docSource$http2 === void 0 ? void 0 : (_docSource$http2$resp = _docSource$http2.response) === null || _docSource$http2$resp === void 0 ? void 0 : _docSource$http2$resp.status,
      mimeType: (_docSource$http3 = docSource.http) === null || _docSource$http3 === void 0 ? void 0 : (_docSource$http3$resp = _docSource$http3.response) === null || _docSource$http3$resp === void 0 ? void 0 : _docSource$http3$resp.mime_type,
      requestSentTime,
      loadEndTime,
      timings: docSource.synthetics.payload.timings,
      transferSize: docSource.synthetics.payload.transfer_size,
      resourceSize: docSource.synthetics.payload.resource_size,
      certificates: securityDetails ? {
        issuer: (_securityDetails$issu = securityDetails.issuer) === null || _securityDetails$issu === void 0 ? void 0 : _securityDetails$issu.common_name,
        subjectName: securityDetails.subject.common_name,
        validFrom: securityDetails.not_before,
        validTo: securityDetails.not_after
      } : undefined,
      requestHeaders: (_docSource$http4 = docSource.http) === null || _docSource$http4 === void 0 ? void 0 : (_docSource$http4$requ = _docSource$http4.request) === null || _docSource$http4$requ === void 0 ? void 0 : _docSource$http4$requ.headers,
      responseHeaders: (_docSource$http5 = docSource.http) === null || _docSource$http5 === void 0 ? void 0 : (_docSource$http5$resp = _docSource$http5.response) === null || _docSource$http5$resp === void 0 ? void 0 : _docSource$http5$resp.headers,
      ip: (_docSource$http6 = docSource.http) === null || _docSource$http6 === void 0 ? void 0 : (_docSource$http6$resp = _docSource$http6.response) === null || _docSource$http6$resp === void 0 ? void 0 : _docSource$http6$resp.remote_i_p_address
    };
  });
  return {
    total: result.hits.total.value,
    events,
    isWaterfallSupported,
    hasNavigationRequest
  };
};
exports.getNetworkEvents = getNetworkEvents;