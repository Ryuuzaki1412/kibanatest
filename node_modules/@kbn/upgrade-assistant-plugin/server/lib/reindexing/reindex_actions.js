"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reindexActionsFactory = exports.LOCK_WINDOW = void 0;
var _moment = _interopRequireDefault(require("moment"));
var _types = require("../../../common/types");
var _version = require("../version");
var _index_settings = require("./index_settings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// TODO: base on elasticsearch.requestTimeout?
const LOCK_WINDOW = _moment.default.duration(90, 'seconds');

/**
 * A collection of utility functions pulled out out of the ReindexService to make testing simpler.
 * This is NOT intended to be used by any other code.
 */
exports.LOCK_WINDOW = LOCK_WINDOW;
const reindexActionsFactory = (client, esClient) => {
  // ----- Internal functions
  const isLocked = reindexOp => {
    if (reindexOp.attributes.locked) {
      const now = (0, _moment.default)();
      const lockedTime = (0, _moment.default)(reindexOp.attributes.locked);
      // If the object has been locked for more than the LOCK_WINDOW, assume the process that locked it died.
      if (now.subtract(LOCK_WINDOW) < lockedTime) {
        return true;
      }
    }
    return false;
  };
  const acquireLock = async reindexOp => {
    if (isLocked(reindexOp)) {
      throw new Error(`Another Kibana process is currently modifying this reindex operation.`);
    }
    return client.update(_types.REINDEX_OP_TYPE, reindexOp.id, {
      ...reindexOp.attributes,
      locked: (0, _moment.default)().format()
    }, {
      version: reindexOp.version
    });
  };
  const releaseLock = reindexOp => {
    return client.update(_types.REINDEX_OP_TYPE, reindexOp.id, {
      ...reindexOp.attributes,
      locked: null
    }, {
      version: reindexOp.version
    });
  };

  // ----- Public interface
  return {
    async createReindexOp(indexName, opts) {
      return client.create(_types.REINDEX_OP_TYPE, {
        indexName,
        newIndexName: (0, _index_settings.generateNewIndexName)(indexName),
        status: _types.ReindexStatus.inProgress,
        lastCompletedStep: _types.ReindexStep.created,
        locked: null,
        reindexTaskId: null,
        reindexTaskPercComplete: null,
        errorMessage: null,
        runningReindexCount: null,
        reindexOptions: opts
      });
    },
    deleteReindexOp(reindexOp) {
      return client.delete(_types.REINDEX_OP_TYPE, reindexOp.id);
    },
    async updateReindexOp(reindexOp, attrs = {}) {
      if (!isLocked(reindexOp)) {
        throw new Error(`ReindexOperation must be locked before updating.`);
      }
      const newAttrs = {
        ...reindexOp.attributes,
        locked: (0, _moment.default)().format(),
        ...attrs
      };
      return client.update(_types.REINDEX_OP_TYPE, reindexOp.id, newAttrs, {
        version: reindexOp.version
      });
    },
    async runWhileLocked(reindexOp, func) {
      reindexOp = await acquireLock(reindexOp);
      try {
        reindexOp = await func(reindexOp);
      } finally {
        reindexOp = await releaseLock(reindexOp);
      }
      return reindexOp;
    },
    findReindexOperations(indexName) {
      return client.find({
        type: _types.REINDEX_OP_TYPE,
        search: `"${indexName}"`,
        searchFields: ['indexName']
      });
    },
    async findAllByStatus(status) {
      const firstPage = await client.find({
        type: _types.REINDEX_OP_TYPE,
        search: status.toString(),
        searchFields: ['status']
      });
      if (firstPage.total === firstPage.saved_objects.length) {
        return firstPage.saved_objects;
      }
      let allOps = firstPage.saved_objects;
      let page = firstPage.page + 1;
      while (allOps.length < firstPage.total) {
        const nextPage = await client.find({
          type: _types.REINDEX_OP_TYPE,
          search: status.toString(),
          searchFields: ['status'],
          page
        });
        allOps = [...allOps, ...nextPage.saved_objects];
        page++;
      }
      return allOps;
    },
    async getFlatSettings(indexName) {
      let flatSettings;
      if (_version.versionService.getMajorVersion() === 7) {
        // On 7.x, we need to get index settings with mapping type
        flatSettings = await esClient.indices.get({
          index: indexName,
          flat_settings: true,
          // This @ts-ignore is needed on master since the flag is deprecated on >7.x
          // @ts-ignore
          include_type_name: true
        });
      } else {
        flatSettings = await esClient.indices.get({
          index: indexName,
          flat_settings: true
        });
      }
      if (!flatSettings[indexName]) {
        return null;
      }
      return flatSettings[indexName];
    }
  };
};
exports.reindexActionsFactory = reindexActionsFactory;