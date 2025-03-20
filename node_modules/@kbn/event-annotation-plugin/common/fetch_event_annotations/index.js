"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  getFetchEventAnnotationsMeta: true,
  requestEventAnnotations: true
};
Object.defineProperty(exports, "getFetchEventAnnotationsMeta", {
  enumerable: true,
  get: function () {
    return _fetch_event_annotations_fn.getFetchEventAnnotationsMeta;
  }
});
Object.defineProperty(exports, "requestEventAnnotations", {
  enumerable: true,
  get: function () {
    return _request_event_annotations.requestEventAnnotations;
  }
});
var _fetch_event_annotations_fn = require("./fetch_event_annotations_fn");
var _request_event_annotations = require("./request_event_annotations");
var _types = require("./types");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});