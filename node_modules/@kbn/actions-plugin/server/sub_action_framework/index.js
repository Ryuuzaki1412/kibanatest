"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSubActionConnectorFramework = void 0;
var _register = require("./register");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createSubActionConnectorFramework = ({
  actionsConfigUtils: configurationUtilities,
  actionTypeRegistry,
  logger
}) => {
  return {
    registerConnector: connector => {
      (0, _register.register)({
        actionTypeRegistry,
        logger,
        connector,
        configurationUtilities
      });
    }
  };
};
exports.createSubActionConnectorFramework = createSubActionConnectorFramework;