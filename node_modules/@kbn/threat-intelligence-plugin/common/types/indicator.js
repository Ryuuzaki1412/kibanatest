"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateMockUrlIndicator = exports.generateMockIndicatorWithTlp = exports.generateMockIndicator = exports.generateMockFileIndicator = exports.RawIndicatorFieldId = exports.IndicatorFieldEventEnrichmentMap = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
/**
 * Enum of indicator fields supported by the Threat Intelligence plugin.
 */
let RawIndicatorFieldId;
/**
 * Threat indicator field map to Enriched Event.
 * (reverse of https://github.com/elastic/kibana/blob/main/x-pack/plugins/security_solution/common/cti/constants.ts#L35)
 */
exports.RawIndicatorFieldId = RawIndicatorFieldId;
(function (RawIndicatorFieldId) {
  RawIndicatorFieldId["Type"] = "threat.indicator.type";
  RawIndicatorFieldId["Confidence"] = "threat.indicator.confidence";
  RawIndicatorFieldId["FirstSeen"] = "threat.indicator.first_seen";
  RawIndicatorFieldId["LastSeen"] = "threat.indicator.last_seen";
  RawIndicatorFieldId["MarkingTLP"] = "threat.indicator.marking.tlp";
  RawIndicatorFieldId["Feed"] = "threat.feed.name";
  RawIndicatorFieldId["Ip"] = "threat.indicator.ip";
  RawIndicatorFieldId["EmailAddress"] = "threat.indicator.email.address";
  RawIndicatorFieldId["UrlFull"] = "threat.indicator.url.full";
  RawIndicatorFieldId["UrlOriginal"] = "threat.indicator.url.original";
  RawIndicatorFieldId["UrlDomain"] = "threat.indicator.url.domain";
  RawIndicatorFieldId["FileSha256"] = "threat.indicator.file.hash.sha256";
  RawIndicatorFieldId["FileMd5"] = "threat.indicator.file.hash.md5";
  RawIndicatorFieldId["FileSha1"] = "threat.indicator.file.hash.sha1";
  RawIndicatorFieldId["FileSha224"] = "threat.indicator.file.hash.sha224";
  RawIndicatorFieldId["FileSha3224"] = "threat.indicator.file.hash.sha3-224";
  RawIndicatorFieldId["FileSha3256"] = "threat.indicator.file.hash.sha3-256";
  RawIndicatorFieldId["FileSha384"] = "threat.indicator.file.hash.sha384";
  RawIndicatorFieldId["FileSha3384"] = "threat.indicator.file.hash.sha3-384";
  RawIndicatorFieldId["FileSha512"] = "threat.indicator.file.hash.sha512";
  RawIndicatorFieldId["FileSha3512"] = "threat.indicator.file.hash.sha3-512";
  RawIndicatorFieldId["FileSha512224"] = "threat.indicator.file.hash.sha512/224";
  RawIndicatorFieldId["FileSha512256"] = "threat.indicator.file.hash.sha512/256";
  RawIndicatorFieldId["FileSSDeep"] = "threat.indicator.file.hash.ssdeep";
  RawIndicatorFieldId["FileTlsh"] = "threat.indicator.file.hash.tlsh";
  RawIndicatorFieldId["FileImpfuzzy"] = "threat.indicator.file.hash.impfuzzy";
  RawIndicatorFieldId["FileImphash"] = "threat.indicator.file.hash.imphash";
  RawIndicatorFieldId["FilePehash"] = "threat.indicator.file.hash.pehash";
  RawIndicatorFieldId["FileVhash"] = "threat.indicator.file.hash.vhash";
  RawIndicatorFieldId["X509Serial"] = "threat.indicator.x509.serial_number";
  RawIndicatorFieldId["WindowsRegistryKey"] = "threat.indicator.registry.key";
  RawIndicatorFieldId["WindowsRegistryPath"] = "threat.indicator.registry.path";
  RawIndicatorFieldId["AutonomousSystemNumber"] = "threat.indicator.as.number";
  RawIndicatorFieldId["MacAddress"] = "threat.indicator.mac";
  RawIndicatorFieldId["TimeStamp"] = "@timestamp";
  RawIndicatorFieldId["Id"] = "_id";
  RawIndicatorFieldId["Name"] = "threat.indicator.name";
  RawIndicatorFieldId["Description"] = "threat.indicator.description";
  RawIndicatorFieldId["NameOrigin"] = "threat.indicator.name_origin";
})(RawIndicatorFieldId || (exports.RawIndicatorFieldId = RawIndicatorFieldId = {}));
const IndicatorFieldEventEnrichmentMap = {
  [RawIndicatorFieldId.FileSha256]: ['file.hash.sha256'],
  [RawIndicatorFieldId.FileMd5]: ['file.hash.md5'],
  [RawIndicatorFieldId.FileSha1]: ['file.hash.sha1'],
  [RawIndicatorFieldId.FileSha224]: ['file.hash.sha224'],
  [RawIndicatorFieldId.FileSha3224]: ['file.hash.sha3-224'],
  [RawIndicatorFieldId.FileSha3256]: ['file.hash.sha3-256'],
  [RawIndicatorFieldId.FileSha384]: ['file.hash.sha384'],
  [RawIndicatorFieldId.FileSha3384]: ['file.hash.sha3-384'],
  [RawIndicatorFieldId.FileSha512]: ['file.hash.sha512'],
  [RawIndicatorFieldId.FileSha3512]: ['file.hash.sha3-512'],
  [RawIndicatorFieldId.FileSha512224]: ['file.hash.sha512/224'],
  [RawIndicatorFieldId.FileSha512256]: ['file.hash.sha512/256'],
  [RawIndicatorFieldId.FileSSDeep]: ['file.hash.ssdeep'],
  [RawIndicatorFieldId.FileTlsh]: ['file.hash.tlsh'],
  [RawIndicatorFieldId.FileImpfuzzy]: ['file.hash.impfuzzy'],
  [RawIndicatorFieldId.FileImphash]: ['file.hash.imphash'],
  [RawIndicatorFieldId.FilePehash]: ['file.hash.pehash'],
  [RawIndicatorFieldId.FileVhash]: ['file.hash.vhash'],
  [RawIndicatorFieldId.Ip]: ['source.ip', 'destination.ip'],
  [RawIndicatorFieldId.UrlFull]: ['url.full'],
  [RawIndicatorFieldId.WindowsRegistryPath]: ['registry.path']
};

