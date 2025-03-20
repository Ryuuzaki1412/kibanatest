"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeSliderPersistableStateServiceFactory = void 0;
var _common = require("../../common");
var _time_slider_persistable_state = require("../../common/time_slider/time_slider_persistable_state");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const timeSliderPersistableStateServiceFactory = () => {
  return {
    id: _common.TIME_SLIDER_CONTROL,
    extract: (0, _time_slider_persistable_state.createTimeSliderExtract)(),
    inject: (0, _time_slider_persistable_state.createTimeSliderInject)()
  };
};
exports.timeSliderPersistableStateServiceFactory = timeSliderPersistableStateServiceFactory;