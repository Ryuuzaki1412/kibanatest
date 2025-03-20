"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.persistNotes = void 0;
var _saved_object = require("./saved_object");
var _get_overridable_note = require("./get_overridable_note");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const persistNotes = async (frameworkRequest, timelineSavedObjectId, existingNoteIds, newNotes, overrideOwner = true) => {
  var _newNotes$map;
  return Promise.all((_newNotes$map = newNotes === null || newNotes === void 0 ? void 0 : newNotes.map(async note => {
    var _existingNoteIds$find;
    const newNote = await (0, _get_overridable_note.getOverridableNote)(frameworkRequest, note, timelineSavedObjectId, overrideOwner);
    return (0, _saved_object.persistNote)({
      request: frameworkRequest,
      noteId: overrideOwner ? (_existingNoteIds$find = existingNoteIds === null || existingNoteIds === void 0 ? void 0 : existingNoteIds.find(nId => nId === note.noteId)) !== null && _existingNoteIds$find !== void 0 ? _existingNoteIds$find : null : null,
      note: newNote,
      overrideOwner
    });
  })) !== null && _newNotes$map !== void 0 ? _newNotes$map : []);
};
exports.persistNotes = persistNotes;