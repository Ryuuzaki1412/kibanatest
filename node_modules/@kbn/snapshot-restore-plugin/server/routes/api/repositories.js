"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRepositoriesRoutes = registerRepositoriesRoutes;
var _common = require("../../../common");
var _helpers = require("../helpers");
var _validate_schemas = require("./validate_schemas");
var _lib = require("../../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerRepositoriesRoutes({
  router,
  license,
  config: {
    isCloudEnabled
  },
  lib: {
    wrapEsError,
    handleEsError
  }
}) {
  // GET all repositories
  router.get({
    path: (0, _helpers.addBasePath)('repositories'),
    validate: false
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      client: clusterClient
    } = (await ctx.core).elasticsearch;
    const managedRepositoryName = await (0, _lib.getManagedRepositoryName)(clusterClient.asCurrentUser);
    let repositoryNames;
    let repositories;
    let managedRepository;
    try {
      const repositoriesByName = await clusterClient.asCurrentUser.snapshot.getRepository({
        name: '_all'
      });
      repositoryNames = Object.keys(repositoriesByName);
      repositories = repositoryNames.map(name => {
        const {
          type = '',
          settings = {}
        } = repositoriesByName[name];
        return {
          name,
          type,
          settings: (0, _lib.deserializeRepositorySettings)(settings)
        };
      });
      managedRepository = {
        name: managedRepositoryName
      };
    } catch (e) {
      return handleEsError({
        error: e,
        response: res
      });
    }

    // If a managed repository, we also need to check if a policy is associated to it
    if (managedRepositoryName) {
      try {
        const policiesByName = await clusterClient.asCurrentUser.slm.getLifecycle({
          human: true
        });
        const managedRepositoryPolicy = Object.entries(policiesByName).filter(([, data]) => {
          const {
            policy
          } = data;
          return policy.repository === managedRepositoryName;
        }).flat();
        const [policyName] = managedRepositoryPolicy;
        managedRepository.policy = policyName;
      } catch (e) {
        // swallow error for now
        // we don't want to block repositories from loading if request fails
      }
    }
    return res.ok({
      body: {
        repositories,
        managedRepository
      }
    });
  }));

  // GET one repository
  router.get({
    path: (0, _helpers.addBasePath)('repositories/{name}'),
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
    const managedRepository = await (0, _lib.getManagedRepositoryName)(clusterClient.asCurrentUser);
    let repositoryByName;
    try {
      repositoryByName = await clusterClient.asCurrentUser.snapshot.getRepository({
        name
      });
    } catch (e) {
      return handleEsError({
        error: e,
        response: res
      });
    }
    const {
      snapshots: snapshotList
    } = await clusterClient.asCurrentUser.snapshot.get({
      repository: name,
      snapshot: '_all'
    }).catch(e => ({
      snapshots: null
    }));
    if (repositoryByName[name]) {
      const {
        type = '',
        settings = {}
      } = repositoryByName[name];
      return res.ok({
        body: {
          repository: {
            name,
            type,
            settings: (0, _lib.deserializeRepositorySettings)(settings)
          },
          isManagedRepository: managedRepository === name,
          snapshots: {
            count: snapshotList ? snapshotList.length : null
          }
        }
      });
    }
    return res.ok({
      body: {
        repository: {},
        snapshots: {}
      }
    });
  }));

  // GET repository types
  router.get({
    path: (0, _helpers.addBasePath)('repository_types'),
    validate: false
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      client: clusterClient
    } = (await ctx.core).elasticsearch;
    // module repo types are available everywhere out of the box
    // on-prem repo types are not available on Cloud
    const types = isCloudEnabled ? [..._common.MODULE_REPOSITORY_TYPES] : [..._common.MODULE_REPOSITORY_TYPES, ..._common.ON_PREM_REPOSITORY_TYPES];
    try {
      const {
        nodes
      } = await clusterClient.asCurrentUser.nodes.info({
        node_id: '_all',
        metric: 'plugins'
      });
      const pluginNamesAllNodes = Object.keys(nodes).map(key => {
        var _nodes$key$plugins;
        // extract plugin names
        return ((_nodes$key$plugins = nodes[key].plugins) !== null && _nodes$key$plugins !== void 0 ? _nodes$key$plugins : []).map(plugin => plugin.name);
      });

      // Filter list of plugins to repository-related ones
      Object.keys(_common.REPOSITORY_PLUGINS_MAP).forEach(repoTypeName => {
        if (
        // check if this repository plugin is installed on every node
        pluginNamesAllNodes.every(pluginNames => pluginNames.includes(repoTypeName))) {
          types.push(_common.REPOSITORY_PLUGINS_MAP[repoTypeName]);
        }
      });
      return res.ok({
        body: types
      });
    } catch (e) {
      return handleEsError({
        error: e,
        response: res
      });
    }
  }));

  // Verify repository
  router.get({
    path: (0, _helpers.addBasePath)('repositories/{name}/verify'),
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
      const verificationResults = await clusterClient.asCurrentUser.snapshot.verifyRepository({
        name
      }).catch(e => ({
        valid: false,
        error: e.response ? JSON.parse(e.response) : e
      }));
      return res.ok({
        body: {
          verification: verificationResults.error ? verificationResults : {
            valid: true,
            response: verificationResults
          }
        }
      });
    } catch (e) {
      return handleEsError({
        error: e,
        response: res
      });
    }
  }));

  // Cleanup repository
  router.post({
    path: (0, _helpers.addBasePath)('repositories/{name}/cleanup'),
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
      const cleanupResults = await clusterClient.asCurrentUser.snapshot.cleanupRepository({
        name
      }).catch(e => {
        // This API returns errors in a non-standard format, which we'll need to
        // munge to be compatible with wrapEsError.
        const normalizedError = {
          statusCode: e.meta.body.status,
          response: e.meta.body
        };
        return {
          body: {
            cleaned: false,
            error: wrapEsError(normalizedError)
          }
        };
      });
      return res.ok({
        body: {
          cleanup: cleanupResults.error ? cleanupResults : {
            cleaned: true,
            response: cleanupResults
          }
        }
      });
    } catch (e) {
      return handleEsError({
        error: e,
        response: res
      });
    }
  }));

  // Create repository
  router.put({
    path: (0, _helpers.addBasePath)('repositories'),
    validate: {
      body: _validate_schemas.repositorySchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      client: clusterClient
    } = (await ctx.core).elasticsearch;
    const {
      name = '',
      type = '',
      settings = {}
    } = req.body;

    // Check that repository with the same name doesn't already exist
    try {
      const repositoryByName = await clusterClient.asCurrentUser.snapshot.getRepository({
        name
      });
      if (repositoryByName[name]) {
        return res.conflict({
          body: 'There is already a repository with that name.'
        });
      }
    } catch (e) {
      // Silently swallow errors
    }

    // Otherwise create new repository
    try {
      const response = await clusterClient.asCurrentUser.snapshot.createRepository({
        name,
        body: {
          type,
          // TODO: Bring {@link RepositorySettings} in line with {@link SnapshotRepositorySettings}
          settings: (0, _lib.serializeRepositorySettings)(settings)
        },
        verify: false
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

  // Update repository
  router.put({
    path: (0, _helpers.addBasePath)('repositories/{name}'),
    validate: {
      body: _validate_schemas.repositorySchema,
      params: _validate_schemas.nameParameterSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      client: clusterClient
    } = (await ctx.core).elasticsearch;
    const {
      name
    } = req.params;
    const {
      type = '',
      settings = {}
    } = req.body;
    try {
      // Check that repository with the given name exists
      // If it doesn't exist, 404 will be thrown by ES and will be returned
      await clusterClient.asCurrentUser.snapshot.getRepository({
        name
      });

      // Otherwise update repository
      const response = await clusterClient.asCurrentUser.snapshot.createRepository({
        name,
        body: {
          type,
          settings: (0, _lib.serializeRepositorySettings)(settings)
        },
        verify: false
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

  // Delete repository
  router.delete({
    path: (0, _helpers.addBasePath)('repositories/{name}'),
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
    const repositoryNames = name.split(',');
    const response = {
      itemsDeleted: [],
      errors: []
    };
    try {
      await Promise.all(repositoryNames.map(repoName => {
        return clusterClient.asCurrentUser.snapshot.deleteRepository({
          name: repoName
        }).then(() => response.itemsDeleted.push(repoName)).catch(e => response.errors.push({
          name: repoName,
          error: wrapEsError(e)
        }));
      }));
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
}