"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkUpdateAlertsRoute = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _route_validation = require("./utils/route_validation");
var _constants = require("../../common/constants");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const bulkUpdateAlertsRoute = router => {
  router.post({
    path: `${_constants.BASE_RAC_ALERTS_API_PATH}/bulk_update`,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(t.union([t.strict({
        status: t.union([t.literal('open'), t.literal('closed'), t.literal('in-progress'),
        // TODO: remove after migration to acknowledged
        t.literal('acknowledged')]),
        index: t.string,
        ids: t.array(t.string),
        query: t.undefined
      }), t.strict({
        status: t.union([t.literal('open'), t.literal('closed'), t.literal('in-progress'),
        // TODO: remove after migration to acknowledged
        t.literal('acknowledged')]),
        index: t.string,
        ids: t.undefined,
        query: t.union([t.object, t.string])
      })]))
    },
    options: {
      tags: ['access:rac']
    }
  }, async (context, req, response) => {
    try {
      const racContext = await context.rac;
      const alertsClient = await racContext.getAlertsClient();
      const {
        status,
        ids,
        index,
        query
      } = req.body;
      if (ids != null && ids.length > 1000) {
        return response.badRequest({
          body: {
            message: 'cannot use more than 1000 ids'
          }
        });
      }
      const updatedAlert = await alertsClient.bulkUpdate({
        ids,
        status,
        query,
        index
      });
      if (updatedAlert == null) {
        return response.notFound({
          body: {
            message: `alerts with ids ${ids} and index ${index} not found`
          }
        });
      }
      return response.ok({
        body: {
          success: true,
          ...updatedAlert
        }
      });
    } catch (exc) {
      const err = (0, _securitysolutionEsUtils.transformError)(exc);
      const contentType = {
        'content-type': 'application/json'
      };
      const defaultedHeaders = {
        ...contentType
      };
      return response.customError({
        headers: defaultedHeaders,
        statusCode: err.statusCode,
        body: {
          message: err.message,
          attributes: {
            success: false
          }
        }
      });
    }
  });
};
exports.bulkUpdateAlertsRoute = bulkUpdateAlertsRoute;