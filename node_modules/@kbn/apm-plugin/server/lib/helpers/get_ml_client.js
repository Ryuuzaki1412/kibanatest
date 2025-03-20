"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMlClient = getMlClient;
var _license_check = require("../../../common/license_check");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getMlClient({
  plugins,
  context,
  request
}) {
  const [coreContext, licensingContext] = await Promise.all([context.core, context.licensing]);
  const mlplugin = plugins.ml;
  if (!mlplugin || !(0, _license_check.isActivePlatinumLicense)(licensingContext.license)) {
    return;
  }
  return {
    mlSystem: mlplugin.setup.mlSystemProvider(request, coreContext.savedObjects.client),
    anomalyDetectors: mlplugin.setup.anomalyDetectorsProvider(request, coreContext.savedObjects.client),
    modules: mlplugin.setup.modulesProvider(request, coreContext.savedObjects.client)
  };
}