"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TelemetryEventsSender = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _tasks = require("./tasks");
var _constants = require("./constants");
var _task = require("./task");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class TelemetryEventsSender {
  // @ts-expect-error used as part of this

  constructor(logger) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "intervalId", void 0);
    (0, _defineProperty2.default)(this, "receiver", void 0);
    (0, _defineProperty2.default)(this, "analyticsReportEvent", void 0);
    (0, _defineProperty2.default)(this, "telemetryTasks", void 0);
    this.logger = logger.get('telemetry_events');
  }
  setup(telemetryReceiver, taskManager, analytics) {
    if (analytics) {
      this.analyticsReportEvent = analytics.reportEvent;
      this.registerEvents(analytics.registerEventType);
      if (taskManager) {
        this.telemetryTasks = (0, _tasks.createTelemetryTaskConfigs)().map(config => {
          const task = new _task.OsqueryTelemetryTask(config, this.logger, this, telemetryReceiver);
          task.register(taskManager);
          return task;
        });
      }
    }
  }
  start(taskManager, receiver) {
    this.receiver = receiver;
    if (taskManager && this.telemetryTasks) {
      this.logger.debug(`Starting osquery telemetry tasks`);
      this.telemetryTasks.forEach(task => task.start(taskManager));
    }
  }
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  reportEvent(...args) {
    if (this.analyticsReportEvent) {
      this.analyticsReportEvent(...args);
    }
  }
  registerEvents(registerEventType) {
    registerEventType({
      eventType: _constants.TELEMETRY_EBT_LIVE_QUERY_EVENT,
      schema: {
        action_id: {
          type: 'keyword',
          _meta: {
            description: ''
          }
        },
        '@timestamp': {
          type: 'date',
          _meta: {
            description: ''
          }
        },
        expiration: {
          type: 'date',
          _meta: {
            description: ''
          }
        },
        agent_ids: {
          type: 'pass_through',
          _meta: {
            description: '',
            optional: true
          }
        },
        agent_all: {
          type: 'boolean',
          _meta: {
            description: '',
            optional: true
          }
        },
        agent_platforms: {
          type: 'pass_through',
          _meta: {
            description: '',
            optional: true
          }
        },
        agent_policy_ids: {
          type: 'pass_through',
          _meta: {
            description: '',
            optional: true
          }
        },
        agents: {
          type: 'long',
          _meta: {
            description: ''
          }
        },
        metadata: {
          type: 'pass_through',
          _meta: {
            description: '',
            optional: true
          }
        },
        queries: {
          type: 'pass_through',
          _meta: {
            description: ''
          }
        },
        alert_ids: {
          type: 'pass_through',
          _meta: {
            description: '',
            optional: true
          }
        },
        event_ids: {
          type: 'pass_through',
          _meta: {
            description: '',
            optional: true
          }
        },
        case_ids: {
          type: 'pass_through',
          _meta: {
            description: '',
            optional: true
          }
        },
        pack_id: {
          type: 'keyword',
          _meta: {
            description: '',
            optional: true
          }
        },
        pack_name: {
          type: 'keyword',
          _meta: {
            description: '',
            optional: true
          }
        },
        pack_prebuilt: {
          type: 'boolean',
          _meta: {
            description: '',
            optional: true
          }
        }
      }
    });
    registerEventType({
      eventType: _constants.TELEMETRY_EBT_PACK_EVENT,
      schema: {
        name: {
          type: 'keyword',
          _meta: {
            description: ''
          }
        },
        queries: {
          type: 'pass_through',
          _meta: {
            description: 'Pack queries'
          }
        },
        policies: {
          type: 'short',
          _meta: {
            description: 'Number of agent policies assigned to the pack'
          }
        },
        prebuilt: {
          type: 'boolean',
          _meta: {
            description: 'Elastic prebuilt pack'
          }
        },
        enabled: {
          type: 'boolean',
          _meta: {
            description: 'Pack enabled'
          }
        }
      }
    });
    registerEventType({
      eventType: _constants.TELEMETRY_EBT_CONFIG_EVENT,
      schema: {
        id: {
          type: 'keyword',
          _meta: {
            description: ''
          }
        },
        version: {
          type: 'keyword',
          _meta: {
            description: 'osquery_manger integration version'
          }
        },
        enabled: {
          type: 'boolean',
          _meta: {
            description: ''
          }
        },
        config: {
          type: 'pass_through',
          _meta: {
            description: 'Osquery package policy config'
          }
        }
      }
    });
    registerEventType({
      eventType: _constants.TELEMETRY_EBT_SAVED_QUERY_EVENT,
      schema: {
        id: {
          type: 'keyword',
          _meta: {
            description: ''
          }
        },
        query: {
          type: 'text',
          _meta: {
            description: ''
          }
        },
        platform: {
          type: 'keyword',
          _meta: {
            description: '',
            optional: true
          }
        },
        interval: {
          type: 'short',
          _meta: {
            description: '',
            optional: true
          }
        },
        snapshot: {
          type: 'boolean',
          _meta: {
            description: ''
          }
        },
        removed: {
          type: 'boolean',
          _meta: {
            description: '',
            optional: true
          }
        },
        prebuilt: {
          type: 'boolean',
          _meta: {
            description: '',
            optional: true
          }
        },
        ecs_mapping: {
          type: 'pass_through',
          _meta: {
            description: '',
            optional: true
          }
        }
      }
    });
  }
}
exports.TelemetryEventsSender = TelemetryEventsSender;