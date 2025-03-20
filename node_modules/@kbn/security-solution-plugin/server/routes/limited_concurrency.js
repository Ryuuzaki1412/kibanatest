"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerLimitedConcurrencyRoutes = registerLimitedConcurrencyRoutes;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class MaxCounter {
  constructor(max = 1) {
    (0, _defineProperty2.default)(this, "counter", 0);
    this.max = max;
  }
  valueOf() {
    return this.counter;
  }
  increase() {
    if (this.counter < this.max) {
      this.counter += 1;
    }
  }
  decrease() {
    if (this.counter > 0) {
      this.counter -= 1;
    }
  }
  lessThanMax() {
    return this.counter < this.max;
  }
}
function getRouteConcurrencyTag(request) {
  const tags = request.route.options.tags;
  return tags.find(tag => tag.startsWith(_constants.LIMITED_CONCURRENCY_ROUTE_TAG_PREFIX));
}
function shouldHandleRequest(request) {
  return getRouteConcurrencyTag(request) !== undefined;
}
function getRouteMaxConcurrency(request) {
  const tag = getRouteConcurrencyTag(request);
  return parseInt((tag === null || tag === void 0 ? void 0 : tag.split(':')[2]) || '', 10);
}
const initCounterMap = () => {
  const counterMap = new Map();
  const getCounter = request => {
    const path = request.route.path;
    if (!counterMap.has(path)) {
      const maxCount = getRouteMaxConcurrency(request);
      if (isNaN(maxCount)) {
        return null;
      }
      counterMap.set(path, new MaxCounter(maxCount));
    }
    return counterMap.get(path);
  };
  return {
    getCounter
  };
};

/**
 * This method limits concurrency for routes
 * It checks if route has tag that begins LIMITED_CONCURRENCY_ROUTE_TAG_PREFIX prefix
 * If tag is found and has concurrency number separated by colon ':', this max concurrency number will be applied to the route
 * If tag is malformed, i.e. not valid concurrency number, max concurency will not be applied to the route
 * @param core CoreSetup Context passed to the `setup` method of `standard` plugins.
 */
function registerLimitedConcurrencyRoutes(core) {
  const countersMap = initCounterMap();
  core.http.registerOnPreAuth(function preAuthHandler(request, response, toolkit) {
    if (!shouldHandleRequest(request)) {
      return toolkit.next();
    }
    const counter = countersMap.getCounter(request);
    if (counter === null) {
      return toolkit.next();
    }
    if (!counter.lessThanMax()) {
      return response.customError({
        body: 'Too Many Requests',
        statusCode: 429
      });
    }
    counter.increase();

    // when request is completed or aborted, decrease counter
    request.events.completed$.subscribe(() => {
      counter.decrease();
    });
    return toolkit.next();
  });
}