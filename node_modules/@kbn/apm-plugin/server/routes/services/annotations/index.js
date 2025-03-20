"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceAnnotations = getServiceAnnotations;
var _get_derived_service_annotations = require("./get_derived_service_annotations");
var _get_stored_annotations = require("./get_stored_annotations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getServiceAnnotations({
  apmEventClient,
  searchAggregatedTransactions,
  serviceName,
  environment,
  annotationsClient,
  client,
  logger,
  start,
  end
}) {
  // Variable to store any error happened on getDerivedServiceAnnotations other than RequestAborted
  let derivedAnnotationError;

  // start fetching derived annotations (based on transactions), but don't wait on it
  // it will likely be significantly slower than the stored annotations
  const derivedAnnotationsPromise = (0, _get_derived_service_annotations.getDerivedServiceAnnotations)({
    apmEventClient,
    serviceName,
    environment,
    searchAggregatedTransactions,
    start,
    end
  }).catch(error => {
    // Save Error and wait for Stored annotations before re-throwing it
    derivedAnnotationError = error;
    return [];
  });
  const storedAnnotations = annotationsClient ? await (0, _get_stored_annotations.getStoredAnnotations)({
    serviceName,
    environment,
    annotationsClient,
    client,
    logger,
    start,
    end
  }) : [];
  if (storedAnnotations.length) {
    return {
      annotations: storedAnnotations
    };
  }

  // At this point storedAnnotations returned an empty array,
  // so if derivedAnnotationError is not undefined throws the error reported by getDerivedServiceAnnotations
  // and there's no reason to await the function anymore
  if (derivedAnnotationError) {
    throw derivedAnnotationError;
  }
  return {
    annotations: await derivedAnnotationsPromise
  };
}