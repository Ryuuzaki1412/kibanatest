"use strict";

var _ = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

describe('Filters Schema Test', () => {
  it('accepts a single host status', () => {
    expect(_.endpointFilters.validate({
      host_status: ['error']
    })).toBeTruthy();
  });
  it('accepts multiple host status filters', () => {
    expect(_.endpointFilters.validate({
      host_status: ['offline', 'unenrolling']
    })).toBeTruthy();
  });
  it('rejects invalid statuses', () => {
    expect(() => _.endpointFilters.validate({
      host_status: ['foobar']
    })).toThrowError();
  });
  it('accepts a KQL string', () => {
    expect(_.endpointFilters.validate({
      kql: 'whatever.field'
    })).toBeTruthy();
  });
  it('accepts KQL + status', () => {
    expect(_.endpointFilters.validate({
      kql: 'thing.var',
      host_status: ['online']
    })).toBeTruthy();
  });
  it('accepts no filters', () => {
    expect(_.endpointFilters.validate({})).toBeTruthy();
  });
});