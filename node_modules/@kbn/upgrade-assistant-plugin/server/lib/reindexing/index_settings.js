"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformFlatSettings = exports.sourceNameForIndex = exports.getReindexWarnings = exports.getDeprecatedSettingWarning = exports.getCustomTypeWarning = exports.generateNewIndexName = void 0;
var _lodash = require("lodash");
var _version = require("../version");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * An array of deprecated index settings specific to 7.0 --> 8.0 upgrade
 * This excludes the deprecated translog retention settings
 * as these are only marked as deprecated if soft deletes is enabled
 * See logic in getDeprecatedSettingWarning() for more details
 */
const deprecatedSettings = ['index.force_memory_term_dictionary', 'index.max_adjacency_matrix_filters', 'index.soft_deletes.enabled'];

/**
 * Validates, and updates deprecated settings and mappings to be applied to the
 * new updated index.
 */
const transformFlatSettings = flatSettings => {
  const settings = transformSettings(flatSettings.settings);
  const mappings = transformMappings(flatSettings.mappings);
  return {
    settings,
    mappings
  };
};

/**
 * Provides the assumed source of the index name stripping any prefixing
 * introduced by the upgrade assistant
 *
 * Examples:
 *   .reindex-v7-foo => .foo
 *   reindex-v7-foo => foo
 *
 * @param indexName
 */
exports.transformFlatSettings = transformFlatSettings;
const sourceNameForIndex = indexName => {
  const matches = indexName.match(/^([\.])?(.*)$/) || [];
  const internal = matches[1] || '';
  const baseName = matches[2];

  // in 6.7+ we prepend to avoid conflicts with index patterns/templates/etc
  const reindexedMatcher = new RegExp(`reindexed-v${_version.versionService.getPrevMajorVersion()}-`, 'g');
  const cleanBaseName = baseName.replace(reindexedMatcher, '');
  return `${internal}${cleanBaseName}`;
};

/**
 * Provides the index name to re-index into
 *
 * .foo -> .reindexed-v7-foo
 * foo => reindexed-v7-foo
 */
exports.sourceNameForIndex = sourceNameForIndex;
const generateNewIndexName = indexName => {
  const sourceName = sourceNameForIndex(indexName);
  const currentVersion = `reindexed-v${_version.versionService.getMajorVersion()}`;
  return indexName.startsWith('.') ? `.${currentVersion}-${sourceName.substr(1)}` : `${currentVersion}-${sourceName}`;
};
exports.generateNewIndexName = generateNewIndexName;
const getCustomTypeWarning = flatSettings => {
  const DEFAULT_TYPE_NAME = '_doc';
  // In 7+, it's not possible to have more than one type,
  // so always grab the first (and only) key.
  const typeName = Object.getOwnPropertyNames(flatSettings.mappings)[0];
  const typeNameWarning = Boolean(typeName && typeName !== DEFAULT_TYPE_NAME);
  if (typeNameWarning) {
    return {
      warningType: 'customTypeName',
      meta: {
        typeName
      }
    };
  }
};
exports.getCustomTypeWarning = getCustomTypeWarning;
const getDeprecatedSettingWarning = flatSettings => {
  const {
    settings
  } = flatSettings;
  const deprecatedSettingsInUse = Object.keys(settings || {}).filter(setting => {
    return deprecatedSettings.indexOf(setting) > -1;
  });

  // Translog settings are only marked as deprecated if soft deletes is enabled
  // @ts-expect-error @elastic/elasticsearch doesn't declare such a setting
  if (settings['index.soft_deletes.enabled'] === 'true') {
    // @ts-expect-error @elastic/elasticsearch doesn't declare such a setting
    if (settings['index.translog.retention.size']) {
      deprecatedSettingsInUse.push('index.translog.retention.size');
    }

    // @ts-expect-error @elastic/elasticsearch doesn't declare such a setting
    if (settings['index.translog.retention.age']) {
      deprecatedSettingsInUse.push('index.translog.retention.age');
    }
  }
  if (deprecatedSettingsInUse.length) {
    return {
      warningType: 'indexSetting',
      meta: {
        deprecatedSettings: deprecatedSettingsInUse
      }
    };
  }
};

/**
 * Returns an array of warnings that should be displayed to user before reindexing begins.
 * @param flatSettings
 */
exports.getDeprecatedSettingWarning = getDeprecatedSettingWarning;
const getReindexWarnings = flatSettings => {
  const warnings = [];
  if (_version.versionService.getMajorVersion() === 7) {
    const customTypeWarning = getCustomTypeWarning(flatSettings);
    const deprecatedSettingWarning = getDeprecatedSettingWarning(flatSettings);
    if (customTypeWarning) {
      warnings.push(customTypeWarning);
    }
    if (deprecatedSettingWarning) {
      warnings.push(deprecatedSettingWarning);
    }
  }
  return warnings;
};
exports.getReindexWarnings = getReindexWarnings;
const removeUnsettableSettings = settings => (0, _lodash.omit)(settings, [
// Private ES settings
'index.allocation.existing_shards_allocator', 'index.blocks.write', 'index.creation_date', 'index.frozen', 'index.history.uuid', 'index.merge.enabled', 'index.provided_name', 'index.resize.source.name', 'index.resize.source.uuid', 'index.routing.allocation.initial_recovery._id', 'index.search.throttled', 'index.source_only', 'index.shrink.source.name', 'index.shrink.source.uuid', 'index.store.snapshot.repository_name', 'index.store.snapshot.snapshot_name', 'index.store.snapshot.snapshot_uuid', 'index.store.snapshot.index_name', 'index.store.snapshot.index_uuid', 'index.uuid', 'index.verified_before_close', 'index.version.created',
// Ignored since 6.x and forbidden in 7.x
'index.mapper.dynamic',
// Deprecated in 9.0
'index.version.upgraded']);
const removeDeprecatedSettings = settings => {
  const updatedSettings = {
    ...settings
  };

  // Translog settings are only marked as deprecated if soft deletes is enabled
  if (updatedSettings['index.soft_deletes.enabled'] === 'true') {
    if (updatedSettings['index.translog.retention.size']) {
      delete updatedSettings['index.translog.retention.size'];
    }

    // @ts-expect-error @elastic/elasticsearch doesn't declare such a setting
    if (settings['index.translog.retention.age']) {
      delete updatedSettings['index.translog.retention.age'];
    }
  }
  return (0, _lodash.omit)(updatedSettings, deprecatedSettings);
};

// Use `flow` to pipe the settings through each function.
const transformSettings = (0, _lodash.flow)(removeUnsettableSettings, removeDeprecatedSettings);
const updateFixableMappings = mappings => {
  return mappings;
};
const transformMappings = (0, _lodash.flow)(updateFixableMappings);