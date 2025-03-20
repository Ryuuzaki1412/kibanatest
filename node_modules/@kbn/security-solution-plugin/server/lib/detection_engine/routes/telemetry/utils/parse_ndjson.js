"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseNdjson = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const parseNdjson = messages => {
  return messages.map(message => {
    const splitByNewLine = message.split('\n');
    const linesParsed = splitByNewLine.flatMap(line => {
      try {
        return JSON.parse(line);
      } catch (error) {
        return [];
      }
    });
    return linesParsed;
  });
};
exports.parseNdjson = parseNdjson;