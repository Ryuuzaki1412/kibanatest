"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUsageCollector = registerUsageCollector;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerUsageCollector(usageCollection, getLaunchDarklyEntities) {
  usageCollection.registerCollector(usageCollection.makeUsageCollector({
    type: 'cloudExperiments',
    isReady: () => true,
    schema: {
      initialized: {
        type: 'boolean',
        _meta: {
          description: 'Whether the A/B testing client is correctly initialized (identify has been called)'
        }
      },
      // We'll likely map "flags" as `flattened`, so "flagNames" helps out to discover the key names
      flags: {
        type: 'pass_through',
        _meta: {
          description: 'Flags received by the client'
        }
      },
      flagNames: {
        type: 'array',
        items: {
          type: 'keyword',
          _meta: {
            description: 'Names of the flags received by the client'
          }
        }
      }
    },
    fetch: async () => {
      const {
        launchDarklyClient
      } = getLaunchDarklyEntities();
      if (!launchDarklyClient) return {
        initialized: false,
        flagNames: [],
        flags: {}
      };
      return await launchDarklyClient.getAllFlags();
    }
  }));
}