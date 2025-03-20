"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Comparator = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let Comparator;
exports.Comparator = Comparator;
(function (Comparator) {
  Comparator["GT"] = ">";
  Comparator["LT"] = "<";
  Comparator["GT_OR_EQ"] = ">=";
  Comparator["LT_OR_EQ"] = "<=";
  Comparator["BETWEEN"] = "between";
  Comparator["NOT_BETWEEN"] = "notBetween";
})(Comparator || (exports.Comparator = Comparator = {}));