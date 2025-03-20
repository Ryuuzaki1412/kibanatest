"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MustacheInEmailRegExp = void 0;
exports.hasMustacheTemplate = hasMustacheTemplate;
exports.withoutMustacheTemplate = withoutMustacheTemplate;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MustacheInEmailRegExp = /\{\{((.|\n)*)\}\}/;

/** does the string contain `{{.*}}`? */
exports.MustacheInEmailRegExp = MustacheInEmailRegExp;
function hasMustacheTemplate(string) {
  return !!string.match(MustacheInEmailRegExp);
}

/** filter strings that do not contain `{{.*}}` */
function withoutMustacheTemplate(strings) {
  return strings.filter(string => !hasMustacheTemplate(string));
}