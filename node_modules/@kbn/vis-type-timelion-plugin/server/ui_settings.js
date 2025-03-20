"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUiSettings = getUiSettings;
var _i18n = require("@kbn/i18n");
var _configSchema = require("@kbn/config-schema");
var _constants = require("../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function getUiSettings() {
  return {
    [_constants.UI_SETTINGS.ES_TIMEFIELD]: {
      name: _i18n.i18n.translate('timelion.uiSettings.timeFieldLabel', {
        defaultMessage: 'Time field'
      }),
      value: '@timestamp',
      description: _i18n.i18n.translate('timelion.uiSettings.timeFieldDescription', {
        defaultMessage: 'Default field containing a timestamp when using {esParam}',
        values: {
          esParam: '.es()'
        }
      }),
      category: ['timelion'],
      schema: _configSchema.schema.string()
    },
    [_constants.UI_SETTINGS.DEFAULT_INDEX]: {
      name: _i18n.i18n.translate('timelion.uiSettings.defaultIndexLabel', {
        defaultMessage: 'Default index'
      }),
      value: '_all',
      description: _i18n.i18n.translate('timelion.uiSettings.defaultIndexDescription', {
        defaultMessage: 'Default elasticsearch index to search with {esParam}',
        values: {
          esParam: '.es()'
        }
      }),
      category: ['timelion'],
      schema: _configSchema.schema.string()
    },
    [_constants.UI_SETTINGS.TARGET_BUCKETS]: {
      name: _i18n.i18n.translate('timelion.uiSettings.targetBucketsLabel', {
        defaultMessage: 'Target buckets'
      }),
      value: 200,
      description: _i18n.i18n.translate('timelion.uiSettings.targetBucketsDescription', {
        defaultMessage: 'The number of buckets to shoot for when using auto intervals'
      }),
      category: ['timelion'],
      schema: _configSchema.schema.number()
    },
    [_constants.UI_SETTINGS.MAX_BUCKETS]: {
      name: _i18n.i18n.translate('timelion.uiSettings.maximumBucketsLabel', {
        defaultMessage: 'Maximum buckets'
      }),
      value: 2000,
      description: _i18n.i18n.translate('timelion.uiSettings.maximumBucketsDescription', {
        defaultMessage: 'The maximum number of buckets a single datasource can return'
      }),
      category: ['timelion'],
      schema: _configSchema.schema.number()
    },
    [_constants.UI_SETTINGS.MIN_INTERVAL]: {
      name: _i18n.i18n.translate('timelion.uiSettings.minimumIntervalLabel', {
        defaultMessage: 'Minimum interval'
      }),
      value: '1ms',
      description: _i18n.i18n.translate('timelion.uiSettings.minimumIntervalDescription', {
        defaultMessage: 'The smallest interval that will be calculated when using "auto"',
        description: '"auto" is a technical value in that context, that should not be translated.'
      }),
      category: ['timelion'],
      schema: _configSchema.schema.string()
    }
  };
}