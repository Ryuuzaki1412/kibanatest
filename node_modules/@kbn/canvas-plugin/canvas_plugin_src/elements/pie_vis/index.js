"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pieVis = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const pieVis = () => ({
  name: 'pieVis',
  displayName: '(New) Pie Vis',
  type: 'chart',
  help: 'Pie visualization',
  icon: 'visPie',
  expression: `kibana
| selectFilter
| demodata
| head 10
| pieVis metrics={visdimension "age"} buckets={visdimension "project"} buckets={visdimension "cost"} legendDisplay="default"
| render`
});
exports.pieVis = pieVis;