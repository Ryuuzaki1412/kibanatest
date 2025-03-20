"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.putDownloadSourcesHandler = exports.postDownloadSourcesHandler = exports.getOneDownloadSourcesHandler = exports.getDownloadSourcesHandler = exports.deleteDownloadSourcesHandler = void 0;
var _download_source = require("../../services/download_source");
var _errors = require("../../errors");
var _services = require("../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getDownloadSourcesHandler = async (context, request, response) => {
  const soClient = (await context.core).savedObjects.client;
  try {
    const downloadSources = await _download_source.downloadSourceService.list(soClient);
    const body = {
      items: downloadSources.items,
      page: downloadSources.page,
      perPage: downloadSources.perPage,
      total: downloadSources.total
    };
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.getDownloadSourcesHandler = getDownloadSourcesHandler;
const getOneDownloadSourcesHandler = async (context, request, response) => {
  const soClient = (await context.core).savedObjects.client;
  try {
    const downloadSource = await _download_source.downloadSourceService.get(soClient, request.params.sourceId);
    const body = {
      item: downloadSource
    };
    return response.ok({
      body
    });
  } catch (error) {
    if (error.isBoom && error.output.statusCode === 404) {
      return response.notFound({
        body: {
          message: `Download source ${request.params.sourceId} not found`
        }
      });
    }
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.getOneDownloadSourcesHandler = getOneDownloadSourcesHandler;
const putDownloadSourcesHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const soClient = coreContext.savedObjects.client;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  try {
    await _download_source.downloadSourceService.update(soClient, request.params.sourceId, request.body);
    const downloadSource = await _download_source.downloadSourceService.get(soClient, request.params.sourceId);
    if (downloadSource.is_default) {
      await _services.agentPolicyService.bumpAllAgentPolicies(soClient, esClient);
    } else {
      await _services.agentPolicyService.bumpAllAgentPoliciesForDownloadSource(soClient, esClient, downloadSource.id);
    }
    const body = {
      item: downloadSource
    };
    return response.ok({
      body
    });
  } catch (error) {
    if (error.isBoom && error.output.statusCode === 404) {
      return response.notFound({
        body: {
          message: `Download source ${request.params.sourceId} not found`
        }
      });
    }
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.putDownloadSourcesHandler = putDownloadSourcesHandler;
const postDownloadSourcesHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const soClient = coreContext.savedObjects.client;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  try {
    const {
      id,
      ...data
    } = request.body;
    const downloadSource = await _download_source.downloadSourceService.create(soClient, data, {
      id
    });
    if (downloadSource.is_default) {
      await _services.agentPolicyService.bumpAllAgentPolicies(soClient, esClient);
    }
    const body = {
      item: downloadSource
    };
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.postDownloadSourcesHandler = postDownloadSourcesHandler;
const deleteDownloadSourcesHandler = async (context, request, response) => {
  const soClient = (await context.core).savedObjects.client;
  try {
    await _download_source.downloadSourceService.delete(soClient, request.params.sourceId);
    const body = {
      id: request.params.sourceId
    };
    return response.ok({
      body
    });
  } catch (error) {
    if (error.isBoom && error.output.statusCode === 404) {
      return response.notFound({
        body: {
          message: `Donwload source ${request.params.sourceId} not found`
        }
      });
    }
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.deleteDownloadSourcesHandler = deleteDownloadSourcesHandler;