"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rangeSliderPersistableStateServiceFactory = void 0;
var _common = require("../../common");
var _range_slider_persistable_state = require("../../common/range_slider/range_slider_persistable_state");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const rangeSliderPersistableStateServiceFactory = () => {
  return {
    id: _common.RANGE_SLIDER_CONTROL,
    extract: (0, _range_slider_persistable_state.createRangeSliderExtract)(),
    inject: (0, _range_slider_persistable_state.createRangeSliderInject)()
  };
};
exports.rangeSliderPersistableStateServiceFactory = rangeSliderPersistableStateServiceFactory;