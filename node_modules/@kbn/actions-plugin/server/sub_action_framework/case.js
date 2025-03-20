"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CaseConnector = void 0;
var _configSchema = require("@kbn/config-schema");
var _sub_action_connector = require("./sub_action_connector");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class CaseConnector extends _sub_action_connector.SubActionConnector {
  constructor(params) {
    super(params);
    this.registerSubAction({
      name: 'pushToService',
      method: 'pushToService',
      schema: _configSchema.schema.object({
        incident: _configSchema.schema.object({
          externalId: _configSchema.schema.nullable(_configSchema.schema.string())
        }, {
          unknowns: 'allow'
        }),
        comments: _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.object({
          comment: _configSchema.schema.string(),
          commentId: _configSchema.schema.string()
        })))
      })
    });
  }
  async pushToService(params) {
    const {
      incident,
      comments
    } = params;
    const {
      externalId,
      ...rest
    } = incident;
    let res;
    if (externalId != null) {
      res = await this.updateIncident({
        incidentId: externalId,
        incident: rest
      });
    } else {
      res = await this.createIncident(rest);
    }
    if (comments && Array.isArray(comments) && comments.length > 0) {
      res.comments = [];
      for (const currentComment of comments) {
        var _res$comments;
        await this.addComment({
          incidentId: res.id,
          comment: currentComment.comment
        });
        res.comments = [...((_res$comments = res.comments) !== null && _res$comments !== void 0 ? _res$comments : []), {
          commentId: currentComment.commentId,
          pushedDate: res.pushedDate
        }];
      }
    }
    return res;
  }
}
exports.CaseConnector = CaseConnector;