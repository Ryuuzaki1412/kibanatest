"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installPrepackagedRules = void 0;
var _create_index_route = require("../../lib/detection_engine/routes/index/create_index_route");
var _prebuilt_rules = require("../../lib/detection_engine/prebuilt_rules");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * As part of a user taking advantage of Endpoint Security from within fleet, we attempt to install
 * the pre-packaged rules from the detection engine, which includes an Endpoint Rule enabled by default
 */
const installPrepackagedRules = async ({
  logger,
  context,
  request,
  alerts,
  exceptionsClient
}) => {
  // Create detection index & rules (if necessary). move past any failure, this is just a convenience
  try {
    await (0, _create_index_route.createDetectionIndex)(context);
  } catch (err) {
    if (err.statusCode !== 409) {
      // 409 -> detection index already exists, which is fine
      logger.warn(`Possible problem creating detection signals index (${err.statusCode}): ${err.message}`);
    }
  }
  try {
    // this checks to make sure index exists first, safe to try in case of failure above
    // may be able to recover from minor errors
    await (0, _prebuilt_rules.createPrepackagedRules)(context, alerts.getRulesClientWithRequest(request), exceptionsClient);
  } catch (err) {
    logger.error(`Unable to create detection rules automatically (${err.statusCode}): ${err.message}`);
  }
};
exports.installPrepackagedRules = installPrepackagedRules;