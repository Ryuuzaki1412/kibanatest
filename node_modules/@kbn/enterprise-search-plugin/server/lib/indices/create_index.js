"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createIndex = void 0;
var _text_analysis = require("./text_analysis");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const prefixMapping = {
  analyzer: 'i_prefix',
  index_options: 'docs',
  search_analyzer: 'q_prefix',
  type: 'text'
};
const delimiterMapping = {
  analyzer: 'iq_text_delimiter',
  index_options: 'freqs',
  type: 'text'
};
const joinedMapping = {
  analyzer: 'i_text_bigram',
  index_options: 'freqs',
  search_analyzer: 'q_text_bigram',
  type: 'text'
};
const enumMapping = {
  ignore_above: 2048,
  type: 'keyword'
};
const stemMapping = {
  analyzer: 'iq_text_stem',
  type: 'text'
};
const defaultMappings = {
  dynamic: true,
  dynamic_templates: [{
    all_text_fields: {
      mapping: {
        analyzer: 'iq_text_base',
        fields: {
          delimiter: delimiterMapping,
          enum: enumMapping,
          joined: joinedMapping,
          prefix: prefixMapping,
          stem: stemMapping
        }
      },
      match_mapping_type: 'string'
    }
  }]
};
const createIndex = async (client, indexName, language, applyMappings) => {
  return await client.asCurrentUser.indices.create({
    index: indexName,
    mappings: applyMappings ? defaultMappings : {},
    settings: {
      ...(0, _text_analysis.textAnalysisSettings)(language !== null && language !== void 0 ? language : undefined),
      auto_expand_replicas: '0-3',
      number_of_shards: 2
    }
  });
};
exports.createIndex = createIndex;