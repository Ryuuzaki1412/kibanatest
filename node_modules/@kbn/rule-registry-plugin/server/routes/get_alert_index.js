"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAlertsIndexRoute = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _ruleDataUtils = require("@kbn/rule-data-utils");
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

const getAlertsIndexRoute = router => {
  router.get({
    path: `${_constants.BASE_RAC_ALERTS_API_PATH}/index`,
    validate: {
      query: (0, _route_validation.buildRouteValidation)(t.exact(t.partial({
        features: t.string
      })))
    },
    options: {
      tags: ['access:rac']
    }
  }, async (context, request, response) => {
    try {
      var _features$split;
      const racContext = await context.rac;
      const alertsClient = await racContext.getAlertsClient();
      const {
        features
      } = request.query;
      const indexName = await alertsClient.getAuthorizedAlertsIndices((_features$split = features === null || features === void 0 ? void 0 : features.split(',')) !== null && _features$split !== void 0 ? _features$split : _ruleDataUtils.validFeatureIds);
      return response.ok({
        body: {
          index_name: indexName
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
exports.getAlertsIndexRoute = getAlertsIndexRoute;