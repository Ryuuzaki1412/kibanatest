"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unflattenObject = exports.transformLocationFields = exports.mapObjectValuesToStringArray = exports.formatResponseObjectValues = exports.formatLocationAsGeoEcs = void 0;
var _fp = require("lodash/fp");
var _saferLodashSet = require("@kbn/safer-lodash-set");
var _to_array = require("../../../common/utils/to_array");
var _field_formatters = require("../../../common/utils/field_formatters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const mapObjectValuesToStringArray = object => (0, _fp.mapValues)(o => {
  if ((0, _fp.isObject)(o) && !(0, _fp.isArray)(o)) {
    return mapObjectValuesToStringArray(o);
  }
  return (0, _to_array.toArray)(o);
}, object);
exports.mapObjectValuesToStringArray = mapObjectValuesToStringArray;
const formatResponseObjectValues = object => {
  if (object && typeof object === 'object') {
    return mapObjectValuesToStringArray(object);
  }
  return object;
};
exports.formatResponseObjectValues = formatResponseObjectValues;
const unflattenObject = object => Object.entries(object).reduce((acc, [key, value]) => {
  (0, _saferLodashSet.set)(acc, key, value);
  return acc;
}, {});
exports.unflattenObject = unflattenObject;
const formatLocationAsGeoEcs = item => {
  const itemGeo = item.length > 0 ? item[0] : null;
  if (!!itemGeo && (0, _fp.isArray)(itemGeo.coordinates) && itemGeo.coordinates.length > 1) {
    return {
      lon: [itemGeo.coordinates[0]],
      lat: [itemGeo.coordinates[1]]
    };
  }
  return item;
};
exports.formatLocationAsGeoEcs = formatLocationAsGeoEcs;
const transformLocationFields = locationFields => {
  const transformed = {
    ...locationFields
  };
  Object.entries(transformed).forEach(([key, item]) => {
    if ((0, _field_formatters.isGeoField)(key)) {
      transformed[key] = formatLocationAsGeoEcs(item);
    }
  });
  return transformed;
};
exports.transformLocationFields = transformLocationFields;