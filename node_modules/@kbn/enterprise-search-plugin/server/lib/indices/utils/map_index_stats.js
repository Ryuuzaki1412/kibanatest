"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapIndexStats = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const mapIndexStats = (indexData, indexStats, indexName) => {
  var _indexStats$total$sto, _indexStats$total, _indexStats$total$sto2, _indexStats$total$doc, _indexStats$total2, _indexStats$total2$do, _indexStats$total$doc2, _indexStats$total3, _indexStats$total3$do, _indexData$settings, _indexData$settings$i;
  const aliases = Object.keys(indexData.aliases);
  const sizeInBytes = new _configSchema.ByteSizeValue((_indexStats$total$sto = indexStats === null || indexStats === void 0 ? void 0 : (_indexStats$total = indexStats.total) === null || _indexStats$total === void 0 ? void 0 : (_indexStats$total$sto2 = _indexStats$total.store) === null || _indexStats$total$sto2 === void 0 ? void 0 : _indexStats$total$sto2.size_in_bytes) !== null && _indexStats$total$sto !== void 0 ? _indexStats$total$sto : 0).toString();
  const docCount = (_indexStats$total$doc = indexStats === null || indexStats === void 0 ? void 0 : (_indexStats$total2 = indexStats.total) === null || _indexStats$total2 === void 0 ? void 0 : (_indexStats$total2$do = _indexStats$total2.docs) === null || _indexStats$total2$do === void 0 ? void 0 : _indexStats$total2$do.count) !== null && _indexStats$total$doc !== void 0 ? _indexStats$total$doc : 0;
  const docDeleted = (_indexStats$total$doc2 = indexStats === null || indexStats === void 0 ? void 0 : (_indexStats$total3 = indexStats.total) === null || _indexStats$total3 === void 0 ? void 0 : (_indexStats$total3$do = _indexStats$total3.docs) === null || _indexStats$total3$do === void 0 ? void 0 : _indexStats$total3$do.deleted) !== null && _indexStats$total$doc2 !== void 0 ? _indexStats$total$doc2 : 0;
  const total = {
    docs: {
      count: docCount,
      deleted: docDeleted
    },
    store: {
      size_in_bytes: sizeInBytes
    }
  };
  return {
    aliases,
    health: indexStats === null || indexStats === void 0 ? void 0 : indexStats.health,
    hidden: Boolean((_indexData$settings = indexData.settings) === null || _indexData$settings === void 0 ? void 0 : (_indexData$settings$i = _indexData$settings.index) === null || _indexData$settings$i === void 0 ? void 0 : _indexData$settings$i.hidden),
    name: indexName,
    status: indexStats === null || indexStats === void 0 ? void 0 : indexStats.status,
    total,
    uuid: indexStats === null || indexStats === void 0 ? void 0 : indexStats.uuid
  };
};
exports.mapIndexStats = mapIndexStats;