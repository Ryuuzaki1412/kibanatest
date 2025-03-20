"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.textResult = exports.stackedByTextField = exports.stackedByBooleanField = exports.result = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const stackedByBooleanField = [{
  key: 1,
  key_as_string: 'true',
  doc_count: 7125,
  events: {
    bucket: [{
      key_as_string: '2022-05-10T15:34:48.075Z',
      key: 1652196888075,
      doc_count: 0
    }, {
      key_as_string: '2022-05-10T16:19:48.074Z',
      key: 1652199588074,
      doc_count: 774
    }, {
      key_as_string: '2022-05-10T17:04:48.073Z',
      key: 1652202288073,
      doc_count: 415
    }]
  }
}];
exports.stackedByBooleanField = stackedByBooleanField;
const result = [{
  x: 1652196888075,
  y: 0,
  g: 'true'
}, {
  x: 1652199588074,
  y: 774,
  g: 'true'
}, {
  x: 1652202288073,
  y: 415,
  g: 'true'
}];
exports.result = result;
const stackedByTextField = [{
  key: 'MacBook-Pro.local',
  doc_count: 7103,
  events: {
    bucket: [{
      key_as_string: '2022-05-10T15:34:48.075Z',
      key: 1652196888075,
      doc_count: 0
    }, {
      key_as_string: '2022-05-10T16:19:48.074Z',
      key: 1652199588074,
      doc_count: 774
    }, {
      key_as_string: '2022-05-10T17:04:48.073Z',
      key: 1652202288073,
      doc_count: 415
    }]
  }
}];
exports.stackedByTextField = stackedByTextField;
const textResult = [{
  x: 1652196888075,
  y: 0,
  g: 'MacBook-Pro.local'
}, {
  x: 1652199588074,
  y: 774,
  g: 'MacBook-Pro.local'
}, {
  x: 1652202288073,
  y: 415,
  g: 'MacBook-Pro.local'
}];
exports.textResult = textResult;