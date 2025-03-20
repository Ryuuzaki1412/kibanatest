"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TinesWebhooksActionResponseSchema = exports.TinesWebhooksActionParamsSchema = exports.TinesWebhookObjectSchema = exports.TinesStoryObjectSchema = exports.TinesStoriesActionResponseSchema = exports.TinesStoriesActionParamsSchema = exports.TinesSecretsSchema = exports.TinesRunActionResponseSchema = exports.TinesRunActionParamsSchema = exports.TinesConfigSchema = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// Connector schema
const TinesConfigSchema = _configSchema.schema.object({
  url: _configSchema.schema.string()
});
exports.TinesConfigSchema = TinesConfigSchema;
const TinesSecretsSchema = _configSchema.schema.object({
  email: _configSchema.schema.string(),
  token: _configSchema.schema.string()
});

// Stories action schema
exports.TinesSecretsSchema = TinesSecretsSchema;
const TinesStoriesActionParamsSchema = null;
exports.TinesStoriesActionParamsSchema = TinesStoriesActionParamsSchema;
const TinesStoryObjectSchema = _configSchema.schema.object({
  id: _configSchema.schema.number(),
  name: _configSchema.schema.string(),
  published: _configSchema.schema.boolean()
});
exports.TinesStoryObjectSchema = TinesStoryObjectSchema;
const TinesStoriesActionResponseSchema = _configSchema.schema.object({
  stories: _configSchema.schema.arrayOf(TinesStoryObjectSchema),
  incompleteResponse: _configSchema.schema.boolean()
});

// Webhooks action schema
exports.TinesStoriesActionResponseSchema = TinesStoriesActionResponseSchema;
const TinesWebhooksActionParamsSchema = _configSchema.schema.object({
  storyId: _configSchema.schema.number()
});
exports.TinesWebhooksActionParamsSchema = TinesWebhooksActionParamsSchema;
const TinesWebhookObjectSchema = _configSchema.schema.object({
  id: _configSchema.schema.number(),
  name: _configSchema.schema.string(),
  storyId: _configSchema.schema.number(),
  path: _configSchema.schema.string(),
  secret: _configSchema.schema.string()
});
exports.TinesWebhookObjectSchema = TinesWebhookObjectSchema;
const TinesWebhooksActionResponseSchema = _configSchema.schema.object({
  webhooks: _configSchema.schema.arrayOf(TinesWebhookObjectSchema),
  incompleteResponse: _configSchema.schema.boolean()
});

// Run action schema
exports.TinesWebhooksActionResponseSchema = TinesWebhooksActionResponseSchema;
const TinesRunActionParamsSchema = _configSchema.schema.object({
  webhook: _configSchema.schema.maybe(TinesWebhookObjectSchema),
  webhookUrl: _configSchema.schema.maybe(_configSchema.schema.string()),
  body: _configSchema.schema.string()
});
exports.TinesRunActionParamsSchema = TinesRunActionParamsSchema;
const TinesRunActionResponseSchema = _configSchema.schema.object({}, {
  unknowns: 'ignore'
});
exports.TinesRunActionResponseSchema = TinesRunActionResponseSchema;