"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLicenseUpdate = createLicenseUpdate;
var _rxjs = require("rxjs");
var _operators = require("rxjs/operators");
var _has_license_info_changed = require("./has_license_info_changed");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createLicenseUpdate(triggerRefresh$, stop$, fetcher, initialValues) {
  const manuallyRefresh$ = new _rxjs.Subject();
  const fetched$ = (0, _rxjs.merge)(triggerRefresh$, manuallyRefresh$).pipe((0, _operators.takeUntil)(stop$), (0, _operators.exhaustMap)(fetcher), (0, _operators.share)());

  // provide a first, empty license, so that we can compare in the filter below
  const startWithArgs = initialValues ? [undefined, initialValues] : [undefined];
  const license$ = fetched$.pipe((0, _operators.startWith)(...startWithArgs), (0, _operators.pairwise)(), (0, _operators.filter)(([previous, next]) => (0, _has_license_info_changed.hasLicenseInfoChanged)(previous, next)), (0, _operators.map)(([, next]) => next), (0, _operators.shareReplay)(1));

  // start periodic license fetch right away
  const licenseSub = license$.subscribe();
  stop$.pipe((0, _operators.finalize)(() => {
    manuallyRefresh$.complete();
    licenseSub.unsubscribe();
  })).subscribe();
  return {
    license$,
    refreshManually() {
      const licensePromise = (0, _rxjs.firstValueFrom)(fetched$);
      manuallyRefresh$.next();
      return licensePromise;
    }
  };
}