/**
 * Threat Intelligence Indicator interface.
 */
exports.IndicatorFieldEventEnrichmentMap = IndicatorFieldEventEnrichmentMap;
/**
 * Used as a base to create Indicators of a specific type. Mocks are used in Jest tests and storybooks
 */
const generateMockBaseIndicator = () => ({
  fields: {
    '@timestamp': ['2022-01-01T01:01:01.000Z'],
    'threat.indicator.first_seen': ['2022-01-01T01:01:01.000Z'],
    'threat.feed.name': ['[Filebeat] AbuseCH Malware']
  },
  _id: Math.random()
});

/**
 * Used to create an Indicator where the type is not important.
 */
const generateMockIndicator = () => {
  const indicator = generateMockBaseIndicator();
  indicator.fields['threat.indicator.type'] = ['type'];
  indicator.fields['threat.indicator.ip'] = ['0.0.0.0'];
  indicator.fields['threat.indicator.name'] = ['0.0.0.0'];
  return indicator;
};

/**
 * Used to create an Indicator with tlp marking
 */
exports.generateMockIndicator = generateMockIndicator;
const generateMockIndicatorWithTlp = () => {
  const indicator = generateMockBaseIndicator();
  indicator.fields['threat.indicator.type'] = ['type'];
  indicator.fields['threat.indicator.ip'] = ['0.0.0.0'];
  indicator.fields['threat.indicator.name'] = ['0.0.0.0'];
  indicator.fields['threat.indicator.marking.tlp'] = ['RED'];
  return indicator;
};

/**
 * Used to create a Url Indicator.
 */
exports.generateMockIndicatorWithTlp = generateMockIndicatorWithTlp;
const generateMockUrlIndicator = () => {
  const indicator = generateMockBaseIndicator();
  indicator.fields['threat.indicator.type'] = ['url'];
  indicator.fields['threat.indicator.ip'] = ['0.0.0.0'];
  indicator.fields['threat.indicator.url.full'] = ['https://0.0.0.0/test'];
  indicator.fields['threat.indicator.url.original'] = ['https://0.0.0.0/test'];
  indicator.fields['threat.indicator.name'] = ['https://0.0.0.0/test'];
  indicator.fields['threat.indicator.name_origin'] = ['threat.indicator.url.full'];
  return indicator;
};

/**
 * Used to create a File Indicator.
 */
exports.generateMockUrlIndicator = generateMockUrlIndicator;
const generateMockFileIndicator = () => {
  const indicator = generateMockBaseIndicator();
  indicator.fields['threat.indicator.type'] = ['file'];
  indicator.fields['threat.indicator.file.hash.sha256'] = ['sample_sha256_hash'];
  indicator.fields['threat.indicator.file.hash.md5'] = ['sample_md5_hash'];
  indicator.fields['threat.indicator.file.hash.sha1'] = ['sample_sha1_hash'];
  indicator.fields['threat.indicator.name'] = ['sample_sha256_hash'];
  indicator.fields['threat.indicator.name_origin'] = ['threat.indicator.file.hash.sha256'];
  return indicator;
};
exports.generateMockFileIndicator = generateMockFileIndicator;