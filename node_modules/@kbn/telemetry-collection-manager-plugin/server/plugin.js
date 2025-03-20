"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TelemetryCollectionManagerPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _rxjs = require("rxjs");
var _encryption = require("./encryption");
var _telemetry_saved_objects_client = require("./telemetry_saved_objects_client");
var _cache = require("./cache");
var _common = require("../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

class TelemetryCollectionManagerPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "collectionStrategy", void 0);
    (0, _defineProperty2.default)(this, "usageGetterMethodPriority", -1);
    (0, _defineProperty2.default)(this, "coreStatus$", new _rxjs.ReplaySubject(1));
    (0, _defineProperty2.default)(this, "usageCollection", void 0);
    (0, _defineProperty2.default)(this, "elasticsearchClient", void 0);
    (0, _defineProperty2.default)(this, "savedObjectsService", void 0);
    (0, _defineProperty2.default)(this, "isDistributable", void 0);
    (0, _defineProperty2.default)(this, "version", void 0);
    (0, _defineProperty2.default)(this, "cacheManager", new _cache.CacheManager({
      cacheDurationMs: _common.CACHE_DURATION_MS
    }));
    (0, _defineProperty2.default)(this, "getOptInStatsForCollection", async (collection, optInStatus, statsCollectionConfig) => {
      const context = {
        logger: this.logger.get(collection.title),
        version: this.version
      };
      const clustersDetails = await collection.clusterDetailsGetter(statsCollectionConfig, context);
      return clustersDetails.map(({
        clusterUuid
      }) => ({
        cluster_uuid: clusterUuid,
        opt_in_status: optInStatus
      }));
    });
    this.logger = initializerContext.logger.get();
    this.isDistributable = initializerContext.env.packageInfo.dist;
    this.version = initializerContext.env.packageInfo.version;
  }
  setup(core, {
    usageCollection
  }) {
    this.usageCollection = usageCollection;
    core.status.core$.subscribe(this.coreStatus$);
    return {
      setCollectionStrategy: this.setCollectionStrategy.bind(this),
      getOptInStats: this.getOptInStats.bind(this),
      getStats: this.getStats.bind(this),
      shouldGetTelemetry: this.shouldGetTelemetry.bind(this)
    };
  }
  start(core) {
    this.elasticsearchClient = core.elasticsearch.client;
    this.savedObjectsService = core.savedObjects;
    return {
      getOptInStats: this.getOptInStats.bind(this),
      getStats: this.getStats.bind(this),
      shouldGetTelemetry: this.shouldGetTelemetry.bind(this)
    };
  }
  stop() {
    this.coreStatus$.complete();
  }

  /**
   * Checks if Kibana is in a healthy state to attempt the Telemetry report generation:
   * - Elasticsearch is active.
   * - SavedObjects client is active.
   * @private
   */
  async shouldGetTelemetry() {
    const {
      elasticsearch,
      savedObjects
    } = await (0, _rxjs.firstValueFrom)(this.coreStatus$);
    return elasticsearch.level.toString() === 'available' && savedObjects.level.toString() === 'available';
  }
  setCollectionStrategy(collectionConfig) {
    const {
      title,
      priority,
      statsGetter,
      clusterDetailsGetter
    } = collectionConfig;
    if (typeof priority !== 'number') {
      throw new Error('priority must be set.');
    }
    if (priority === this.usageGetterMethodPriority) {
      throw new Error(`A Usage Getter with the same priority is already set.`);
    }
    if (priority > this.usageGetterMethodPriority) {
      if (!statsGetter) {
        throw Error('Stats getter method not set.');
      }
      if (!clusterDetailsGetter) {
        throw Error('Cluster UUIds method is not set.');
      }
      this.logger.debug(`Setting ${title} as the telemetry collection strategy`);

      // Overwrite the collection strategy
      this.collectionStrategy = collectionConfig;
      this.usageGetterMethodPriority = priority;
    }
  }

  /**
   * Returns the context to provide to the Collection Strategies.
   * It may return undefined if the ES and SO clients are not initialised yet.
   * @param config {@link StatsGetterConfig}
   * @param usageCollection {@link UsageCollectionSetup}
   * @private
   */
  getStatsCollectionConfig(config, usageCollection) {
    const esClient = this.getElasticsearchClient(config);
    const soClient = this.getSavedObjectsClient(config);
    // Provide the kibanaRequest so opted-in plugins can scope their custom clients only if the request is not encrypted
    const refreshCache = config.unencrypted ? true : !!config.refreshCache;
    if (esClient && soClient) {
      return {
        usageCollection,
        esClient,
        soClient,
        refreshCache
      };
    }
  }

  /**
   * Returns the ES client scoped to the requester or Kibana's internal user
   * depending on whether the request is encrypted or not:
   * If the request is unencrypted, we intentionally scope the results to "what the user can see".
   * @param config {@link StatsGetterConfig}
   * @private
   */
  getElasticsearchClient(config) {
    var _this$elasticsearchCl;
    return (_this$elasticsearchCl = this.elasticsearchClient) === null || _this$elasticsearchCl === void 0 ? void 0 : _this$elasticsearchCl.asInternalUser;
  }

  /**
   * Returns the SavedObjects client scoped to the requester or Kibana's internal user
   * depending on whether the request is encrypted or not:
   * If the request is unencrypted, we intentionally scope the results to "what the user can see"
   * @param config {@link StatsGetterConfig}
   * @private
   */
  getSavedObjectsClient(config) {
    if (this.savedObjectsService) {
      // Wrapping the internalRepository with the `TelemetrySavedObjectsClient`
      // to ensure some best practices when collecting "all the telemetry"
      // (i.e.: `.find` requests should query all spaces)
      return new _telemetry_saved_objects_client.TelemetrySavedObjectsClient(this.savedObjectsService.createInternalRepository());
    }
  }
  async getOptInStats(optInStatus, config) {
    if (!this.usageCollection) {
      return [];
    }
    const collection = this.collectionStrategy;
    if (collection) {
      // Build the context (clients and others) to send to the CollectionStrategies
      const statsCollectionConfig = this.getStatsCollectionConfig(config, this.usageCollection);
      if (statsCollectionConfig) {
        try {
          const optInStats = await this.getOptInStatsForCollection(collection, optInStatus, statsCollectionConfig);
          this.logger.debug(`Received Opt In stats using ${collection.title} collection.`);
          return await Promise.all(optInStats.map(async clusterStats => {
            const clusterUuid = clusterStats.cluster_uuid;
            return {
              clusterUuid,
              stats: config.unencrypted ? clusterStats : await (0, _encryption.encryptTelemetry)(clusterStats, {
                useProdKey: this.isDistributable
              })
            };
          }));
        } catch (err) {
          this.logger.debug(`Failed to collect any opt in stats with collection ${collection.title}.`);
        }
      }
    }
    return [];
  }
  async getStats(config) {
    if (!this.usageCollection) {
      return [];
    }
    const collection = this.collectionStrategy;
    if (collection) {
      // Build the context (clients and others) to send to the CollectionStrategies
      const statsCollectionConfig = this.getStatsCollectionConfig(config, this.usageCollection);
      if (statsCollectionConfig) {
        try {
          const usageData = await this.getUsageForCollection(collection, statsCollectionConfig);
          this.logger.debug(`Received Usage using ${collection.title} collection.`);
          return await Promise.all(usageData.map(async clusterStats => {
            const {
              cluster_uuid: clusterUuid
            } = clusterStats.cluster_stats;
            return {
              clusterUuid,
              stats: config.unencrypted ? clusterStats : await (0, _encryption.encryptTelemetry)(clusterStats, {
                useProdKey: this.isDistributable
              })
            };
          }));
        } catch (err) {
          this.logger.debug(`Failed to collect any usage with registered collection ${collection.title}.`);
        }
      }
    }
    return [];
  }
  createCacheKey(collectionSource, clustersDetails) {
    const clusterUUids = clustersDetails.map(({
      clusterUuid
    }) => clusterUuid).sort().join('_');
    return `${collectionSource}::${clusterUUids}`;
  }
  updateFetchedAt(statsPayload) {
    return statsPayload.map(stat => ({
      ...stat,
      cacheDetails: {
        ...stat.cacheDetails,
        fetchedAt: new Date().toISOString()
      }
    }));
  }
  async getUsageForCollection(collection, statsCollectionConfig) {
    const context = {
      logger: this.logger.get(collection.title),
      version: this.version
    };
    const clustersDetails = await collection.clusterDetailsGetter(statsCollectionConfig, context);
    const {
      refreshCache
    } = statsCollectionConfig;
    const {
      title: collectionSource
    } = collection;

    // on `refreshCache: true` clear all cache to store a fresh copy
    if (refreshCache) {
      this.cacheManager.resetCache();
    }
    if (clustersDetails.length === 0) {
      return [];
    }
    const cacheKey = this.createCacheKey(collectionSource, clustersDetails);
    const cachedUsageStatsPromise = this.cacheManager.getFromCache(cacheKey);
    if (cachedUsageStatsPromise) {
      return this.updateFetchedAt(await cachedUsageStatsPromise);
    }
    const statsFromCollectionPromise = this.getStatsFromCollection(clustersDetails, collection, statsCollectionConfig);
    this.cacheManager.setCache(cacheKey, statsFromCollectionPromise);
    try {
      const stats = await statsFromCollectionPromise;
      return this.updateFetchedAt(stats);
    } catch (err) {
      this.logger.debug(`Failed to generate the telemetry report (${err.message}). Resetting the cache...`);
      this.cacheManager.resetCache();
      throw err;
    }
  }
  async getStatsFromCollection(clustersDetails, collection, statsCollectionConfig) {
    const context = {
      logger: this.logger.get(collection.title),
      version: this.version
    };
    const {
      title: collectionSource
    } = collection;
    const now = new Date().toISOString();
    const stats = await collection.statsGetter(clustersDetails, statsCollectionConfig, context);
    return stats.map(stat => ({
      collectionSource,
      cacheDetails: {
        updatedAt: now,
        fetchedAt: now
      },
      ...stat
    }));
  }
}
exports.TelemetryCollectionManagerPlugin = TelemetryCollectionManagerPlugin;