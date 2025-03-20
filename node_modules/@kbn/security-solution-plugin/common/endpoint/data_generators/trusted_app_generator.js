"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TrustedAppGenerator = void 0;
var _lodash = require("lodash");
var _securitysolutionUtils = require("@kbn/securitysolution-utils");
var _base_data_generator = require("./base_data_generator");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const TRUSTED_APP_NAMES = ['Symantec Endpoint Security', 'Bitdefender GravityZone', 'Malwarebytes', 'Sophos Intercept X', 'Webroot Business Endpoint Protection', 'ESET Endpoint Security', 'FortiClient', 'Kaspersky Endpoint Security', 'Trend Micro Apex One', 'CylancePROTECT', 'VIPRE', 'Norton', 'McAfee Endpoint Security', 'AVG AntiVirus', 'CrowdStrike Falcon', 'Avast Business Antivirus', 'Avira Antivirus', 'Cisco AMP for Endpoints', 'Eset Endpoint Antivirus', 'VMware Carbon Black', 'Palo Alto Networks Traps', 'Trend Micro', 'SentinelOne', 'Panda Security for Desktops', 'Microsoft Defender ATP'];
const EFFECT_SCOPE_TYPES = ['policy', 'global'];
class TrustedAppGenerator extends _base_data_generator.BaseDataGenerator {
  generate(overrides = {}) {
    return (0, _lodash.merge)(this.generateTrustedAppForCreate(), {
      id: this.seededUUIDv4(),
      version: this.randomString(5),
      created_at: this.randomPastDate(),
      updated_at: new Date().toISOString(),
      created_by: this.randomUser(),
      updated_by: this.randomUser()
    }, overrides);
  }
  generateTrustedAppForCreate({
    effectScope: effectiveScopeOverride,
    ...overrides
  } = {}) {
    var _overrides$os;
    const name = this.randomChoice(TRUSTED_APP_NAMES);
    const scopeType = this.randomChoice(EFFECT_SCOPE_TYPES);
    const effectScope = effectiveScopeOverride !== null && effectiveScopeOverride !== void 0 ? effectiveScopeOverride : {
      type: scopeType,
      ...(scopeType === 'policy' ? {
        policies: this.randomArray(5, () => this.randomUUID())
      } : {})
    };
    const os = (_overrides$os = overrides.os) !== null && _overrides$os !== void 0 ? _overrides$os : 'windows';
    const pathEntry = this.randomChoice([{
      field: _securitysolutionUtils.ConditionEntryField.PATH,
      operator: 'included',
      type: 'match',
      value: os !== 'windows' ? '/one/two/three' : 'c:\\fol\\bin.exe'
    }, {
      field: _securitysolutionUtils.ConditionEntryField.PATH,
      operator: 'included',
      type: 'wildcard',
      value: os !== 'windows' ? '/one/t*/*re/three.app' : 'c:\\fol*\\*ub*\\bin.exe'
    }]);

    // TS types are conditional when it comes to the combination of OS and ENTRIES
    // @ts-expect-error TS2322
    return (0, _lodash.merge)({
      description: `Generator says we trust ${name}`,
      name,
      os,
      effectScope,
      entries: [{
        field: _securitysolutionUtils.ConditionEntryField.HASH,
        operator: 'included',
        type: 'match',
        value: '1234234659af249ddf3e40864e9fb241'
      }, pathEntry]
    }, overrides);
  }
}
exports.TrustedAppGenerator = TrustedAppGenerator;