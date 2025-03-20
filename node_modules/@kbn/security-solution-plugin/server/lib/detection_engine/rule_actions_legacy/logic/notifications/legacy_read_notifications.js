"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legacyReadNotifications = void 0;
var _legacy_types = require("./legacy_types");
var _legacy_find_notifications = require("./legacy_find_notifications");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

// eslint-disable-next-line no-restricted-imports

// eslint-disable-next-line no-restricted-imports

/**
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 */
const legacyReadNotifications = async ({
  rulesClient,
  id,
  ruleAlertId
}) => {
  if (id != null) {
    try {
      const notification = await rulesClient.get({
        id
      });
      if ((0, _legacy_types.legacyIsAlertType)(notification)) {
        return notification;
      } else {
        return null;
      }
    } catch (err) {
      var _err$output;
      if ((err === null || err === void 0 ? void 0 : (_err$output = err.output) === null || _err$output === void 0 ? void 0 : _err$output.statusCode) === 404) {
        return null;
      } else {
        // throw non-404 as they would be 500 or other internal errors
        throw err;
      }
    }
  } else if (ruleAlertId != null) {
    const notificationFromFind = await (0, _legacy_find_notifications.legacyFindNotifications)({
      rulesClient,
      filter: `alert.attributes.params.ruleAlertId: "${ruleAlertId}"`,
      page: 1
    });
    if (notificationFromFind.data.length === 0 || !(0, _legacy_types.legacyIsAlertType)(notificationFromFind.data[0])) {
      return null;
    } else {
      return notificationFromFind.data[0];
    }
  } else {
    // should never get here, and yet here we are.
    return null;
  }
};
exports.legacyReadNotifications = legacyReadNotifications;