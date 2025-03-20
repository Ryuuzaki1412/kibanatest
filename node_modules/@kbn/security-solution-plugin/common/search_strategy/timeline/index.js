"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  FlowDirection: true
};
exports.FlowDirection = void 0;
var _events = require("./events");
Object.keys(_events).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _events[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _events[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let FlowDirection;
exports.FlowDirection = FlowDirection;
(function (FlowDirection) {
  FlowDirection["uniDirectional"] = "uniDirectional";
  FlowDirection["biDirectional"] = "biDirectional";
})(FlowDirection || (exports.FlowDirection = FlowDirection = {}));