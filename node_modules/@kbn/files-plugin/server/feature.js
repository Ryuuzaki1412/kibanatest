"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filesFeature = void 0;
var _coreApplicationCommon = require("@kbn/core-application-common");
var _i18n = require("@kbn/i18n");
var _common = require("../common");
var _constants = require("../common/constants");
var _saved_objects = require("./saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

// TODO: This should be registered once we have a management section for files content
const filesFeature = {
  id: _common.PLUGIN_ID,
  name: _i18n.i18n.translate('files.featureRegistry.filesFeatureName', {
    defaultMessage: 'Files'
  }),
  minimumLicense: 'basic',
  order: 10000,
  category: _coreApplicationCommon.DEFAULT_APP_CATEGORIES.management,
  app: [_common.PLUGIN_ID],
  privilegesTooltip: _i18n.i18n.translate('files.featureRegistry.filesPrivilegesTooltip', {
    defaultMessage: 'Provide access to files across all apps'
  }),
  privileges: {
    all: {
      app: [_common.PLUGIN_ID],
      savedObject: {
        all: _saved_objects.hiddenTypes,
        read: _saved_objects.hiddenTypes
      },
      ui: [],
      api: [_constants.FILES_MANAGE_PRIVILEGE]
    },
    read: {
      app: [_common.PLUGIN_ID],
      savedObject: {
        all: _saved_objects.hiddenTypes,
        read: _saved_objects.hiddenTypes
      },
      ui: []
    }
  }
};
exports.filesFeature = filesFeature;