"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressionsServiceFork = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * `ExpressionsService` class is used for multiple purposes:
 *
 * 1. It implements the same Expressions service that can be used on both:
 *    (1) server-side and (2) browser-side.
 * 2. It implements the same Expressions service that users can fork/clone,
 *    thus have their own instance of the Expressions plugin.
 * 3. `ExpressionsService` defines the public contracts of *setup* and *start*
 *    Kibana Platform life-cycles for ease-of-use on server-side and browser-side.
 * 4. `ExpressionsService` creates a bound version of all exported contract functions.
 * 5. Functions are bound the way there are:
 *
 *    ```ts
 *    registerFunction = (...args: Parameters<Executor['registerFunction']>
 *      ): ReturnType<Executor['registerFunction']> => this.executor.registerFunction(...args);
 *    ```
 *
 *    so that JSDoc appears in developers IDE when they use those `plugins.expressions.registerFunction(`.
 */
class ExpressionsServiceFork {
  /**
   * @note Workaround since the expressions service is frozen.
   */
  constructor(namespace, expressionsService) {
    this.namespace = namespace;
    this.expressionsService = expressionsService;
    this.registerFunction = this.registerFunction.bind(this);
    this.registerRenderer = this.registerRenderer.bind(this);
    this.registerType = this.registerType.bind(this);
    this.run = this.run.bind(this);
    this.execute = this.execute.bind(this);
    this.getFunction = this.getFunction.bind(this);
    this.getFunctions = this.getFunctions.bind(this);
  }
  registerFunction(definition) {
    if (typeof definition === 'function') definition = definition();
    return this.expressionsService.registerFunction({
      ...definition,
      namespace: this.namespace
    });
  }
  registerRenderer(definition) {
    if (typeof definition === 'function') definition = definition();
    return this.expressionsService.registerRenderer({
      ...definition,
      namespace: this.namespace
    });
  }
  registerType(definition) {
    if (typeof definition === 'function') definition = definition();
    return this.expressionsService.registerType({
      ...definition,
      namespace: this.namespace
    });
  }
  run(ast, input, params) {
    return this.expressionsService.run(ast, input, {
      ...params,
      namespace: this.namespace
    });
  }
  execute(ast, input, params) {
    return this.expressionsService.execute(ast, input, {
      ...params,
      namespace: this.namespace
    });
  }
  getFunction(name) {
    return this.expressionsService.getFunction(name, this.namespace);
  }
  getFunctions() {
    return this.expressionsService.getFunctions(this.namespace);
  }
  /**
   * Returns Kibana Platform *setup* life-cycle contract. Useful to return the
   * same contract on server-side and browser-side.
   */
  setup() {
    return {
      ...this.expressionsService,
      registerFunction: this.registerFunction,
      registerRenderer: this.registerRenderer,
      registerType: this.registerType
    };
  }

  /**
   * Returns Kibana Platform *start* life-cycle contract. Useful to return the
   * same contract on server-side and browser-side.
   */
  start() {
    return {
      ...this.expressionsService,
      run: this.run,
      execute: this.execute,
      getFunction: this.getFunction,
      getFunctions: this.getFunctions
    };
  }
}
exports.ExpressionsServiceFork = ExpressionsServiceFork;