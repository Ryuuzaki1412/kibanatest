"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPrereleaseFromSettings = getPrereleaseFromSettings;
var _app_context = require("../../app_context");
var _settings = require("../../settings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getPrereleaseFromSettings(savedObjectsClient) {
  let prerelease = false;
  try {
    ({
      prerelease_integrations_enabled: prerelease
    } = await (0, _settings.getSettings)(savedObjectsClient));
  } catch (err) {
    _app_context.appContextService.getLogger().warn('Error while trying to load prerelease flag from settings, defaulting to false', err);
  }
  return prerelease;
}