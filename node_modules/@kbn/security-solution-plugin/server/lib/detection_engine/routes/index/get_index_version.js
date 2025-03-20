"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIndexVersion = void 0;
var _lodash = require("lodash");
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getIndexVersion = async (esClient, index) => {
  var _get;
  const indexAlias = await esClient.indices.getAlias({
    index
  });
  const writeIndex = Object.keys(indexAlias).find(key => {
    var _indexAlias$key$alias;
    return (_indexAlias$key$alias = indexAlias[key].aliases[index]) === null || _indexAlias$key$alias === void 0 ? void 0 : _indexAlias$key$alias.is_write_index;
  });
  if (writeIndex === undefined) {
    return 0;
  }
  const writeIndexMapping = await (0, _securitysolutionEsUtils.readIndex)(esClient, writeIndex);
  return (_get = (0, _lodash.get)(writeIndexMapping, ['body', writeIndex, 'mappings', '_meta', 'version'])) !== null && _get !== void 0 ? _get : 0;
};
exports.getIndexVersion = getIndexVersion;