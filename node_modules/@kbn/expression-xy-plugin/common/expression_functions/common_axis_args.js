"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commonAxisConfigArgs = void 0;
var _i18n = require("../i18n");
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const commonAxisConfigArgs = {
  title: {
    types: ['string'],
    help: _i18n.strings.getAxisTitleHelp()
  },
  id: {
    types: ['string'],
    help: _i18n.strings.getAxisIdHelp()
  },
  hide: {
    types: ['boolean'],
    help: _i18n.strings.getAxisHideHelp()
  },
  labelColor: {
    types: ['string'],
    help: _i18n.strings.getAxisLabelColorHelp()
  },
  showOverlappingLabels: {
    types: ['boolean'],
    help: _i18n.strings.getAxisShowOverlappingLabelsHelp()
  },
  showDuplicates: {
    types: ['boolean'],
    help: _i18n.strings.getAxisShowDuplicatesHelp()
  },
  showGridLines: {
    types: ['boolean'],
    help: _i18n.strings.getAxisShowGridLinesHelp(),
    default: false
  },
  labelsOrientation: {
    types: ['number'],
    options: [0, -90, -45],
    help: _i18n.strings.getAxisLabelsOrientationHelp()
  },
  showLabels: {
    types: ['boolean'],
    help: _i18n.strings.getAxisShowLabelsHelp(),
    default: true
  },
  showTitle: {
    types: ['boolean'],
    help: _i18n.strings.getAxisShowTitleHelp(),
    default: true
  },
  truncate: {
    types: ['number'],
    help: _i18n.strings.getAxisTruncateHelp()
  },
  extent: {
    types: [_constants.AXIS_EXTENT_CONFIG],
    help: _i18n.strings.getAxisExtentHelp(),
    default: `{${_constants.AXIS_EXTENT_CONFIG}}`
  }
};
exports.commonAxisConfigArgs = commonAxisConfigArgs;