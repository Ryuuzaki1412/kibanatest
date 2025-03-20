"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = registerRoutes;
var _app = require("./app");
var _cloud_backup_status = require("./cloud_backup_status");
var _cluster_upgrade_status = require("./cluster_upgrade_status");
var _system_indices_migration = require("./system_indices_migration");
var _es_deprecations = require("./es_deprecations");
var _deprecation_logging = require("./deprecation_logging");
var _reindex_indices = require("./reindex_indices");
var _update_index_settings = require("./update_index_settings");
var _ml_snapshots = require("./ml_snapshots");
var _status = require("./status");
var _remote_clusters = require("./remote_clusters");
var _node_disk_space = require("./node_disk_space");
var _cluster_settings = require("./cluster_settings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerRoutes(dependencies, getWorker) {
  (0, _app.registerAppRoutes)(dependencies);
  (0, _cloud_backup_status.registerCloudBackupStatusRoutes)(dependencies);
  (0, _cluster_upgrade_status.registerClusterUpgradeStatusRoutes)(dependencies);
  (0, _system_indices_migration.registerSystemIndicesMigrationRoutes)(dependencies);
  (0, _es_deprecations.registerESDeprecationRoutes)(dependencies);
  (0, _deprecation_logging.registerDeprecationLoggingRoutes)(dependencies);
  (0, _reindex_indices.registerReindexIndicesRoutes)(dependencies, getWorker);
  (0, _reindex_indices.registerBatchReindexIndicesRoutes)(dependencies, getWorker);
  (0, _update_index_settings.registerUpdateSettingsRoute)(dependencies);
  (0, _ml_snapshots.registerMlSnapshotRoutes)(dependencies);
  // Route for cloud to retrieve the upgrade status for ES and Kibana
  (0, _status.registerUpgradeStatusRoute)(dependencies);
  (0, _remote_clusters.registerRemoteClustersRoute)(dependencies);
  (0, _node_disk_space.registerNodeDiskSpaceRoute)(dependencies);
  (0, _cluster_settings.registerClusterSettingsRoute)(dependencies);
}