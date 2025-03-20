"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templateNeedsUpdate = exports.getTemplateVersion = exports.fieldAliasesOutdated = void 0;
var _lodash = require("lodash");
var _helpers = require("../../migrations/helpers");
var _get_signals_template = require("./get_signals_template");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getTemplateVersion = async ({
  alias,
  esClient
}) => {
  try {
    var _response$index_templ;
    const response = await esClient.indices.getIndexTemplate({
      name: alias
    });
    return (_response$index_templ = response.index_templates[0].index_template.version) !== null && _response$index_templ !== void 0 ? _response$index_templ : 0;
  } catch (e) {
    return 0;
  }
};
exports.getTemplateVersion = getTemplateVersion;
const templateNeedsUpdate = async ({
  alias,
  esClient
}) => {
  const templateVersion = await getTemplateVersion({
    alias,
    esClient
  });
  return (0, _helpers.isOutdated)({
    current: templateVersion,
    target: _get_signals_template.SIGNALS_TEMPLATE_VERSION
  });
};
exports.templateNeedsUpdate = templateNeedsUpdate;
const fieldAliasesOutdated = async (esClient, index) => {
  const indexMappings = await esClient.indices.get({
    index
  });
  for (const [indexName, mapping] of Object.entries(indexMappings)) {
    if (indexName.startsWith(`${index}-`)) {
      var _get, _mapping$mappings;
      const aliasesVersion = (_get = (0, _lodash.get)((_mapping$mappings = mapping.mappings) === null || _mapping$mappings === void 0 ? void 0 : _mapping$mappings._meta, _get_signals_template.ALIAS_VERSION_FIELD)) !== null && _get !== void 0 ? _get : 0;
      if (aliasesVersion < _get_signals_template.SIGNALS_FIELD_ALIASES_VERSION) {
        return true;
      }
    }
  }
  return false;
};
exports.fieldAliasesOutdated = fieldAliasesOutdated;