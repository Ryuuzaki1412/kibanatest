"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateGuideState = exports.findGuideById = exports.findAllGuides = exports.findActiveGuide = void 0;
var _saved_objects = require("../saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const findGuideById = async (savedObjectsClient, guideId) => {
  return savedObjectsClient.find({
    type: _saved_objects.guideStateSavedObjectsType,
    search: `"${guideId}"`,
    searchFields: ['guideId']
  });
};
exports.findGuideById = findGuideById;
const findActiveGuide = async savedObjectsClient => {
  return savedObjectsClient.find({
    type: _saved_objects.guideStateSavedObjectsType,
    search: 'true',
    searchFields: ['isActive']
  });
};
exports.findActiveGuide = findActiveGuide;
const findAllGuides = async savedObjectsClient => {
  return savedObjectsClient.find({
    type: _saved_objects.guideStateSavedObjectsType
  });
};
exports.findAllGuides = findAllGuides;
const updateGuideState = async (savedObjectsClient, updatedGuideState) => {
  const selectedGuideSO = await findGuideById(savedObjectsClient, updatedGuideState.guideId);

  // If the SO already exists, update it, else create a new SO
  if (selectedGuideSO.total > 0) {
    const updatedGuides = [];
    const selectedGuide = selectedGuideSO.saved_objects[0];
    updatedGuides.push({
      type: _saved_objects.guideStateSavedObjectsType,
      id: selectedGuide.id,
      attributes: {
        ...updatedGuideState
      }
    });

    // If we are activating a new guide, we need to check if there is a different, existing active guide
    // If yes, we need to mark it as inactive (only 1 guide can be active at a time)
    if (updatedGuideState.isActive) {
      const activeGuideSO = await findActiveGuide(savedObjectsClient);
      if (activeGuideSO.total > 0) {
        const activeGuide = activeGuideSO.saved_objects[0];
        if (activeGuide.attributes.guideId !== updatedGuideState.guideId) {
          updatedGuides.push({
            type: _saved_objects.guideStateSavedObjectsType,
            id: activeGuide.id,
            attributes: {
              ...activeGuide.attributes,
              isActive: false
            }
          });
        }
      }
    }
    const updatedGuidesResponse = await savedObjectsClient.bulkUpdate(updatedGuides);
    return updatedGuidesResponse;
  } else {
    // If we are activating a new guide, we need to check if there is an existing active guide
    // If yes, we need to mark it as inactive (only 1 guide can be active at a time)
    if (updatedGuideState.isActive) {
      const activeGuideSO = await findActiveGuide(savedObjectsClient);
      if (activeGuideSO.total > 0) {
        const activeGuide = activeGuideSO.saved_objects[0];
        await savedObjectsClient.update(_saved_objects.guideStateSavedObjectsType, activeGuide.id, {
          ...activeGuide.attributes,
          isActive: false
        });
      }
    }
    const createdGuideResponse = await savedObjectsClient.create(_saved_objects.guideStateSavedObjectsType, updatedGuideState, {
      id: updatedGuideState.guideId
    });
    return createdGuideResponse;
  }
};
exports.updateGuideState = updateGuideState;