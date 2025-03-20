"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTimelines = void 0;
var _fp = require("lodash/fp");
var _moment = _interopRequireDefault(require("moment"));
var _saved_object = require("../../../saved_object");
var _persist_notes = require("../../../saved_object/notes/persist_notes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/** allow overrideNotesOwner means overriding by current username,
 * disallow overrideNotesOwner means keep the original username.
 * overrideNotesOwner = false only happens when import timeline templates,
 * as we want to keep the original creator for notes
 **/
const createTimelines = async ({
  frameworkRequest,
  timeline,
  timelineSavedObjectId = null,
  timelineVersion = null,
  pinnedEventIds = null,
  notes = [],
  existingNoteIds = [],
  isImmutable,
  overrideNotesOwner = true
}) => {
  var _timeline$dateRange, _timeline$dateRange2;
  const timerangeStart = isImmutable ? (0, _moment.default)().subtract(24, 'hours').toISOString() : (_timeline$dateRange = timeline.dateRange) === null || _timeline$dateRange === void 0 ? void 0 : _timeline$dateRange.start;
  const timerangeEnd = isImmutable ? (0, _moment.default)().toISOString() : (_timeline$dateRange2 = timeline.dateRange) === null || _timeline$dateRange2 === void 0 ? void 0 : _timeline$dateRange2.end;
  const responseTimeline = await _saved_object.timeline.persistTimeline(frameworkRequest, timelineSavedObjectId, timelineVersion, {
    ...timeline,
    dateRange: {
      start: timerangeStart,
      end: timerangeEnd
    }
  }, isImmutable);
  const newTimelineSavedObjectId = responseTimeline.timeline.savedObjectId;
  let myPromises = [];
  if (pinnedEventIds != null && !(0, _fp.isEmpty)(pinnedEventIds)) {
    myPromises = [...myPromises, _saved_object.pinnedEvent.savePinnedEvents(frameworkRequest, timelineSavedObjectId !== null && timelineSavedObjectId !== void 0 ? timelineSavedObjectId : newTimelineSavedObjectId, pinnedEventIds)];
  }
  if (!(0, _fp.isEmpty)(notes)) {
    myPromises = [...myPromises, (0, _persist_notes.persistNotes)(frameworkRequest, timelineSavedObjectId !== null && timelineSavedObjectId !== void 0 ? timelineSavedObjectId : newTimelineSavedObjectId, existingNoteIds, notes, overrideNotesOwner)];
  }
  if (myPromises.length > 0) {
    await Promise.all(myPromises);
  }
  return responseTimeline;
};
exports.createTimelines = createTimelines;