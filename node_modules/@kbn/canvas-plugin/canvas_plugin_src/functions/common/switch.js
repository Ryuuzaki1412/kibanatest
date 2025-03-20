"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.switchFn = switchFn;
var _rxjs = require("rxjs");
var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function switchFn() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().switch;
  return {
    name: 'switch',
    help,
    args: {
      case: {
        types: ['case'],
        aliases: ['_'],
        resolve: false,
        multi: true,
        required: true,
        help: argHelp.case
      },
      default: {
        aliases: ['finally'],
        resolve: false,
        help: argHelp.default
      }
    },
    fn: function fn(input, args) {
      return (0, _rxjs.defer)(() => {
        if (!args.case.length) {
          var _args$default, _args$default2;
          return (_args$default = (_args$default2 = args.default) === null || _args$default2 === void 0 ? void 0 : _args$default2.call(args)) !== null && _args$default !== void 0 ? _args$default : (0, _rxjs.of)(input);
        }
        const [head$, ...tail$] = args.case;
        return head$().pipe((0, _rxjs.defaultIfEmpty)(undefined), (0, _rxjs.switchMap)(value => value !== null && value !== void 0 && value.matches ? (0, _rxjs.of)(value.result) : fn(input, {
          ...args,
          case: tail$
        })));
      });
    }
  };
}