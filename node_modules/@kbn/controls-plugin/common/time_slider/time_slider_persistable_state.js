"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTimeSliderInject = exports.createTimeSliderExtract = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const createTimeSliderInject = () => {
  return (state, references) => {
    const workingState = {
      ...state
    };
    return workingState;
  };
};
exports.createTimeSliderInject = createTimeSliderInject;
const createTimeSliderExtract = () => {
  return state => {
    const workingState = {
      ...state
    };
    const references = [];
    return {
      state: workingState,
      references
    };
  };
};
exports.createTimeSliderExtract = createTimeSliderExtract;