"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SecretsSchema = exports.Response = exports.FailureResponse = exports.CreateAlertParamsSchema = exports.ConfigSchema = exports.CloseAlertParamsSchema = void 0;
var _configSchema = require("@kbn/config-schema");
var _lodash = require("lodash");
var i18n = _interopRequireWildcard(require("./translations"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ConfigSchema = _configSchema.schema.object({
  apiUrl: _configSchema.schema.string()
});
exports.ConfigSchema = ConfigSchema;
const SecretsSchema = _configSchema.schema.object({
  apiKey: _configSchema.schema.string()
});
exports.SecretsSchema = SecretsSchema;
const SuccessfulResponse = _configSchema.schema.object({
  took: _configSchema.schema.number(),
  requestId: _configSchema.schema.string(),
  result: _configSchema.schema.string()
}, {
  unknowns: 'allow'
});
const FailureResponse = _configSchema.schema.object({
  took: _configSchema.schema.number(),
  requestId: _configSchema.schema.string(),
  message: _configSchema.schema.maybe(_configSchema.schema.string()),
  result: _configSchema.schema.maybe(_configSchema.schema.string()),
  /**
   * When testing invalid requests with Opsgenie the response seems to take the form:
   * {
   *   ['field that is invalid']: 'message about what the issue is'
   * }
   *
   * e.g.
   *
   * {
   *   "message": "Message can not be empty.",
   *   "username": "must be a well-formed email address"
   * }
   */
  errors: _configSchema.schema.maybe(_configSchema.schema.any())
}, {
  unknowns: 'allow'
});
exports.FailureResponse = FailureResponse;
const Response = _configSchema.schema.oneOf([SuccessfulResponse, FailureResponse]);
exports.Response = Response;
const CloseAlertParamsSchema = _configSchema.schema.object({
  alias: _configSchema.schema.string(),
  user: _configSchema.schema.maybe(_configSchema.schema.string({
    maxLength: 100
  })),
  source: _configSchema.schema.maybe(_configSchema.schema.string({
    maxLength: 100
  })),
  note: _configSchema.schema.maybe(_configSchema.schema.string({
    maxLength: 25000
  }))
});
exports.CloseAlertParamsSchema = CloseAlertParamsSchema;
const responderTypes = _configSchema.schema.oneOf([_configSchema.schema.literal('team'), _configSchema.schema.literal('user'), _configSchema.schema.literal('escalation'), _configSchema.schema.literal('schedule')]);

/**
 * For more information on the Opsgenie create alert schema see: https://docs.opsgenie.com/docs/alert-api#create-alert
 */
const CreateAlertParamsSchema = _configSchema.schema.object({
  message: _configSchema.schema.string({
    maxLength: 130,
    minLength: 1,
    validate: message => (0, _lodash.isEmpty)(message.trim()) ? i18n.MESSAGE_NON_EMPTY : undefined
  }),
  /**
   * The max length here should be 512 according to Opsgenie's docs but we will sha256 hash the alias if it is longer than 512
   * so we'll not impose a limit on the schema otherwise it'll get rejected prematurely.
   */
  alias: _configSchema.schema.maybe(_configSchema.schema.string()),
  description: _configSchema.schema.maybe(_configSchema.schema.string({
    maxLength: 15000
  })),
  responders: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.oneOf([_configSchema.schema.object({
    name: _configSchema.schema.string(),
    type: responderTypes
  }), _configSchema.schema.object({
    id: _configSchema.schema.string(),
    type: responderTypes
  }),
  /**
   * This field is not explicitly called out in the description of responders within Opsgenie's API docs but it is
   * shown in an example and when I tested it, it seems to work as they throw an error if you try to specify a username
   * without a valid email
   */
  _configSchema.schema.object({
    username: _configSchema.schema.string(),
    type: _configSchema.schema.literal('user')
  })]), {
    maxSize: 50
  })),
  visibleTo: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.oneOf([_configSchema.schema.object({
    name: _configSchema.schema.string(),
    type: _configSchema.schema.literal('team')
  }), _configSchema.schema.object({
    id: _configSchema.schema.string(),
    type: _configSchema.schema.literal('team')
  }), _configSchema.schema.object({
    id: _configSchema.schema.string(),
    type: _configSchema.schema.literal('user')
  }), _configSchema.schema.object({
    username: _configSchema.schema.string(),
    type: _configSchema.schema.literal('user')
  })]), {
    maxSize: 50
  })),
  actions: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string({
    maxLength: 50
  }), {
    maxSize: 10
  })),
  tags: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string({
    maxLength: 50
  }), {
    maxSize: 20
  })),
  /**
   * The validation requirement here is that the total characters between the key and value do not exceed 8000. Opsgenie
   * will truncate the value if it would exceed the 8000 but it doesn't throw an error. Because of this I'm intentionally
   * not validating the length of the keys and values here.
   */
  details: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.string())),
  entity: _configSchema.schema.maybe(_configSchema.schema.string({
    maxLength: 512
  })),
  source: _configSchema.schema.maybe(_configSchema.schema.string({
    maxLength: 100
  })),
  priority: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('P1'), _configSchema.schema.literal('P2'), _configSchema.schema.literal('P3'), _configSchema.schema.literal('P4'), _configSchema.schema.literal('P5')])),
  user: _configSchema.schema.maybe(_configSchema.schema.string({
    maxLength: 100
  })),
  note: _configSchema.schema.maybe(_configSchema.schema.string({
    maxLength: 25000
  }))
});
exports.CreateAlertParamsSchema = CreateAlertParamsSchema;