"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.featurePrivilegeBuilderFactory = void 0;
var _lodash = require("lodash");
var _alerting = require("./alerting");
var _api = require("./api");
var _app = require("./app");
var _cases = require("./cases");
var _catalogue = require("./catalogue");
var _management = require("./management");
var _navlink = require("./navlink");
var _saved_object = require("./saved_object");
var _ui = require("./ui");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const featurePrivilegeBuilderFactory = actions => {
  const builders = [new _api.FeaturePrivilegeApiBuilder(actions), new _app.FeaturePrivilegeAppBuilder(actions), new _catalogue.FeaturePrivilegeCatalogueBuilder(actions), new _management.FeaturePrivilegeManagementBuilder(actions), new _navlink.FeaturePrivilegeNavlinkBuilder(actions), new _saved_object.FeaturePrivilegeSavedObjectBuilder(actions), new _ui.FeaturePrivilegeUIBuilder(actions), new _alerting.FeaturePrivilegeAlertingBuilder(actions), new _cases.FeaturePrivilegeCasesBuilder(actions)];
  return {
    getActions(privilege, feature) {
      return (0, _lodash.flatten)(builders.map(builder => builder.getActions(privilege, feature)));
    }
  };
};
exports.featurePrivilegeBuilderFactory = featurePrivilegeBuilderFactory;