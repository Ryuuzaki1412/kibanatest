"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fileAttributesReducer = fileAttributesReducer;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function fileAttributesReducer(state, {
  action,
  payload
}) {
  var _payload$name, _payload$alt, _payload$meta;
  switch (action) {
    case 'delete':
      return {
        ...state,
        status: 'DELETED'
      };
    case 'uploading':
      return {
        ...state,
        status: 'UPLOADING'
      };
    case 'uploaded':
      return {
        ...state,
        ...payload,
        status: 'READY'
      };
    case 'uploadError':
      return {
        ...state,
        status: 'UPLOAD_ERROR'
      };
    case 'updateFile':
      return {
        ...state,
        name: (_payload$name = payload.name) !== null && _payload$name !== void 0 ? _payload$name : state.name,
        alt: (_payload$alt = payload.alt) !== null && _payload$alt !== void 0 ? _payload$alt : state.alt,
        meta: (_payload$meta = payload.meta) !== null && _payload$meta !== void 0 ? _payload$meta : state.meta
      };
    default:
      return state;
  }
}