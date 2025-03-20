"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enhanceRouter = enhanceRouter;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Wraps {@link FilesRouter}, adding a middle man for injecting file-kind into
 * route handler context
 */
function enhanceRouter({
  router,
  fileKind
}) {
  const handlerWrapper = handler => async (ctx, req, res) => {
    return handler(Object.create(ctx, {
      fileKind: {
        value: fileKind,
        enumerable: true,
        writeable: false
      }
    }), req, res);
  };
  return new Proxy(router, {
    get(target, prop, receiver) {
      if (['get', 'post', 'put', 'patch', 'delete'].includes(prop)) {
        const manInTheMiddleRegistrar = (opts, handler) => {
          return Reflect.apply(target[prop], target, [opts, handlerWrapper(handler)]);
        };
        return manInTheMiddleRegistrar;
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}