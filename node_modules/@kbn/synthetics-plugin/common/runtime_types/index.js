"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _alerts = require("./alerts");
Object.keys(_alerts).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _alerts[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _alerts[key];
    }
  });
});
var _certs = require("./certs");
Object.keys(_certs).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _certs[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _certs[key];
    }
  });
});
var _common = require("./common");
Object.keys(_common).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _common[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _common[key];
    }
  });
});
var _dynamic_settings = require("./dynamic_settings");
Object.keys(_dynamic_settings).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _dynamic_settings[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _dynamic_settings[key];
    }
  });
});
var _monitor = require("./monitor");
Object.keys(_monitor).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _monitor[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _monitor[key];
    }
  });
});
var _ping = require("./ping");
Object.keys(_ping).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ping[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ping[key];
    }
  });
});
var _snapshot = require("./snapshot");
Object.keys(_snapshot).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _snapshot[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _snapshot[key];
    }
  });
});
var _network_events = require("./network_events");
Object.keys(_network_events).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _network_events[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _network_events[key];
    }
  });
});
var _monitor_management = require("./monitor_management");
Object.keys(_monitor_management).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _monitor_management[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _monitor_management[key];
    }
  });
});
var _synthetics_private_locations = require("./monitor_management/synthetics_private_locations");
Object.keys(_synthetics_private_locations).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _synthetics_private_locations[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _synthetics_private_locations[key];
    }
  });
});