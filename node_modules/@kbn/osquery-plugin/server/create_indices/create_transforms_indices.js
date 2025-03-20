"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeTransformsIndices = exports.createIndexIfNotExists = exports.ACTION_RESPONSES_INDEX_NAME = exports.ACTION_RESPONSES_INDEX_DEFAULT_NS = exports.ACTIONS_INDEX_NAME = exports.ACTIONS_INDEX_DEFAULT_NS = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _actions_mapping = require("./actions_mapping");
var _action_responses_mapping = require("./action_responses_mapping");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ACTIONS_INDEX_NAME = 'osquery_manager.actions';
exports.ACTIONS_INDEX_NAME = ACTIONS_INDEX_NAME;
const ACTIONS_INDEX_DEFAULT_NS = '.logs-' + ACTIONS_INDEX_NAME + '-default';
exports.ACTIONS_INDEX_DEFAULT_NS = ACTIONS_INDEX_DEFAULT_NS;
const ACTION_RESPONSES_INDEX_NAME = 'osquery_manager.action.responses';
exports.ACTION_RESPONSES_INDEX_NAME = ACTION_RESPONSES_INDEX_NAME;
const ACTION_RESPONSES_INDEX_DEFAULT_NS = '.logs-' + ACTION_RESPONSES_INDEX_NAME + '-default';
exports.ACTION_RESPONSES_INDEX_DEFAULT_NS = ACTION_RESPONSES_INDEX_DEFAULT_NS;
const initializeTransformsIndices = async (esClient, logger) => Promise.all([createIndexIfNotExists(esClient, ACTIONS_INDEX_NAME, ACTIONS_INDEX_DEFAULT_NS, _actions_mapping.actionsMapping, logger), createIndexIfNotExists(esClient, ACTION_RESPONSES_INDEX_NAME, ACTION_RESPONSES_INDEX_DEFAULT_NS, _action_responses_mapping.actionResponsesMapping, logger)]);
exports.initializeTransformsIndices = initializeTransformsIndices;
const createIndexIfNotExists = async (esClient, indexTemplateName, indexPattern, mappings, logger) => {
  try {
    const isLatestIndexExists = await esClient.indices.exists({
      index: indexPattern
    });
    if (!isLatestIndexExists) {
      await esClient.indices.putIndexTemplate({
        name: indexTemplateName,
        index_patterns: indexPattern,
        template: {
          mappings
        },
        priority: 500
      });
      await esClient.indices.create({
        index: indexPattern,
        mappings
      });
    }
  } catch (err) {
    const error = (0, _securitysolutionEsUtils.transformError)(err);
    logger.error(`Failed to create the index template: ${indexTemplateName}`);
    logger.error(error.message);
  }
};
exports.createIndexIfNotExists = createIndexIfNotExists;