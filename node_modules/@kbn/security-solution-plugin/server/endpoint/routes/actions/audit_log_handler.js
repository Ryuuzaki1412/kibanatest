"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.auditLogRequestHandler = void 0;
var _services = require("../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const auditLogRequestHandler = endpointContext => {
  const logger = endpointContext.logFactory.get('audit_log');
  return async (context, req, res) => {
    const {
      params: {
        agent_id: elasticAgentId
      },
      query: {
        page,
        page_size: pageSize,
        start_date: startDate,
        end_date: endDate
      }
    } = req;
    const body = await (0, _services.getAuditLogResponse)({
      elasticAgentId,
      page,
      pageSize,
      startDate,
      endDate,
      context,
      logger
    });
    return res.ok({
      body
    });
  };
};
exports.auditLogRequestHandler = auditLogRequestHandler;