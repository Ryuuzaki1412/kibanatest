"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTemplate = getTemplate;
var _i18n = require("@kbn/i18n");
var _path = _interopRequireDefault(require("path"));
var _get_doc_options = require("./get_doc_options");
var _get_font = require("./get_font");
var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getTemplate(layout, logo, title, tableBorderWidth, assetPath) {
  const getStyle = () => ({
    heading: {
      alignment: 'left',
      fontSize: _constants.headingFontSize,
      bold: true,
      margin: [_constants.headingMarginTop, 0, _constants.headingMarginBottom, 0]
    },
    subheading: {
      alignment: 'left',
      fontSize: _constants.subheadingFontSize,
      italics: true,
      margin: [0, 0, _constants.subheadingMarginBottom, 20]
    },
    warning: {
      color: '#f39c12' // same as @brand-warning in Kibana colors.less
    }
  });

  const getHeader = () => ({
    margin: [_constants.pageMarginWidth, _constants.pageMarginTop / 4, _constants.pageMarginWidth, 0],
    text: title,
    font: (0, _get_font.getFont)(title),
    style: {
      color: '#aaa'
    },
    fontSize: 10,
    alignment: 'center'
  });
  const getFooter = () => (currentPage, pageCount) => {
    const logoPath = _path.default.resolve(assetPath, 'img', 'logo-grey.png'); // Default Elastic Logo
    return {
      margin: [_constants.pageMarginWidth, _constants.pageMarginBottom / 4, _constants.pageMarginWidth, 0],
      layout: _get_doc_options.REPORTING_TABLE_LAYOUT,
      table: {
        widths: [100, '*', 100],
        body: [[{
          fit: [100, 35],
          image: logo || logoPath
        }, {
          alignment: 'center',
          text: _i18n.i18n.translate('xpack.screenshotting.exportTypes.printablePdf.pagingDescription', {
            defaultMessage: 'Page {currentPage} of {pageCount}',
            values: {
              currentPage: currentPage.toString(),
              pageCount
            }
          }),
          style: {
            color: '#aaa'
          }
        }, ''], [logo ? {
          text: _i18n.i18n.translate('xpack.screenshotting.exportTypes.printablePdf.logoDescription', {
            defaultMessage: 'Powered by Elastic'
          }),
          fontSize: 10,
          style: {
            color: '#aaa'
          },
          margin: [0, 2, 0, 0]
        } : '', '', '']]
      }
    };
  };
  return {
    // define page size
    pageOrientation: layout.orientation,
    pageSize: layout.pageSize,
    pageMargins: layout.useReportingBranding ? [_constants.pageMarginWidth, _constants.pageMarginTop, _constants.pageMarginWidth, _constants.pageMarginBottom] : [0, 0, 0, 0],
    header: layout.hasHeader ? getHeader() : undefined,
    footer: layout.hasFooter ? getFooter() : undefined,
    styles: layout.useReportingBranding ? getStyle() : undefined,
    defaultStyle: {
      fontSize: 12,
      font: 'Roboto'
    }
  };
}