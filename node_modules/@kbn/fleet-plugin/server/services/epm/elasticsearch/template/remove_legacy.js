"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeLegacyTemplates = exports._getLegacyComponentTemplatesForPackage = exports._getIndexTemplatesToUsedByMap = exports._filterComponentTemplatesInUse = void 0;
var _services = require("../../../../../common/services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const LEGACY_TEMPLATE_SUFFIXES = ['@mappings', '@settings'];
const getComponentTemplateWithSuffix = (dataStream, suffix) => {
  const baseName = (0, _services.getRegistryDataStreamAssetBaseName)(dataStream);
  return baseName + suffix;
};
const _getLegacyComponentTemplatesForPackage = (componentTemplates, installablePackage) => {
  var _installablePackage$d;
  const legacyNamesLookup = new Set();

  // fill a map with all possible @mappings and @settings component
  // template names for fast lookup below.
  (_installablePackage$d = installablePackage.data_streams) === null || _installablePackage$d === void 0 ? void 0 : _installablePackage$d.forEach(ds => {
    LEGACY_TEMPLATE_SUFFIXES.forEach(suffix => {
      legacyNamesLookup.add(getComponentTemplateWithSuffix(ds, suffix));
    });
  });
  return componentTemplates.reduce((legacyTemplates, componentTemplate) => {
    var _componentTemplate$co, _componentTemplate$co2;
    if (!legacyNamesLookup.has(componentTemplate.name)) return legacyTemplates;
    if (((_componentTemplate$co = componentTemplate.component_template._meta) === null || _componentTemplate$co === void 0 ? void 0 : (_componentTemplate$co2 = _componentTemplate$co.package) === null || _componentTemplate$co2 === void 0 ? void 0 : _componentTemplate$co2.name) !== installablePackage.name) {
      return legacyTemplates;
    }
    return legacyTemplates.concat(componentTemplate.name);
  }, []);
};
exports._getLegacyComponentTemplatesForPackage = _getLegacyComponentTemplatesForPackage;
const _deleteComponentTemplates = async params => {
  const {
    templateNames,
    esClient,
    logger
  } = params;
  const deleteResults = await Promise.allSettled(templateNames.map(name => esClient.cluster.deleteComponentTemplate({
    name
  })));
  const errors = deleteResults.filter(r => r.status === 'rejected');
  if (errors.length) {
    const prettyErrors = errors.map(e => `"${e.reason}"`).join(', ');
    logger.debug(`Encountered ${errors.length} errors deleting legacy component templates: ${prettyErrors}`);
  }
};
const _getIndexTemplatesToUsedByMap = indexTemplates => {
  const lookupMap = new Map();
  indexTemplates.forEach(({
    name: indexTemplateName,
    index_template: indexTemplate
  }) => {
    const composedOf = indexTemplate === null || indexTemplate === void 0 ? void 0 : indexTemplate.composed_of;
    if (!composedOf) return;
    composedOf.forEach(componentTemplateName => {
      const existingEntry = lookupMap.get(componentTemplateName) || [];
      lookupMap.set(componentTemplateName, existingEntry.concat(indexTemplateName));
    });
  });
  return lookupMap;
};
exports._getIndexTemplatesToUsedByMap = _getIndexTemplatesToUsedByMap;
const _getAllComponentTemplates = async esClient => {
  const {
    component_templates: componentTemplates
  } = await esClient.cluster.getComponentTemplate();
  return componentTemplates;
};
const _getAllIndexTemplatesWithComposedOf = async esClient => {
  const {
    index_templates: indexTemplates
  } = await esClient.indices.getIndexTemplate();
  return indexTemplates.filter(tmpl => {
    var _tmpl$index_template$;
    return (_tmpl$index_template$ = tmpl.index_template.composed_of) === null || _tmpl$index_template$ === void 0 ? void 0 : _tmpl$index_template$.length;
  });
};
const _filterComponentTemplatesInUse = ({
  componentTemplateNames,
  indexTemplates,
  logger
}) => {
  const usedByLookup = _getIndexTemplatesToUsedByMap(indexTemplates);
  return componentTemplateNames.filter(componentTemplateName => {
    const indexTemplatesUsingComponentTemplate = usedByLookup.get(componentTemplateName);
    if (indexTemplatesUsingComponentTemplate !== null && indexTemplatesUsingComponentTemplate !== void 0 && indexTemplatesUsingComponentTemplate.length) {
      const prettyTemplates = indexTemplatesUsingComponentTemplate.join(', ');
      logger.debug(`Not deleting legacy template ${componentTemplateName} as it is in use by index templates: ${prettyTemplates}`);
      return false;
    }
    return true;
  });
};
exports._filterComponentTemplatesInUse = _filterComponentTemplatesInUse;
const removeLegacyTemplates = async params => {
  const {
    packageInfo,
    esClient,
    logger
  } = params;
  const allComponentTemplates = await _getAllComponentTemplates(esClient);
  const legacyComponentTemplateNames = _getLegacyComponentTemplatesForPackage(allComponentTemplates, packageInfo);
  if (!legacyComponentTemplateNames.length) return;

  // all index templates that are composed of at least one component template
  const allIndexTemplatesWithComposedOf = await _getAllIndexTemplatesWithComposedOf(esClient);
  let templatesToDelete = legacyComponentTemplateNames;
  if (allIndexTemplatesWithComposedOf.length) {
    // get the component templates not in use by any index templates
    templatesToDelete = _filterComponentTemplatesInUse({
      componentTemplateNames: legacyComponentTemplateNames,
      indexTemplates: allIndexTemplatesWithComposedOf,
      logger
    });
  }
  if (!templatesToDelete.length) return;
  await _deleteComponentTemplates({
    templateNames: templatesToDelete,
    esClient,
    logger
  });
};
exports.removeLegacyTemplates = removeLegacyTemplates;