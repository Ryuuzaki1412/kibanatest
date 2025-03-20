"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installRiskScoreModule = void 0;
var _search_strategy = require("../../../../../common/search_strategy");
var _risk_score_modules = require("../../../../../common/utils/risk_score_modules");
var _create_index = require("../../indices/lib/create_index");
var _create_script = require("../../stored_scripts/lib/create_script");
var _transforms = require("../../transform/helpers/transforms");
var _ingest_pipeline = require("./ingest_pipeline");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createHostRiskScoreIngestPipelineGrouping = ({
  esClient,
  logger,
  riskScoreEntity,
  spaceId
}) => {
  /**
   * console_templates/enable_host_risk_score.console
   * Step 1 Upload script: ml_hostriskscore_levels_script_{spaceId}
   */
  const createLevelScriptOptions = (0, _risk_score_modules.getRiskHostCreateLevelScriptOptions)(spaceId);
  return (0, _create_script.createStoredScript)({
    esClient,
    logger,
    options: createLevelScriptOptions
  }).then(createStoredScriptResult => {
    if (createStoredScriptResult[createLevelScriptOptions.id].success) {
      /**
       * console_templates/enable_host_risk_score.console
       * Step 5 Upload the ingest pipeline: ml_hostriskscore_ingest_pipeline_{spaceId}
       */
      const createIngestPipelineOptions = (0, _risk_score_modules.getRiskScoreIngestPipelineOptions)(riskScoreEntity, spaceId);
      return (0, _ingest_pipeline.createIngestPipeline)({
        esClient,
        logger,
        options: createIngestPipelineOptions
      }).then(createIngestPipelineResult => {
        return [createStoredScriptResult, createIngestPipelineResult];
      });
    } else {
      return [createStoredScriptResult];
    }
  });
};
const installHostRiskScoreModule = async ({
  esClient,
  riskScoreEntity,
  logger,
  spaceId
}) => {
  const result = await Promise.all([
  /**
   * console_templates/enable_host_risk_score.console
   * Step 1 Upload script: ml_hostriskscore_levels_script_{spaceId}
   * Step 5 Upload the ingest pipeline: ml_hostriskscore_ingest_pipeline_{spaceId}
   */
  createHostRiskScoreIngestPipelineGrouping({
    esClient,
    logger,
    riskScoreEntity,
    spaceId
  }),
  /**
   * console_templates/enable_host_risk_score.console
   * Step 2 Upload script: ml_hostriskscore_init_script_{spaceId}
   */
  (0, _create_script.createStoredScript)({
    esClient,
    logger,
    options: (0, _risk_score_modules.getRiskHostCreateInitScriptOptions)(spaceId)
  }),
  /**
   * console_templates/enable_host_risk_score.console
   * Step 3 Upload script: ml_hostriskscore_map_script_{spaceId}
   */
  (0, _create_script.createStoredScript)({
    esClient,
    logger,
    options: (0, _risk_score_modules.getRiskHostCreateMapScriptOptions)(spaceId)
  }),
  /**
   * console_templates/enable_host_risk_score.console
   * Step 4 Upload script: ml_hostriskscore_reduce_script_{spaceId}
   */
  (0, _create_script.createStoredScript)({
    esClient,
    logger,
    options: (0, _risk_score_modules.getRiskHostCreateReduceScriptOptions)(spaceId)
  }),
  /**
   * console_templates/enable_host_risk_score.console
   * Step 6 create ml_host_risk_score_{spaceId} index
   */
  (0, _create_index.createIndex)({
    esClient,
    logger,
    options: (0, _risk_score_modules.getCreateRiskScoreIndicesOptions)({
      spaceId,
      riskScoreEntity
    })
  }),
  /**
   * console_templates/enable_host_risk_score.console
   * Step 9 create ml_host_risk_score_latest_{spaceId} index
   */
  (0, _create_index.createIndex)({
    esClient,
    logger,
    options: (0, _risk_score_modules.getCreateRiskScoreLatestIndicesOptions)({
      spaceId,
      riskScoreEntity
    })
  })]);

  /**
   * console_templates/enable_host_risk_score.console
   * Step 7 create transform: ml_hostriskscore_pivot_transform_{spaceId}
   * Step 8 Start the pivot transform
   */
  const createAndStartPivotTransformResult = await (0, _transforms.createAndStartTransform)({
    esClient,
    logger,
    transformId: (0, _risk_score_modules.getRiskScorePivotTransformId)(riskScoreEntity, spaceId),
    options: (0, _risk_score_modules.getCreateMLHostPivotTransformOptions)({
      spaceId
    })
  });

  /**
   * console_templates/enable_host_risk_score.console
   * Step 10 create transform: ml_hostriskscore_latest_transform_{spaceId}
   * Step 11 Start the latest transform
   */
  const createAndStartLatestTransformResult = await (0, _transforms.createAndStartTransform)({
    esClient,
    logger,
    transformId: (0, _risk_score_modules.getRiskScoreLatestTransformId)(riskScoreEntity, spaceId),
    options: (0, _risk_score_modules.getCreateLatestTransformOptions)({
      riskScoreEntity,
      spaceId
    })
  });
  return [...result, createAndStartPivotTransformResult, createAndStartLatestTransformResult].flat();
};
const createUserRiskScoreIngestPipelineGrouping = async ({
  esClient,
  logger,
  riskScoreEntity,
  spaceId
}) => {
  /**
   * console_templates/enable_user_risk_score.console
   * Step 1 Upload script: ml_userriskscore_levels_script_{spaceId}
   */
  const createLevelScriptOptions = (0, _risk_score_modules.getRiskUserCreateLevelScriptOptions)(spaceId);
  const createStoredScriptResult = await (0, _create_script.createStoredScript)({
    esClient,
    logger,
    options: createLevelScriptOptions
  });

  /**
   * console_templates/enable_user_risk_score.console
   * Step 4 Upload ingest pipeline: ml_userriskscore_ingest_pipeline_{spaceId}
   */
  const createIngestPipelineOptions = (0, _risk_score_modules.getRiskScoreIngestPipelineOptions)(riskScoreEntity, spaceId);
  const createIngestPipelineResult = await (0, _ingest_pipeline.createIngestPipeline)({
    esClient,
    logger,
    options: createIngestPipelineOptions
  });
  return [createStoredScriptResult, createIngestPipelineResult];
};
const installUserRiskScoreModule = async ({
  esClient,
  logger,
  riskScoreEntity,
  spaceId
}) => {
  const result = await Promise.all([
  /**
   * console_templates/enable_user_risk_score.console
   * Step 1 Upload script: ml_userriskscore_levels_script_{spaceId}
   * Step 4 Upload ingest pipeline: ml_userriskscore_ingest_pipeline_{spaceId}
   */
  createUserRiskScoreIngestPipelineGrouping({
    esClient,
    logger,
    riskScoreEntity,
    spaceId
  }),
  /**
   * console_templates/enable_user_risk_score.console
   * Step 2 Upload script: ml_userriskscore_map_script_{spaceId}
   */
  (0, _create_script.createStoredScript)({
    esClient,
    logger,
    options: (0, _risk_score_modules.getRiskUserCreateMapScriptOptions)(spaceId)
  }),
  /**
   * console_templates/enable_user_risk_score.console
   * Step 3 Upload script: ml_userriskscore_reduce_script_{spaceId}
   */
  (0, _create_script.createStoredScript)({
    esClient,
    logger,
    options: (0, _risk_score_modules.getRiskUserCreateReduceScriptOptions)(spaceId)
  }),
  /**
   * console_templates/enable_user_risk_score.console
   * Step 5 create ml_user_risk_score_{spaceId} index
   */
  (0, _create_index.createIndex)({
    esClient,
    logger,
    options: (0, _risk_score_modules.getCreateRiskScoreIndicesOptions)({
      spaceId,
      riskScoreEntity
    })
  }),
  /**
   * console_templates/enable_user_risk_score.console
   * Step 8 create ml_user_risk_score_latest_{spaceId} index
   */
  (0, _create_index.createIndex)({
    esClient,
    logger,
    options: (0, _risk_score_modules.getCreateRiskScoreLatestIndicesOptions)({
      spaceId,
      riskScoreEntity
    })
  })]);

  /**
   * console_templates/enable_user_risk_score.console
   * Step 6 create Transform: ml_userriskscore_pivot_transform_{spaceId}
   * Step 7 Start the pivot transform
   */
  const createAndStartPivotTransformResult = await (0, _transforms.createAndStartTransform)({
    esClient,
    logger,
    transformId: (0, _risk_score_modules.getRiskScorePivotTransformId)(riskScoreEntity, spaceId),
    options: (0, _risk_score_modules.getCreateMLUserPivotTransformOptions)({
      spaceId
    })
  });

  /**
   * console_templates/enable_user_risk_score.console
   * Step 9 create Transform: ml_userriskscore_latest_transform_{spaceId}
   * Step 10 Start the latest transform
   */
  const createAndStartLatestTransformResult = await (0, _transforms.createAndStartTransform)({
    esClient,
    logger,
    transformId: (0, _risk_score_modules.getRiskScoreLatestTransformId)(riskScoreEntity, spaceId),
    options: (0, _risk_score_modules.getCreateLatestTransformOptions)({
      riskScoreEntity,
      spaceId
    })
  });
  return [...result, createAndStartPivotTransformResult, createAndStartLatestTransformResult].flat();
};
const installRiskScoreModule = async settings => {
  if (settings.riskScoreEntity === _search_strategy.RiskScoreEntity.user) {
    const result = await installUserRiskScoreModule(settings);
    return result;
  } else {
    const result = await installHostRiskScoreModule(settings);
    return result;
  }
};
exports.installRiskScoreModule = installRiskScoreModule;