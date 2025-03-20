"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePluginStatus = exports.getPluginState = exports.calculateIsActivePeriod = void 0;
var _guide_state_utils = require("./guide_state_utils");
var _saved_objects = require("../saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

// hard code the duration to 30 days for now https://github.com/elastic/kibana/issues/144997
const activePeriodDurationInMilliseconds = 30 * 24 * 60 * 60 * 1000;
const calculateIsActivePeriod = creationDate => {
  if (!creationDate) return false;
  const parsedCreationDate = Date.parse(creationDate);
  const endOfActivePeriodDate = new Date(parsedCreationDate + activePeriodDurationInMilliseconds);
  const now = new Date();
  return now < endOfActivePeriodDate;
};
exports.calculateIsActivePeriod = calculateIsActivePeriod;
const getPluginState = async savedObjectsClient => {
  const pluginStateSO = await savedObjectsClient.find({
    type: _saved_objects.pluginStateSavedObjectsType
  });
  if (pluginStateSO.saved_objects.length === 1) {
    const {
      status,
      creationDate
    } = pluginStateSO.saved_objects[0].attributes;
    const isActivePeriod = calculateIsActivePeriod(creationDate);
    const activeGuideSO = await (0, _guide_state_utils.findActiveGuide)(savedObjectsClient);
    const pluginState = {
      status: status,
      isActivePeriod
    };
    if (activeGuideSO.saved_objects.length === 1) {
      pluginState.activeGuide = activeGuideSO.saved_objects[0].attributes;
    }
    return pluginState;
  } else {
    // create a SO to keep track of the correct creation date
    await updatePluginStatus(savedObjectsClient, 'not_started');
    return {
      status: 'not_started',
      isActivePeriod: true
    };
  }
};
exports.getPluginState = getPluginState;
const updatePluginStatus = async (savedObjectsClient, status) => {
  return await savedObjectsClient.update(_saved_objects.pluginStateSavedObjectsType, _saved_objects.pluginStateSavedObjectsId, {
    status
  }, {
    // if there is no saved object yet, insert a new SO with the creation date
    upsert: {
      status,
      creationDate: new Date().toISOString()
    }
  });
};
exports.updatePluginStatus = updatePluginStatus;