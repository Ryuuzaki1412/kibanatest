"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerListsPluginEndpointExtensionPoints = void 0;
var _exceptions_pre_create_handler = require("./handlers/exceptions_pre_create_handler");
var _exceptions_pre_update_handler = require("./handlers/exceptions_pre_update_handler");
var _exceptions_pre_get_one_handler = require("./handlers/exceptions_pre_get_one_handler");
var _exceptions_pre_summary_handler = require("./handlers/exceptions_pre_summary_handler");
var _exceptions_pre_delete_item_handler = require("./handlers/exceptions_pre_delete_item_handler");
var _exceptions_pre_export_handler = require("./handlers/exceptions_pre_export_handler");
var _exceptions_pre_multi_list_find_handler = require("./handlers/exceptions_pre_multi_list_find_handler");
var _exceptions_pre_single_list_find_handler = require("./handlers/exceptions_pre_single_list_find_handler");
var _exceptions_pre_import_handler = require("./handlers/exceptions_pre_import_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerListsPluginEndpointExtensionPoints = (registerListsExtensionPoint, endpointAppContextService) => {
  // PRE-CREATE handler
  registerListsExtensionPoint({
    type: 'exceptionsListPreCreateItem',
    callback: (0, _exceptions_pre_create_handler.getExceptionsPreCreateItemHandler)(endpointAppContextService)
  });

  // PRE-UPDATE handler
  registerListsExtensionPoint({
    type: 'exceptionsListPreUpdateItem',
    callback: (0, _exceptions_pre_update_handler.getExceptionsPreUpdateItemHandler)(endpointAppContextService)
  });

  // PRE-GET ONE
  registerListsExtensionPoint({
    type: 'exceptionsListPreGetOneItem',
    callback: (0, _exceptions_pre_get_one_handler.getExceptionsPreGetOneHandler)(endpointAppContextService)
  });

  // PRE-SUMMARY
  registerListsExtensionPoint({
    type: 'exceptionsListPreSummary',
    callback: (0, _exceptions_pre_summary_handler.getExceptionsPreSummaryHandler)(endpointAppContextService)
  });

  // PRE-DELETE item
  registerListsExtensionPoint({
    type: 'exceptionsListPreDeleteItem',
    callback: (0, _exceptions_pre_delete_item_handler.getExceptionsPreDeleteItemHandler)(endpointAppContextService)
  });

  // PRE-EXPORT
  registerListsExtensionPoint({
    type: 'exceptionsListPreExport',
    callback: (0, _exceptions_pre_export_handler.getExceptionsPreExportHandler)(endpointAppContextService)
  });

  // PRE-MULTI-LIST-FIND
  registerListsExtensionPoint({
    type: 'exceptionsListPreMultiListFind',
    callback: (0, _exceptions_pre_multi_list_find_handler.getExceptionsPreMultiListFindHandler)(endpointAppContextService)
  });

  // PRE-SINGLE-LIST-FIND
  registerListsExtensionPoint({
    type: 'exceptionsListPreSingleListFind',
    callback: (0, _exceptions_pre_single_list_find_handler.getExceptionsPreSingleListFindHandler)(endpointAppContextService)
  });

  // PRE-IMPORT
  registerListsExtensionPoint({
    type: 'exceptionsListPreImport',
    callback: (0, _exceptions_pre_import_handler.getExceptionsPreImportHandler)()
  });
};
exports.registerListsPluginEndpointExtensionPoints = registerListsPluginEndpointExtensionPoints;