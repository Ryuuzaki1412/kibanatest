"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMinMaxIp = exports.getIpSegments = exports.getIpRangeQuery = void 0;
var _ipaddr = _interopRequireDefault(require("ipaddr.js"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const getIpSegments = searchString => {
  if (searchString.indexOf('.') !== -1) {
    // ipv4 takes priority - so if search string contains both `.` and `:` then it will just be an invalid ipv4 search
    const ipv4Segments = searchString.split('.').filter(segment => segment !== '');
    return {
      segments: ipv4Segments,
      type: 'ipv4'
    };
  } else if (searchString.indexOf(':') !== -1) {
    // note that currently, because of the logic of splitting here, searching for shorthand IPv6 IPs is not supported (for example,
    // must search for `59fb:0:0:0:0:1005:cc57:6571` and not `59fb::1005:cc57:6571` to get the expected match)
    const ipv6Segments = searchString.split(':').filter(segment => segment !== '');
    return {
      segments: ipv6Segments,
      type: 'ipv6'
    };
  }
  return {
    segments: [searchString],
    type: 'unknown'
  };
};
exports.getIpSegments = getIpSegments;
const getMinMaxIp = (type, segments) => {
  const isIpv4 = type === 'ipv4';
  const minIp = isIpv4 ? segments.concat(Array(4 - segments.length).fill('0')).join('.') : segments.join(':') + '::';
  const maxIp = isIpv4 ? segments.concat(Array(4 - segments.length).fill('255')).join('.') : segments.concat(Array(8 - segments.length).fill('ffff')).join(':');
  return {
    min: minIp,
    max: maxIp
  };
};
exports.getMinMaxIp = getMinMaxIp;
const buildFullIpSearchRangeQuery = segments => {
  const {
    type: ipType,
    segments: ipSegments
  } = segments;
  const isIpv4 = ipType === 'ipv4';
  const searchIp = ipSegments.join(isIpv4 ? '.' : ':');
  if (_ipaddr.default.isValid(searchIp)) {
    return [{
      key: ipType,
      mask: isIpv4 ? searchIp + '/32' : searchIp + '/128'
    }];
  }
  return undefined;
};
const buildPartialIpSearchRangeQuery = segments => {
  const {
    type: ipType,
    segments: ipSegments
  } = segments;
  const ranges = [];
  if (ipType === 'unknown' || ipType === 'ipv4') {
    const {
      min: minIpv4,
      max: maxIpv4
    } = getMinMaxIp('ipv4', ipSegments);
    if (_ipaddr.default.isValid(minIpv4) && _ipaddr.default.isValid(maxIpv4)) {
      ranges.push({
        key: 'ipv4',
        from: minIpv4,
        to: maxIpv4
      });
    }
  }
  if (ipType === 'unknown' || ipType === 'ipv6') {
    const {
      min: minIpv6,
      max: maxIpv6
    } = getMinMaxIp('ipv6', ipSegments);
    if (_ipaddr.default.isValid(minIpv6) && _ipaddr.default.isValid(maxIpv6)) {
      ranges.push({
        key: 'ipv6',
        from: minIpv6,
        to: maxIpv6
      });
    }
  }
  return ranges;
};
const getIpRangeQuery = searchString => {
  if (searchString.match(/^[A-Fa-f0-9.:]*$/) === null) {
    return {
      validSearch: false
    };
  }
  const ipSegments = getIpSegments(searchString);
  if (ipSegments.type === 'ipv4' && ipSegments.segments.length === 4) {
    const ipv4RangeQuery = buildFullIpSearchRangeQuery(ipSegments);
    return {
      validSearch: Boolean(ipv4RangeQuery),
      rangeQuery: ipv4RangeQuery
    };
  }
  if (ipSegments.type === 'ipv6' && ipSegments.segments.length === 8) {
    const ipv6RangeQuery = buildFullIpSearchRangeQuery(ipSegments);
    return {
      validSearch: Boolean(ipv6RangeQuery),
      rangeQuery: ipv6RangeQuery
    };
  }
  const partialRangeQuery = buildPartialIpSearchRangeQuery(ipSegments);
  return {
    validSearch: !((partialRangeQuery === null || partialRangeQuery === void 0 ? void 0 : partialRangeQuery.length) === 0),
    rangeQuery: partialRangeQuery
  };
};
exports.getIpRangeQuery = getIpRangeQuery;