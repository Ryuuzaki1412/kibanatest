"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerPolicyRoutes = registerPolicyRoutes;
var _configSchema = require("@kbn/config-schema");
var _lib = require("../../../common/lib");
var _lib2 = require("../../lib");
var _helpers = require("../helpers");
var _validate_schemas = require("./validate_schemas");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerPolicyRoutes({
  router,
  license,
  lib: {
    wrapEsError,
    handleEsError
  }
}) {
  // GET all policies
  router.get({
    path: (0, _helpers.addBasePath)('policies'),
    validate: false
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      client: clusterClient
    } = (await ctx.core).elasticsearch;
    const managedPolicies = await (0, _lib2.getManagedPolicyNames)(clusterClient.asCurrentUser);
    try {
      // Get policies
      const policiesByName = await clusterClient.asCurrentUser.slm.getLifecycle({
        human: true
      });

      // Deserialize policies
      return res.ok({
        body: {
          policies: Object.entries(policiesByName).map(([name, policy]) => {
            // TODO: Figure out why our {@link SlmPolicyEs} is not compatible with:
            // import type { SnapshotLifecyclePolicyMetadata } from '@elastic/elasticsearch/lib/api/typesWithBodyKey';
            return (0, _lib.deserializePolicy)(name, policy, managedPolicies);
          })
        }
      });
    } catch (e) {
      return handleEsError({
        error: e,
        response: res
      });
    }
  }));

  // GET one policy
  router.get({
    path: (0, _helpers.addBasePath)('policy/{name}'),
    validate: {
      params: _validate_schemas.nameParameterSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      client: clusterClient
    } = (await ctx.core).elasticsearch;
    const {
      name
    } = req.params;
    try {
      const policiesByName = await clusterClient.asCurrentUser.slm.getLifecycle({
        policy_id: name,
        human: true
      });
      const managedPolicies = await (0, _lib2.getManagedPolicyNames)(clusterClient.asCurrentUser);

      // Deserialize policy
      return res.ok({
        body: {
          policy: (0, _lib.deserializePolicy)(name, policiesByName[name], managedPolicies)
        }
      });
    } catch (e) {
      return handleEsError({
        error: e,
        response: res
      });
    }
  }));

  // Create policy
  router.post({
    path: (0, _helpers.addBasePath)('policies'),
    validate: {
      body: _validate_schemas.policySchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      client: clusterClient
    } = (await ctx.core).elasticsearch;
    const policy = req.body;
    const {
      name
    } = policy;
    try {
      // Check that policy with the same name doesn't already exist
      const policyByName = await clusterClient.asCurrentUser.slm.getLifecycle({
        policy_id: name
      });
      if (policyByName[name]) {
        return res.conflict({
          body: 'There is already a policy with that name.'
        });
      }
    } catch (e) {
      // Silently swallow errors
    }
    try {
      // Otherwise create new policy
      const response = await clusterClient.asCurrentUser.slm.putLifecycle({
        policy_id: name,
        // TODO: bring {@link SlmPolicyEs['policy']} in line with {@link PutSnapshotLifecycleRequest['body']}
        body: (0, _lib.serializePolicy)(policy)
      });
      return res.ok({
        body: response
      });
    } catch (e) {
      return handleEsError({
        error: e,
        response: res
      });
    }
  }));

  // Update policy
  router.put({
    path: (0, _helpers.addBasePath)('policies/{name}'),
    validate: {
      params: _validate_schemas.nameParameterSchema,
      body: _validate_schemas.policySchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      client: clusterClient
    } = (await ctx.core).elasticsearch;
    const {
      name
    } = req.params;
    const policy = req.body;
    try {
      // Check that policy with the given name exists
      // If it doesn't exist, 404 will be thrown by ES and will be returned
      await clusterClient.asCurrentUser.slm.getLifecycle({
        policy_id: name
      });

      // Otherwise update policy
      const response = await clusterClient.asCurrentUser.slm.putLifecycle({
        policy_id: name,
        // TODO: bring {@link SlmPolicyEs['policy']} in line with {@link PutSnapshotLifecycleRequest['body']}
        body: (0, _lib.serializePolicy)(policy)
      });
      return res.ok({
        body: response
      });
    } catch (e) {
      return handleEsError({
        error: e,
        response: res
      });
    }
  }));

  // Delete policy
  router.delete({
    path: (0, _helpers.addBasePath)('policies/{name}'),
    validate: {
      params: _validate_schemas.nameParameterSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      client: clusterClient
    } = (await ctx.core).elasticsearch;
    const {
      name
    } = req.params;
    const policyNames = name.split(',');
    const response = {
      itemsDeleted: [],
      errors: []
    };
    await Promise.all(policyNames.map(policyName => {
      return clusterClient.asCurrentUser.slm.deleteLifecycle({
        policy_id: policyName
      }).then(() => response.itemsDeleted.push(policyName)).catch(e => response.errors.push({
        name: policyName,
        error: wrapEsError(e)
      }));
    }));
    return res.ok({
      body: response
    });
  }));

  // Execute policy
  router.post({
    path: (0, _helpers.addBasePath)('policy/{name}/run'),
    validate: {
      params: _validate_schemas.nameParameterSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      client: clusterClient
    } = (await ctx.core).elasticsearch;
    const {
      name
    } = req.params;
    try {
      const {
        snapshot_name: snapshotName
      } = await clusterClient.asCurrentUser.slm.executeLifecycle({
        policy_id: name
      });
      return res.ok({
        body: {
          snapshotName
        }
      });
    } catch (e) {
      return handleEsError({
        error: e,
        response: res
      });
    }
  }));

  // Get policy indices
  router.get({
    path: (0, _helpers.addBasePath)('policies/indices'),
    validate: false
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      client: clusterClient
    } = (await ctx.core).elasticsearch;
    try {
      const response = await clusterClient.asCurrentUser.indices.resolveIndex({
        name: '*',
        expand_wildcards: 'all'
      });
      // @ts-expect-error Type 'ResolveIndexAliasItem[]' is not comparable to type 'IndexAndAliasFromEs[]'.
      const resolvedIndicesResponse = response;
      const body = {
        dataStreams: resolvedIndicesResponse.data_streams.map(({
          name
        }) => name).sort(),
        indices: resolvedIndicesResponse.indices.filter(index => !index.attributes.includes('system')).flatMap(index => index.data_stream ? [] : index.name).sort()
      };
      return res.ok({
        body
      });
    } catch (e) {
      return handleEsError({
        error: e,
        response: res
      });
    }
  }));

  // Get policy feature states
  router.get({
    path: (0, _helpers.addBasePath)('policies/features'),
    validate: false
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      client: clusterClient
    } = (await ctx.core).elasticsearch;
    try {
      const response = await clusterClient.asCurrentUser.features.getFeatures();
      return res.ok({
        body: response
      });
    } catch (e) {
      return handleEsError({
        error: e,
        response: res
      });
    }
  }));

  // Get retention settings
  router.get({
    path: (0, _helpers.addBasePath)('policies/retention_settings'),
    validate: false
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      client: clusterClient
    } = (await ctx.core).elasticsearch;
    const {
      persistent,
      transient,
      defaults
    } = await clusterClient.asCurrentUser.cluster.getSettings({
      filter_path: '**.slm.retention*',
      include_defaults: true
    });
    const {
      slm: retentionSettings
    } = {
      ...defaults,
      ...persistent,
      ...transient
    };
    const retentionSchedule = retentionSettings != null ? retentionSettings.retention_schedule : undefined;
    return res.ok({
      body: {
        retentionSchedule
      }
    });
  }));

  // Update retention settings
  const retentionSettingsSchema = _configSchema.schema.object({
    retentionSchedule: _configSchema.schema.string()
  });
  router.put({
    path: (0, _helpers.addBasePath)('policies/retention_settings'),
    validate: {
      body: retentionSettingsSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      client: clusterClient
    } = (await ctx.core).elasticsearch;
    const {
      retentionSchedule
    } = req.body;
    try {
      const response = await clusterClient.asCurrentUser.cluster.putSettings({
        body: {
          persistent: {
            slm: {
              retention_schedule: retentionSchedule
            }
          }
        }
      });
      return res.ok({
        body: response
      });
    } catch (e) {
      return handleEsError({
        error: e,
        response: res
      });
    }
  }));

  // Execute retention
  router.post({
    path: (0, _helpers.addBasePath)('policies/retention'),
    validate: false
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      client: clusterClient
    } = (await ctx.core).elasticsearch;
    const response = await clusterClient.asCurrentUser.slm.executeRetention();
    return res.ok({
      body: response
    });
  }));
}