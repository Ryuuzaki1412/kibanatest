"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AttachmentTypeRegistry = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class AttachmentTypeRegistry {
  constructor(name) {
    (0, _defineProperty2.default)(this, "collection", new Map());
    this.name = name;
  }

  /**
   * Returns true if the registry has the given type registered
   */
  has(id) {
    return this.collection.has(id);
  }

  /**
   * Registers an item to the registry
   */
  register(item) {
    if (this.has(item.id)) {
      throw new Error(_i18n.i18n.translate('xpack.cases.registry.register.duplicateItemErrorMessage', {
        defaultMessage: 'Item "{id}" is already registered on registry {name}',
        values: {
          id: item.id,
          name: this.name
        }
      }));
    }
    this.collection.set(item.id, item);
  }

  /**
   * Returns an item, throw error if not registered
   */
  get(id) {
    const item = this.collection.get(id);
    if (!item) {
      throw new Error(_i18n.i18n.translate('xpack.cases.registry.get.missingItemErrorMessage', {
        defaultMessage: 'Item "{id}" is not registered on registry {name}',
        values: {
          id,
          name: this.name
        }
      }));
    }
    return item;
  }
  list() {
    return Array.from(this.collection.values());
  }
}
exports.AttachmentTypeRegistry = AttachmentTypeRegistry;