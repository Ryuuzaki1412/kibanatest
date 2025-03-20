"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDownloadSourcesRequestSchema = exports.PutDownloadSourcesRequestSchema = exports.PostDownloadSourcesRequestSchema = exports.GetOneDownloadSourcesRequestSchema = exports.DeleteDownloadSourcesRequestSchema = void 0;
var _configSchema = require("@kbn/config-schema");
var _models = require("../models");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const GetOneDownloadSourcesRequestSchema = {
  params: _configSchema.schema.object({
    sourceId: _configSchema.schema.string()
  })
};
exports.GetOneDownloadSourcesRequestSchema = GetOneDownloadSourcesRequestSchema;
const getDownloadSourcesRequestSchema = {};
exports.getDownloadSourcesRequestSchema = getDownloadSourcesRequestSchema;
const PostDownloadSourcesRequestSchema = {
  body: _models.DownloadSourceSchema
};
exports.PostDownloadSourcesRequestSchema = PostDownloadSourcesRequestSchema;
const PutDownloadSourcesRequestSchema = {
  params: _configSchema.schema.object({
    sourceId: _configSchema.schema.string()
  }),
  body: _models.DownloadSourceSchema
};
exports.PutDownloadSourcesRequestSchema = PutDownloadSourcesRequestSchema;
const DeleteDownloadSourcesRequestSchema = {
  params: _configSchema.schema.object({
    sourceId: _configSchema.schema.string()
  })
};
exports.DeleteDownloadSourcesRequestSchema = DeleteDownloadSourcesRequestSchema;