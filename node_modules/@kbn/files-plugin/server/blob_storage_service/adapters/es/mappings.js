"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mappings = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * These are the fields we expect to find a given document acting as a file chunk.
 *
 * @note not all fields are used by this adapter but this represents the standard
 * shape for any consumers of BlobStorage in ES.
 */

const mappings = {
  dynamic: false,
  properties: {
    data: {
      type: 'binary'
    },
    // Binary fields are automatically marked as not searchable by ES
    bid: {
      type: 'keyword',
      index: false
    },
    last: {
      type: 'boolean',
      index: false
    }
  } // Ensure that our ES types and TS types stay somewhat in sync
};
exports.mappings = mappings;