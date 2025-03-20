"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Status = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
/**
 * These types track an API call's status and result
 * Each Status string corresponds to a possible status in a request's lifecycle
 */
let Status;
exports.Status = Status;
(function (Status) {
  Status[Status["IDLE"] = 0] = "IDLE";
  Status[Status["LOADING"] = 1] = "LOADING";
  Status[Status["SUCCESS"] = 2] = "SUCCESS";
  Status[Status["ERROR"] = 3] = "ERROR";
})(Status || (exports.Status = Status = {}));