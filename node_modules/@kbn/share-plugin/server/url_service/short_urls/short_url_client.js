"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ServerShortUrlClient = void 0;
var _error = require("../error");
var _util = require("./util");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const defaultAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function randomStr(length, alphabet = defaultAlphabet) {
  let str = '';
  const alphabetLength = alphabet.length;
  for (let i = 0; i < length; i++) {
    str += alphabet.charAt(Math.floor(Math.random() * alphabetLength));
  }
  return str;
}

/**
 * Dependencies of the Short URL Client.
 */

class ServerShortUrlClient {
  constructor(dependencies) {
    this.dependencies = dependencies;
  }
  async create({
    locator,
    params,
    slug = ''
  }) {
    if (slug) {
      (0, _util.validateSlug)(slug);
    }
    if (!slug) {
      slug = randomStr(5);
    }
    const {
      storage,
      currentVersion
    } = this.dependencies;
    if (slug) {
      const isSlugTaken = await storage.exists(slug);
      if (isSlugTaken) {
        throw new _error.UrlServiceError(`Slug "${slug}" already exists.`, 'SLUG_EXISTS');
      }
    }
    const extracted = this.extractReferences({
      id: locator.id,
      version: currentVersion,
      state: params
    });
    const now = Date.now();
    const data = await storage.create({
      accessCount: 0,
      accessDate: now,
      createDate: now,
      slug,
      locator: extracted.state
    }, {
      references: extracted.references
    });
    return {
      data
    };
  }
  extractReferences(locatorData) {
    const {
      locators
    } = this.dependencies;
    const {
      state,
      references
    } = locators.extract(locatorData);
    return {
      state,
      references: references.map(ref => ({
        ...ref,
        name: 'locator:' + ref.name
      }))
    };
  }
  injectReferences({
    data,
    references
  }) {
    const {
      locators
    } = this.dependencies;
    const locatorReferences = references.filter(ref => ref.name.startsWith('locator:')).map(ref => ({
      ...ref,
      name: ref.name.substr('locator:'.length)
    }));
    return {
      ...data,
      locator: locators.inject(data.locator, locatorReferences)
    };
  }
  async get(id) {
    const {
      storage
    } = this.dependencies;
    const record = await storage.getById(id);
    const data = this.injectReferences(record);
    return {
      data
    };
  }
  async resolve(slug) {
    const {
      storage
    } = this.dependencies;
    const record = await storage.getBySlug(slug);
    const data = this.injectReferences(record);
    this.updateAccessFields(record);
    return {
      data
    };
  }

  /**
   * Access field updates are executed in the background as we don't need to
   * wait for them and confirm that they were successful.
   */
  updateAccessFields(record) {
    const {
      storage
    } = this.dependencies;
    const {
      id,
      ...attributes
    } = record.data;
    storage.update(id, {
      ...attributes,
      accessDate: Date.now(),
      accessCount: (attributes.accessCount || 0) + 1
    }).catch(() => {}); // We are not interested if it succeeds or not.
  }

  async delete(id) {
    const {
      storage
    } = this.dependencies;
    await storage.delete(id);
  }
}
exports.ServerShortUrlClient = ServerShortUrlClient;