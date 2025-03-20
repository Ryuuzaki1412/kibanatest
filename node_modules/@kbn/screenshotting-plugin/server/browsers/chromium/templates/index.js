"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFooterTemplate = getFooterTemplate;
exports.getHeaderTemplate = getHeaderTemplate;
var _i18n = require("@kbn/i18n");
var _promises = _interopRequireDefault(require("fs/promises"));
var _path = _interopRequireDefault(require("path"));
var _handlebars = _interopRequireDefault(require("handlebars"));
var _constants = require("../../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function compileTemplate(pathToTemplate) {
  const contentsBuffer = await _promises.default.readFile(pathToTemplate);
  return _handlebars.default.compile(contentsBuffer.toString());
}
async function getHeaderTemplate({
  title
}) {
  const template = await compileTemplate(_path.default.resolve(__dirname, './header.handlebars.html'));
  return template({
    title
  });
}
async function getDefaultFooterLogo() {
  const logoBuffer = await _promises.default.readFile(_path.default.resolve(_constants.assetPath, 'img', 'logo-grey.png'));
  return `data:image/png;base64,${logoBuffer.toString('base64')}`;
}
async function getFooterTemplate({
  logo
}) {
  const template = await compileTemplate(_path.default.resolve(__dirname, './footer.handlebars.html'));
  const hasCustomLogo = Boolean(logo);
  return template({
    base64FooterLogo: hasCustomLogo ? logo : await getDefaultFooterLogo(),
    hasCustomLogo,
    poweredByElasticCopy: _i18n.i18n.translate('xpack.screenshotting.exportTypes.printablePdf.footer.logoDescription', {
      defaultMessage: 'Powered by Elastic'
    })
  });
}