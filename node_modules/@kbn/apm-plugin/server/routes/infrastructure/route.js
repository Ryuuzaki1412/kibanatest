"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.infrastructureRouteRepository = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _create_apm_server_route = require("../apm_routes/create_apm_server_route");
var _get_apm_event_client = require("../../lib/helpers/get_apm_event_client");
var _default_api_types = require("../default_api_types");
var _get_infrastructure_data = require("./get_infrastructure_data");
var _get_host_names = require("./get_host_names");
var _create_infra_metrics_client = require("../../lib/helpers/create_es_client/create_infra_metrics_client/create_infra_metrics_client");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const infrastructureRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/infrastructure_attributes',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.kueryRt, _default_api_types.rangeRt, _default_api_types.environmentRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const infraMetricsClient = (0, _create_infra_metrics_client.createInfraMetricsClient)(resources);
    const {
      params
    } = resources;
    const {
      path: {
        serviceName
      },
      query: {
        environment,
        kuery,
        start,
        end
      }
    } = params;
    const infrastructureData = await (0, _get_infrastructure_data.getInfrastructureData)({
      apmEventClient,
      serviceName,
      environment,
      kuery,
      start,
      end
    });
    const containerIds = infrastructureData.containerIds;
    // due some limitations on the data we get from apm-metrics indices, if we have a service running in a container we want to query, to get the host.name, filtering by container.id
    const containerHostNames = await (0, _get_host_names.getContainerHostNames)({
      containerIds,
      infraMetricsClient,
      start,
      end
    });
    return {
      containerIds,
      hostNames: containerIds.length > 0 // if we have container ids we rely on the hosts fetched filtering by container.id
      ? containerHostNames : infrastructureData.hostNames,
      podNames: infrastructureData.podNames
    };
  }
});
const infrastructureRouteRepository = {
  ...infrastructureRoute
};
exports.infrastructureRouteRepository = infrastructureRouteRepository;