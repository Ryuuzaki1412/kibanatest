"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRuleExecutionLogRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _lib = require("./lib");
var _types = require("../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const paramSchema = _configSchema.schema.object({
  id: _configSchema.schema.string()
});
const sortOrderSchema = _configSchema.schema.oneOf([_configSchema.schema.literal('asc'), _configSchema.schema.literal('desc')]);
const sortFieldSchema = _configSchema.schema.oneOf([_configSchema.schema.object({
  timestamp: _configSchema.schema.object({
    order: sortOrderSchema
  })
}), _configSchema.schema.object({
  execution_duration: _configSchema.schema.object({
    order: sortOrderSchema
  })
}), _configSchema.schema.object({
  total_search_duration: _configSchema.schema.object({
    order: sortOrderSchema
  })
}), _configSchema.schema.object({
  es_search_duration: _configSchema.schema.object({
    order: sortOrderSchema
  })
}), _configSchema.schema.object({
  schedule_delay: _configSchema.schema.object({
    order: sortOrderSchema
  })
}), _configSchema.schema.object({
  num_triggered_actions: _configSchema.schema.object({
    order: sortOrderSchema
  })
}), _configSchema.schema.object({
  num_generated_actions: _configSchema.schema.object({
    order: sortOrderSchema
  })
}), _configSchema.schema.object({
  num_active_alerts: _configSchema.schema.object({
    order: sortOrderSchema
  })
}), _configSchema.schema.object({
  num_recovered_alerts: _configSchema.schema.object({
    order: sortOrderSchema
  })
}), _configSchema.schema.object({
  num_new_alerts: _configSchema.schema.object({
    order: sortOrderSchema
  })
})]);
const sortFieldsSchema = _configSchema.schema.arrayOf(sortFieldSchema, {
  defaultValue: [{
    timestamp: {
      order: 'desc'
    }
  }]
});
const querySchema = _configSchema.schema.object({
  date_start: _configSchema.schema.string(),
  date_end: _configSchema.schema.maybe(_configSchema.schema.string()),
  filter: _configSchema.schema.maybe(_configSchema.schema.string()),
  per_page: _configSchema.schema.number({
    defaultValue: 10,
    min: 1
  }),
  page: _configSchema.schema.number({
    defaultValue: 1,
    min: 1
  }),
  sort: sortFieldsSchema
});
const rewriteReq = ({
  date_start: dateStart,
  date_end: dateEnd,
  per_page: perPage,
  ...rest
}) => ({
  ...rest,
  dateStart,
  dateEnd,
  perPage
});
const getRuleExecutionLogRoute = (router, licenseState) => {
  router.get({
    path: `${_types.INTERNAL_BASE_ALERTING_API_PATH}/rule/{id}/_execution_log`,
    validate: {
      params: paramSchema,
      query: querySchema
    }
  }, router.handleLegacyErrors((0, _lib.verifyAccessAndContext)(licenseState, async function (context, req, res) {
    const rulesClient = (await context.alerting).getRulesClient();
    const {
      id
    } = req.params;
    return res.ok({
      body: await rulesClient.getExecutionLogForRule(rewriteReq({
        id,
        ...req.query
      }))
    });
  })));
};
exports.getRuleExecutionLogRoute = getRuleExecutionLogRoute;