"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Screenshots = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _std = require("@kbn/std");
var _ipaddr = _interopRequireDefault(require("ipaddr.js"));
var _lodash = require("lodash");
var _rxjs = require("rxjs");
var _operators = require("rxjs/operators");
var _common = require("../../common");
var _cloud = require("../cloud");
var _config = require("../config");
var _formats = require("../formats");
var _layouts = require("../layouts");
var _event_logger = require("./event_logger");
var _observable = require("./observable");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DEFAULT_SETUP_RESULT = {
  elementsPositionAndAttributes: null,
  timeRange: null
};
class Screenshots {
  constructor(browserDriverFactory, logger, packageInfo, http, config, cloud) {
    (0, _defineProperty2.default)(this, "semaphore", void 0);
    this.browserDriverFactory = browserDriverFactory;
    this.logger = logger;
    this.packageInfo = packageInfo;
    this.http = http;
    this.config = config;
    this.cloud = cloud;
    this.semaphore = new _std.Semaphore(config.poolSize);
  }
  captureScreenshots(eventLogger, layout, options) {
    const {
      browserTimezone
    } = options;
    return this.browserDriverFactory.createPage({
      browserTimezone,
      openUrlTimeout: (0, _config.durationToNumber)(this.config.capture.timeouts.openUrl),
      defaultViewport: {
        width: layout.width,
        deviceScaleFactor: layout.getBrowserZoom()
      }
    }, this.logger).pipe(this.semaphore.acquire(), (0, _operators.mergeMap)(({
      driver,
      error$,
      close
    }) => {
      const screen = new _observable.ScreenshotObservableHandler(driver, this.config, eventLogger, layout, options);
      return (0, _rxjs.from)(options.urls).pipe((0, _operators.concatMap)((url, index) => screen.setupPage(index, url).pipe((0, _operators.catchError)(error => {
        screen.checkPageIsOpen(); // this fails the job if the browser has closed

        this.logger.error(error);
        eventLogger.error(error, _event_logger.Transactions.SCREENSHOTTING);
        return (0, _rxjs.of)({
          ...DEFAULT_SETUP_RESULT,
          error
        }); // allow "as-is" screenshot with injected warning message
      }), (0, _operators.takeUntil)(error$), screen.getScreenshots())), (0, _operators.take)(options.urls.length), (0, _operators.toArray)(), (0, _operators.mergeMap)(results =>
      // At this point we no longer need the page, close it and send out the results
      close().pipe((0, _operators.map)(({
        metrics
      }) => ({
        metrics,
        results
      })))));
    }), (0, _operators.first)());
  }
  getScreenshottingAppUrl() {
    const info = this.http.getServerInfo();
    const {
      protocol,
      port
    } = info;
    let {
      hostname
    } = info;
    if (_ipaddr.default.isValid(hostname) && !(0, _lodash.sum)(_ipaddr.default.parse(hostname).toByteArray())) {
      hostname = 'localhost';
    }
    return `${protocol}://${hostname}:${port}${this.http.basePath.serverBasePath}/app/${_common.SCREENSHOTTING_APP_ID}`;
  }
  getCaptureOptions({
    expression,
    input,
    request,
    ...options
  }) {
    var _request$headers, _options$headers;
    const headers = {
      ...((_request$headers = request === null || request === void 0 ? void 0 : request.headers) !== null && _request$headers !== void 0 ? _request$headers : {}),
      ...((_options$headers = options.headers) !== null && _options$headers !== void 0 ? _options$headers : {})
    };
    const urls = expression ? [[this.getScreenshottingAppUrl(), {
      [_common.SCREENSHOTTING_EXPRESSION]: expression,
      [_common.SCREENSHOTTING_EXPRESSION_INPUT]: input
    }]] : options.urls;
    return (0, _lodash.defaultsDeep)({
      ...options,
      headers,
      urls
    }, {
      timeouts: {
        openUrl: 60000,
        waitForElements: 60000,
        renderComplete: 120000
      },
      urls: []
    });
  }
  systemHasInsufficientMemory() {
    return (0, _cloud.systemHasInsufficientMemory)(this.cloud, this.logger.get('cloud'));
  }
  getScreenshots(options) {
    var _options$layout;
    if (this.systemHasInsufficientMemory()) {
      return (0, _rxjs.throwError)(() => new _common.errors.InsufficientMemoryAvailableOnCloudError());
    }
    const eventLogger = new _event_logger.EventLogger(this.logger, this.config);
    const transactionEnd = eventLogger.startTransaction(_event_logger.Transactions.SCREENSHOTTING);
    const layout = (0, _layouts.createLayout)((_options$layout = options.layout) !== null && _options$layout !== void 0 ? _options$layout : {});
    const captureOptions = this.getCaptureOptions(options);
    return this.captureScreenshots(eventLogger, layout, captureOptions).pipe((0, _operators.tap)(({
      results,
      metrics
    }) => {
      transactionEnd({
        labels: {
          cpu: metrics === null || metrics === void 0 ? void 0 : metrics.cpu,
          memory: metrics === null || metrics === void 0 ? void 0 : metrics.memory,
          memory_mb: metrics === null || metrics === void 0 ? void 0 : metrics.memoryInMegabytes,
          ...eventLogger.getByteLengthFromCaptureResults(results)
        }
      });
    }), (0, _operators.mergeMap)(result => {
      switch (options.format) {
        case 'pdf':
          return (0, _formats.toPdf)(eventLogger, this.packageInfo, layout, options, result);
        default:
          return (0, _formats.toPng)(result);
      }
    }));
  }
}
exports.Screenshots = Screenshots;