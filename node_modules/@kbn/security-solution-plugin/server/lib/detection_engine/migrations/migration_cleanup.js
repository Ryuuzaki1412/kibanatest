"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMigrationCleanupPolicyName = exports.ensureMigrationCleanupPolicy = exports.applyMigrationCleanupPolicy = void 0;
var _migration_cleanup_policy = _interopRequireDefault(require("./migration_cleanup_policy.json"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getMigrationCleanupPolicyName = alias => `${alias}-migration-cleanup`;
exports.getMigrationCleanupPolicyName = getMigrationCleanupPolicyName;
const getPolicyExists = async ({
  esClient,
  policy
}) => {
  try {
    await esClient.ilm.getLifecycle({
      name: policy
    });
    return true;
  } catch (err) {
    if (err.statusCode === 404) {
      return false;
    } else {
      throw err;
    }
  }
};

/**
 * Checks that the migration cleanup ILM policy exists for the given signals
 * alias, and creates it if necessary.
 *
 * This policy is applied to outdated signals indexes post-migration, ensuring
 * that they are eventually deleted.
 *
 * @param esClient An {@link ElasticsearchClient}
 * @param alias name of the signals alias
 *
 * @throws if elasticsearch returns an error
 */
const ensureMigrationCleanupPolicy = async ({
  esClient,
  alias
}) => {
  const policy = getMigrationCleanupPolicyName(alias);
  const policyExists = await getPolicyExists({
    esClient,
    policy
  });
  if (!policyExists) {
    await esClient.ilm.putLifecycle({
      name: policy,
      body: _migration_cleanup_policy.default
    });
  }
};

/**
 * Applies the migration cleanup ILM policy to the specified signals index.
 *
 * This is invoked for an outdated signals index after a successful index
 * migration, ensuring that it's eventually deleted.
 *
 * @param esClient An {@link ElasticsearchClient}
 * @param alias name of the signals alias
 * @param index name of the concrete signals index to receive the policy
 *
 * @throws if elasticsearch returns an error
 */
exports.ensureMigrationCleanupPolicy = ensureMigrationCleanupPolicy;
const applyMigrationCleanupPolicy = async ({
  alias,
  esClient,
  index
}) => {
  await esClient.indices.putSettings({
    index,
    body: {
      lifecycle: {
        name: getMigrationCleanupPolicyName(alias)
      }
    }
  });
};
exports.applyMigrationCleanupPolicy = applyMigrationCleanupPolicy;