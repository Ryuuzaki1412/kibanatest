"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TrustedAppValidator = void 0;
var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");
var _configSchema = require("@kbn/config-schema");
var _securitysolutionUtils = require("@kbn/securitysolution-utils");
var _base_validator = require("./base_validator");
var _validations = require("../../../../common/endpoint/service/artifacts/validations");
var _errors = require("./errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ProcessHashField = _configSchema.schema.oneOf([_configSchema.schema.literal('process.hash.md5'), _configSchema.schema.literal('process.hash.sha1'), _configSchema.schema.literal('process.hash.sha256')]);
const ProcessExecutablePath = _configSchema.schema.literal('process.executable.caseless');
const ProcessCodeSigner = _configSchema.schema.literal('process.Ext.code_signature');
const ConditionEntryTypeSchema = _configSchema.schema.conditional(_configSchema.schema.siblingRef('field'), ProcessExecutablePath, _configSchema.schema.oneOf([_configSchema.schema.literal('match'), _configSchema.schema.literal('wildcard')]), _configSchema.schema.literal('match'));
const ConditionEntryOperatorSchema = _configSchema.schema.literal('included');
/*
 * A generic Entry schema to be used for a specific entry schema depending on the OS
 */
const CommonEntrySchema = {
  field: _configSchema.schema.oneOf([ProcessHashField, ProcessExecutablePath]),
  type: ConditionEntryTypeSchema,
  operator: ConditionEntryOperatorSchema,
  // If field === HASH then validate hash with custom method, else validate string with minLength = 1
  value: _configSchema.schema.conditional(_configSchema.schema.siblingRef('field'), ProcessHashField, _configSchema.schema.string({
    validate: hash => (0, _validations.isValidHash)(hash) ? undefined : `invalid hash value [${hash}]`
  }), _configSchema.schema.conditional(_configSchema.schema.siblingRef('field'), ProcessExecutablePath, _configSchema.schema.string({
    validate: pathValue => pathValue.length > 0 ? undefined : `invalid path value [${pathValue}]`
  }), _configSchema.schema.string({
    validate: signerValue => signerValue.length > 0 ? undefined : `invalid signer value [${signerValue}]`
  })))
};

// Windows Signer entries use a Nested field that checks to ensure
// that the certificate is trusted
const WindowsSignerEntrySchema = _configSchema.schema.object({
  type: _configSchema.schema.literal('nested'),
  field: ProcessCodeSigner,
  entries: _configSchema.schema.arrayOf(_configSchema.schema.oneOf([_configSchema.schema.object({
    field: _configSchema.schema.literal('trusted'),
    value: _configSchema.schema.literal('true'),
    type: _configSchema.schema.literal('match'),
    operator: _configSchema.schema.literal('included')
  }), _configSchema.schema.object({
    field: _configSchema.schema.literal('subject_name'),
    value: _configSchema.schema.string({
      minLength: 1
    }),
    type: _configSchema.schema.literal('match'),
    operator: _configSchema.schema.literal('included')
  })]), {
    minSize: 2,
    maxSize: 2
  })
});
const WindowsEntrySchema = _configSchema.schema.oneOf([WindowsSignerEntrySchema, _configSchema.schema.object({
  ...CommonEntrySchema,
  field: _configSchema.schema.oneOf([ProcessHashField, ProcessExecutablePath])
})]);
const LinuxEntrySchema = _configSchema.schema.object({
  ...CommonEntrySchema
});
const MacEntrySchema = _configSchema.schema.object({
  ...CommonEntrySchema
});
const entriesSchemaOptions = {
  minSize: 1,
  validate(entries) {
    const dups = (0, _validations.getDuplicateFields)(entries);
    return dups.map(field => `Duplicated entry: ${field}`).join(', ') || undefined;
  }
};

/*
 * Entities array schema depending on Os type using schema.conditional.
 * If OS === WINDOWS then use Windows schema,
 * else if OS === LINUX then use Linux schema,
 * else use Mac schema
 *
 * The validate function checks there is no duplicated entry inside the array
 */
const EntriesSchema = _configSchema.schema.conditional(_configSchema.schema.contextRef('os'), _securitysolutionUtils.OperatingSystem.WINDOWS, _configSchema.schema.arrayOf(WindowsEntrySchema, entriesSchemaOptions), _configSchema.schema.conditional(_configSchema.schema.contextRef('os'), _securitysolutionUtils.OperatingSystem.LINUX, _configSchema.schema.arrayOf(LinuxEntrySchema, entriesSchemaOptions), _configSchema.schema.arrayOf(MacEntrySchema, entriesSchemaOptions)));

/**
 * Schema to validate Trusted Apps data for create and update.
 * When called, it must be given an `context` with a `os` property set
 *
 * @example
 *
 * TrustedAppDataSchema.validate(item, { os: 'windows' });
 */
const TrustedAppDataSchema = _configSchema.schema.object({
  entries: EntriesSchema
},
// Because we are only validating some fields from the Exception Item, we set `unknowns` to `ignore` here
{
  unknowns: 'ignore'
});
class TrustedAppValidator extends _base_validator.BaseValidator {
  static isTrustedApp(item) {
    return item.listId === _securitysolutionListConstants.ENDPOINT_TRUSTED_APPS_LIST_ID;
  }
  async validateHasWritePrivilege() {
    return super.validateHasPrivilege('canWriteTrustedApplications');
  }
  async validateHasReadPrivilege() {
    return super.validateHasPrivilege('canReadTrustedApplications');
  }
  async validatePreCreateItem(item) {
    await this.validateHasWritePrivilege();
    await this.validateTrustedAppData(item);
    await this.validateCanCreateByPolicyArtifacts(item);
    await this.validateByPolicyItem(item);
    return item;
  }
  async validatePreDeleteItem() {
    await this.validateHasWritePrivilege();
  }
  async validatePreGetOneItem() {
    await this.validateHasReadPrivilege();
  }
  async validatePreMultiListFind() {
    await this.validateHasReadPrivilege();
  }
  async validatePreExport() {
    await this.validateHasReadPrivilege();
  }
  async validatePreSingleListFind() {
    await this.validateHasReadPrivilege();
  }
  async validatePreGetListSummary() {
    await this.validateHasReadPrivilege();
  }
  async validatePreUpdateItem(_updatedItem, currentItem) {
    const updatedItem = _updatedItem;
    await this.validateHasWritePrivilege();
    await this.validateTrustedAppData(updatedItem);
    try {
      await this.validateCanCreateByPolicyArtifacts(updatedItem);
    } catch (noByPolicyAuthzError) {
      // Not allowed to create/update by policy data. Validate that the effective scope of the item
      // remained unchanged with this update or was set to `global` (only allowed update). If not,
      // then throw the validation error that was catch'ed
      if (this.wasByPolicyEffectScopeChanged(updatedItem, currentItem)) {
        throw noByPolicyAuthzError;
      }
    }
    await this.validateByPolicyItem(updatedItem);
    return _updatedItem;
  }
  async validateTrustedAppData(item) {
    await this.validateBasicData(item);
    try {
      TrustedAppDataSchema.validate(item, {
        os: item.osTypes[0]
      });
    } catch (error) {
      throw new _errors.EndpointArtifactExceptionValidationError(error.message);
    }
  }
}
exports.TrustedAppValidator = TrustedAppValidator;