"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateOtherCategoryColor = migrateOtherCategoryColor;
var _lodash = _interopRequireDefault(require("lodash"));
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const COLOR_STYLES = [_constants.VECTOR_STYLES.FILL_COLOR, _constants.VECTOR_STYLES.LINE_COLOR, _constants.VECTOR_STYLES.LABEL_COLOR, _constants.VECTOR_STYLES.LABEL_BORDER_COLOR];
function migrateColorProperty(descriptor) {
  if (descriptor.type === _constants.STYLE_TYPE.STATIC) {
    return descriptor;
  }
  if (!descriptor.options.customColorPalette || descriptor.options.customColorPalette.length === 0) {
    return descriptor;
  }
  return {
    ...descriptor,
    options: {
      ...descriptor.options,
      otherCategoryColor: descriptor.options.customColorPalette[0].color,
      customColorPalette: descriptor.options.customColorPalette.length === 1 ? [] : descriptor.options.customColorPalette.slice(1)
    }
  };
}

// In 8.4 explicit "other category color" state added to ColorDynamicOptions
// Prior to 8.4, custom color ramp "other category color" stored in first element of customColorPalette
function migrateOtherCategoryColor({
  attributes
}) {
  if (!attributes || !attributes.layerListJSON) {
    return attributes;
  }
  let layerList = [];
  try {
    layerList = JSON.parse(attributes.layerListJSON);
  } catch (e) {
    throw new Error('Unable to parse attribute layerListJSON');
  }
  layerList.forEach(layerDescriptor => {
    var _layerDescriptor$styl;
    if (((_layerDescriptor$styl = layerDescriptor.style) === null || _layerDescriptor$styl === void 0 ? void 0 : _layerDescriptor$styl.type) !== _constants.LAYER_STYLE_TYPE.VECTOR) {
      return;
    }
    Object.keys(_lodash.default.get(layerDescriptor, 'style.properties', {})).forEach(key => {
      const styleName = key;
      if (!COLOR_STYLES.includes(styleName)) {
        return;
      }
      layerDescriptor.style.properties = {
        ...layerDescriptor.style.properties,
        [styleName]: migrateColorProperty(layerDescriptor.style.properties[styleName])
      };
    });
  });
  return {
    ...attributes,
    layerListJSON: JSON.stringify(layerList)
  };
}