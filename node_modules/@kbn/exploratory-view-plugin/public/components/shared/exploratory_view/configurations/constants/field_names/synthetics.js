"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SYNTHETICS_WAIT_TIMINGS = exports.SYNTHETICS_TOTAL_TIMINGS = exports.SYNTHETICS_STEP_NAME = exports.SYNTHETICS_STEP_DURATION = exports.SYNTHETICS_SSL_TIMINGS = exports.SYNTHETICS_SEND_TIMINGS = exports.SYNTHETICS_RECEIVE_TIMINGS = exports.SYNTHETICS_LCP = exports.SYNTHETICS_FCP = exports.SYNTHETICS_DOCUMENT_ONLOAD = exports.SYNTHETICS_DNS_TIMINGS = exports.SYNTHETICS_DCL = exports.SYNTHETICS_CONNECT_TIMINGS = exports.SYNTHETICS_CLS = exports.SYNTHETICS_BLOCKED_TIMINGS = exports.NETWORK_TIMINGS_FIELDS = exports.MONITOR_DURATION_US = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MONITOR_DURATION_US = 'monitor.duration.us';
exports.MONITOR_DURATION_US = MONITOR_DURATION_US;
const SYNTHETICS_CLS = 'browser.experience.cls';
exports.SYNTHETICS_CLS = SYNTHETICS_CLS;
const SYNTHETICS_LCP = 'browser.experience.lcp.us';
exports.SYNTHETICS_LCP = SYNTHETICS_LCP;
const SYNTHETICS_FCP = 'browser.experience.fcp.us';
exports.SYNTHETICS_FCP = SYNTHETICS_FCP;
const SYNTHETICS_DOCUMENT_ONLOAD = 'browser.experience.load.us';
exports.SYNTHETICS_DOCUMENT_ONLOAD = SYNTHETICS_DOCUMENT_ONLOAD;
const SYNTHETICS_DCL = 'browser.experience.dcl.us';
exports.SYNTHETICS_DCL = SYNTHETICS_DCL;
const SYNTHETICS_STEP_NAME = 'synthetics.step.name.keyword';
exports.SYNTHETICS_STEP_NAME = SYNTHETICS_STEP_NAME;
const SYNTHETICS_STEP_DURATION = 'synthetics.step.duration.us';
exports.SYNTHETICS_STEP_DURATION = SYNTHETICS_STEP_DURATION;
const SYNTHETICS_DNS_TIMINGS = 'synthetics.payload.timings.dns';
exports.SYNTHETICS_DNS_TIMINGS = SYNTHETICS_DNS_TIMINGS;
const SYNTHETICS_SSL_TIMINGS = 'synthetics.payload.timings.ssl';
exports.SYNTHETICS_SSL_TIMINGS = SYNTHETICS_SSL_TIMINGS;
const SYNTHETICS_BLOCKED_TIMINGS = 'synthetics.payload.timings.blocked';
exports.SYNTHETICS_BLOCKED_TIMINGS = SYNTHETICS_BLOCKED_TIMINGS;
const SYNTHETICS_CONNECT_TIMINGS = 'synthetics.payload.timings.connect';
exports.SYNTHETICS_CONNECT_TIMINGS = SYNTHETICS_CONNECT_TIMINGS;
const SYNTHETICS_RECEIVE_TIMINGS = 'synthetics.payload.timings.receive';
exports.SYNTHETICS_RECEIVE_TIMINGS = SYNTHETICS_RECEIVE_TIMINGS;
const SYNTHETICS_SEND_TIMINGS = 'synthetics.payload.timings.send';
exports.SYNTHETICS_SEND_TIMINGS = SYNTHETICS_SEND_TIMINGS;
const SYNTHETICS_WAIT_TIMINGS = 'synthetics.payload.timings.wait';
exports.SYNTHETICS_WAIT_TIMINGS = SYNTHETICS_WAIT_TIMINGS;
const SYNTHETICS_TOTAL_TIMINGS = 'synthetics.payload.timings.total';
exports.SYNTHETICS_TOTAL_TIMINGS = SYNTHETICS_TOTAL_TIMINGS;
const NETWORK_TIMINGS_FIELDS = [SYNTHETICS_DNS_TIMINGS, SYNTHETICS_SSL_TIMINGS, SYNTHETICS_BLOCKED_TIMINGS, SYNTHETICS_CONNECT_TIMINGS, SYNTHETICS_RECEIVE_TIMINGS, SYNTHETICS_SEND_TIMINGS, SYNTHETICS_WAIT_TIMINGS, SYNTHETICS_TOTAL_TIMINGS];
exports.NETWORK_TIMINGS_FIELDS = NETWORK_TIMINGS_FIELDS;