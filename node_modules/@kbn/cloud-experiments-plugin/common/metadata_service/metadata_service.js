"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MetadataService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _rxjs = require("rxjs");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class MetadataService {
  constructor(config) {
    (0, _defineProperty2.default)(this, "_userMetadata$", new _rxjs.BehaviorSubject(undefined));
    (0, _defineProperty2.default)(this, "stop$", new _rxjs.Subject());
    this.config = config;
  }
  setup(initialUserMetadata) {
    this._userMetadata$.next(initialUserMetadata);

    // Calculate `inTrial` based on the `trialEndDate`.
    // Elastic Cloud allows customers to end their trials earlier or even extend it in some cases, but this is a good compromise for now.
    const trialEndDate = initialUserMetadata.trialEndDate;
    if (trialEndDate) {
      this.scheduleUntil(() => ({
        inTrial: Date.now() <= new Date(trialEndDate).getTime()
      }),
      // Stop recalculating inTrial when the user is no-longer in trial
      metadata => metadata.inTrial === false);
    }
  }
  get userMetadata$() {
    return this._userMetadata$.pipe((0, _rxjs.filter)(Boolean),
    // Ensure we don't return undefined
    (0, _rxjs.debounceTime)(100),
    // Swallows multiple emissions that may occur during bootstrap
    (0, _rxjs.distinct)(meta => [meta.inTrial, meta.hasData].join('-')),
    // Checks if any of the dynamic fields have changed
    (0, _rxjs.shareReplay)(1));
  }
  start({
    hasDataFetcher
  }) {
    // If no initial metadata (setup was not called) => it should not schedule any metadata extension
    if (!this._userMetadata$.value) return;
    this.scheduleUntil(async () => hasDataFetcher(),
    // Stop checking the moment the user has any data
    metadata => metadata.hasData === true);
  }
  stop() {
    this.stop$.next();
    this._userMetadata$.complete();
  }

  /**
   * Schedules a timer that calls `fn` to update the {@link UserMetadata} until `untilFn` returns true.
   * @param fn Method to calculate the dynamic metadata.
   * @param untilFn Method that returns true when the scheduler should stop calling fn (potentially because the dynamic value is not expected to change anymore).
   * @private
   */
  scheduleUntil(fn, untilFn) {
    (0, _rxjs.timer)(0, this.config.metadata_refresh_interval.asMilliseconds()).pipe((0, _rxjs.takeUntil)(this.stop$), (0, _rxjs.exhaustMap)(async () => {
      this._userMetadata$.next({
        ...this._userMetadata$.value,
        // We are running the schedules after the initial user metadata is set
        ...(await fn())
      });
    }), (0, _rxjs.takeWhile)(() => {
      return !untilFn(this._userMetadata$.value);
    })).subscribe();
  }
}
exports.MetadataService = MetadataService;