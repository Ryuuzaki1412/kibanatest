"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSnapshotsRoutes = registerSnapshotsRoutes;
var _configSchema = require("@kbn/config-schema");
var _lib = require("../../../common/lib");
var _lib2 = require("../../lib");
var _helpers = require("../helpers");
var _validate_schemas = require("./validate_schemas");
var _get_snapshot_search_wildcard = require("../../lib/get_snapshot_search_wildcard");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const sortFieldToESParams = {
  snapshot: 'name',
  repository: 'repository',
  indices: 'index_count',
  startTimeInMillis: 'start_time',
  durationInMillis: 'duration',
  'shards.total': 'shard_count',
  'shards.failed': 'failed_shard_count'
};
const isSearchingForNonExistentRepository = (repositories, value, match, operator) => {
  // only check if searching for an exact match (repository=test)
  if (match === 'must' && operator === 'exact') {
    return !(repositories || []).includes(value);
  }
  // otherwise we will use a wildcard, so allow the request
  return false;
};
function registerSnapshotsRoutes({
  router,
  license,
  lib: {
    wrapEsError,
    handleEsError
  }
}) {
  // GET all snapshots
  router.get({
    path: (0, _helpers.addBasePath)('snapshots'),
    validate: {
      query: _validate_schemas.snapshotListSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      client: clusterClient
    } = (await ctx.core).elasticsearch;
    const sortField = sortFieldToESParams[req.query.sortField];
    const sortDirection = req.query.sortDirection;
    const pageIndex = req.query.pageIndex;
    const pageSize = req.query.pageSize;
    const searchField = req.query.searchField;
    const searchValue = req.query.searchValue;
    const searchMatch = req.query.searchMatch;
    const searchOperator = req.query.searchOperator;
    const managedRepository = await (0, _lib2.getManagedRepositoryName)(clusterClient.asCurrentUser);
    let policies = [];

    // Attempt to retrieve policies
    // This could fail if user doesn't have access to read SLM policies
    try {
      const policiesByName = await clusterClient.asCurrentUser.slm.getLifecycle();
      policies = Object.keys(policiesByName);
    } catch (e) {
      // Silently swallow error as policy names aren't required in UI
    }
    let repositories = [];
    try {
      const repositoriesByName = await clusterClient.asCurrentUser.snapshot.getRepository({
        name: '_all'
      });
      repositories = Object.keys(repositoriesByName);
      if (repositories.length === 0) {
        return res.ok({
          body: {
            snapshots: [],
            repositories: [],
            policies
          }
        });
      }
    } catch (e) {
      return handleEsError({
        error: e,
        response: res
      });
    }

    // if the search is for a repository name with exact match (repository=test)
    // and that repository doesn't exist, ES request throws an error
    // that is why we return an empty snapshots array instead of sending an ES request
    if (searchField === 'repository' && isSearchingForNonExistentRepository(repositories, searchValue, searchMatch, searchOperator)) {
      return res.ok({
        body: {
          snapshots: [],
          policies,
          repositories,
          errors: [],
          total: 0
        }
      });
    }
    try {
      var _fetchedSnapshots$sna;
      // If any of these repositories 504 they will cost the request significant time.
      const fetchedSnapshots = await clusterClient.asCurrentUser.snapshot.get({
        repository: searchField === 'repository' ? (0, _get_snapshot_search_wildcard.getSnapshotSearchWildcard)({
          field: searchField,
          value: searchValue,
          match: searchMatch,
          operator: searchOperator
        }) : '_all',
        ignore_unavailable: true,
        // Allow request to succeed even if some snapshots are unavailable.
        snapshot: searchField === 'snapshot' ? (0, _get_snapshot_search_wildcard.getSnapshotSearchWildcard)({
          field: searchField,
          value: searchValue,
          match: searchMatch,
          operator: searchOperator
        }) : '_all',
        slm_policy_filter: searchField === 'policyName' ? (0, _get_snapshot_search_wildcard.getSnapshotSearchWildcard)({
          field: searchField,
          value: searchValue,
          match: searchMatch,
          operator: searchOperator
        }) : '*,_none',
        order: sortDirection,
        // @ts-expect-error sortField: string is not compatible with SnapshotSnapshotSort type
        sort: sortField,
        size: pageSize,
        offset: pageIndex * pageSize
      });

      // Decorate each snapshot with the repository with which it's associated.
      const snapshots = fetchedSnapshots === null || fetchedSnapshots === void 0 ? void 0 : (_fetchedSnapshots$sna = fetchedSnapshots.snapshots) === null || _fetchedSnapshots$sna === void 0 ? void 0 : _fetchedSnapshots$sna.map(snapshot => {
        return (0, _lib.deserializeSnapshotDetails)(snapshot, managedRepository);
      });
      return res.ok({
        body: {
          snapshots: snapshots || [],
          policies,
          repositories,
          // @ts-expect-error @elastic/elasticsearch https://github.com/elastic/elasticsearch-specification/issues/845
          errors: fetchedSnapshots === null || fetchedSnapshots === void 0 ? void 0 : fetchedSnapshots.failures,
          total: fetchedSnapshots === null || fetchedSnapshots === void 0 ? void 0 : fetchedSnapshots.total
        }
      });
    } catch (e) {
      return handleEsError({
        error: e,
        response: res
      });
    }
  }));
  const getOneParamsSchema = _configSchema.schema.object({
    repository: _configSchema.schema.string(),
    snapshot: _configSchema.schema.string()
  });

  // GET one snapshot
  router.get({
    path: (0, _helpers.addBasePath)('snapshots/{repository}/{snapshot}'),
    validate: {
      params: getOneParamsSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      client: clusterClient
    } = (await ctx.core).elasticsearch;
    const {
      repository,
      snapshot
    } = req.params;
    const managedRepository = await (0, _lib2.getManagedRepositoryName)(clusterClient.asCurrentUser);
    try {
      const response = await clusterClient.asCurrentUser.snapshot.get({
        repository,
        snapshot: '_all',
        ignore_unavailable: true
      });
      const {
        snapshots: snapshotsList
      } = response;
      if (!snapshotsList || snapshotsList.length === 0) {
        return res.notFound({
          body: 'Snapshot not found'
        });
      }
      const selectedSnapshot = snapshotsList.find(({
        snapshot: snapshotName
      }) => snapshot === snapshotName);
      if (!selectedSnapshot) {
        // If snapshot doesn't exist, manually throw 404 here
        return res.notFound({
          body: 'Snapshot not found'
        });
      }
      const successfulSnapshots = snapshotsList.filter(({
        state
      }) => state === 'SUCCESS').sort((a, b) => {
        return +new Date(b.end_time) - +new Date(a.end_time);
      });
      return res.ok({
        body: (0, _lib.deserializeSnapshotDetails)(selectedSnapshot, managedRepository, successfulSnapshots)
      });
    } catch (e) {
      return handleEsError({
        error: e,
        response: res
      });
    }
  }));
  const deleteSchema = _configSchema.schema.arrayOf(_configSchema.schema.object({
    repository: _configSchema.schema.string(),
    snapshot: _configSchema.schema.string()
  }));

  // DELETE one or multiple snapshots
  router.post({
    path: (0, _helpers.addBasePath)('snapshots/bulk_delete'),
    validate: {
      body: deleteSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      client: clusterClient
    } = (await ctx.core).elasticsearch;
    const response = {
      itemsDeleted: [],
      errors: []
    };
    const snapshots = req.body;
    try {
      // We intentionally perform deletion requests sequentially (blocking) instead of in parallel (non-blocking)
      // because there can only be one snapshot deletion task performed at a time (ES restriction).
      for (let i = 0; i < snapshots.length; i++) {
        const {
          snapshot,
          repository
        } = snapshots[i];
        await clusterClient.asCurrentUser.snapshot.delete({
          snapshot,
          repository
        }).then(() => response.itemsDeleted.push({
          snapshot,
          repository
        })).catch(e => response.errors.push({
          id: {
            snapshot,
            repository
          },
          error: wrapEsError(e)
        }));
      }
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