"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FleetPackagePolicyGenerator = void 0;
var _base_data_generator = require("./base_data_generator");
var _policy_config = require("../models/policy_config");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class FleetPackagePolicyGenerator extends _base_data_generator.BaseDataGenerator {
  generate(overrides = {}) {
    return {
      id: this.seededUUIDv4(),
      name: `Package Policy {${this.randomString(4)})`,
      description: 'Policy to protect the worlds data',
      created_at: this.randomPastDate(),
      created_by: this.randomUser(),
      updated_at: new Date().toISOString(),
      updated_by: this.randomUser(),
      policy_id: this.seededUUIDv4(),
      // agent policy id
      enabled: true,
      inputs: [],
      namespace: 'default',
      package: {
        name: 'endpoint',
        title: 'Elastic Endpoint',
        version: '1.0.0'
      },
      revision: 1,
      ...overrides
    };
  }
  generateEndpointPackagePolicy(overrides = {}) {
    return {
      ...this.generate({
        name: `Endpoint Policy {${this.randomString(4)})`
      }),
      inputs: [{
        type: 'endpoint',
        enabled: true,
        streams: [],
        config: {
          artifact_manifest: {
            value: {
              manifest_version: '1.0.0',
              schema_version: 'v1',
              artifacts: {}
            }
          },
          policy: {
            value: (0, _policy_config.policyFactory)()
          }
        }
      }],
      ...overrides
    };
  }
}
exports.FleetPackagePolicyGenerator = FleetPackagePolicyGenerator;