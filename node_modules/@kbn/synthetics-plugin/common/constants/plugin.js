"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PLUGIN = void 0;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const PLUGIN = {
  APP_ROOT_ID: 'react-uptime-root',
  DESCRIPTION: _i18n.i18n.translate('xpack.synthetics.pluginDescription', {
    defaultMessage: 'Synthetics monitoring',
    description: 'The description text that will appear in the feature catalogue.'
  }),
  ID: 'uptime',
  SYNTHETICS_PLUGIN_ID: 'synthetics',
  LOCAL_STORAGE_KEY: 'xpack.synthetics.',
  NAME: _i18n.i18n.translate('xpack.synthetics.featureRegistry.syntheticsFeatureName', {
    defaultMessage: 'Synthetics and Uptime'
  }),
  TITLE: _i18n.i18n.translate('xpack.synthetics.uptimeFeatureCatalogueTitle', {
    defaultMessage: 'Uptime'
  }),
  SYNTHETICS: _i18n.i18n.translate('xpack.synthetics.syntheticsFeatureCatalogueTitle', {
    defaultMessage: 'Synthetics'
  })
};
exports.PLUGIN = PLUGIN;