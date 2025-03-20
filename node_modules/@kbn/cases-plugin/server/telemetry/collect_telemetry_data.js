"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collectTelemetryData = void 0;
var _alerts = require("./queries/alerts");
var _cases = require("./queries/cases");
var _comments = require("./queries/comments");
var _configuration = require("./queries/configuration");
var _connectors = require("./queries/connectors");
var _pushes = require("./queries/pushes");
var _user_actions = require("./queries/user_actions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const collectTelemetryData = async ({
  savedObjectsClient,
  logger
}) => {
  try {
    const [cases, userActions, comments, alerts, connectors, pushes, configuration] = await Promise.all([(0, _cases.getCasesTelemetryData)({
      savedObjectsClient,
      logger
    }), (0, _user_actions.getUserActionsTelemetryData)({
      savedObjectsClient,
      logger
    }), (0, _comments.getUserCommentsTelemetryData)({
      savedObjectsClient,
      logger
    }), (0, _alerts.getAlertsTelemetryData)({
      savedObjectsClient,
      logger
    }), (0, _connectors.getConnectorsTelemetryData)({
      savedObjectsClient,
      logger
    }), (0, _pushes.getPushedTelemetryData)({
      savedObjectsClient,
      logger
    }), (0, _configuration.getConfigurationTelemetryData)({
      savedObjectsClient,
      logger
    })]);
    return {
      cases,
      userActions,
      comments,
      alerts,
      connectors,
      pushes,
      configuration
    };
  } catch (err) {
    logger.debug('Failed collecting Cases telemetry data');
    logger.debug(err);
    /**
     * Return an empty object instead of an empty state to distinguish between
     * clusters that they do not use cases thus all counts will be zero
     * and clusters where an error occurred.
     *  */

    return {};
  }
};
exports.collectTelemetryData = collectTelemetryData;