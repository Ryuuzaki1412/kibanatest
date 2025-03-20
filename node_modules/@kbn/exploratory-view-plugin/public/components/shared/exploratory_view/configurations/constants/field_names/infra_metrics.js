"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SYSTEM_MEMORY_PERCENTAGE_FIELD = exports.SYSTEM_CPU_PERCENTAGE_FIELD = exports.K8S_POD_CPU_PERCENTAGE_FIELD = exports.DOCKER_CPU_PERCENTAGE_FIELD = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const SYSTEM_CPU_PERCENTAGE_FIELD = 'system.cpu.total.norm.pct';
exports.SYSTEM_CPU_PERCENTAGE_FIELD = SYSTEM_CPU_PERCENTAGE_FIELD;
const SYSTEM_MEMORY_PERCENTAGE_FIELD = 'system.memory.used.pct';
exports.SYSTEM_MEMORY_PERCENTAGE_FIELD = SYSTEM_MEMORY_PERCENTAGE_FIELD;
const DOCKER_CPU_PERCENTAGE_FIELD = 'docker.cpu.total.pct';
exports.DOCKER_CPU_PERCENTAGE_FIELD = DOCKER_CPU_PERCENTAGE_FIELD;
const K8S_POD_CPU_PERCENTAGE_FIELD = 'kubernetes.pod.cpu.usage.node.pct';
exports.K8S_POD_CPU_PERCENTAGE_FIELD = K8S_POD_CPU_PERCENTAGE_FIELD;