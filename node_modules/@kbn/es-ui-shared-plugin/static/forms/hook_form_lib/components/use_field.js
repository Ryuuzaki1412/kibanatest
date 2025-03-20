"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UseField = void 0;
exports.getUseField = getUseField;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireDefault(require("react"));
var _hooks = require("../hooks");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function UseFieldComp(props) {
  var _props$component;
  const {
    field,
    propsToForward
  } = (0, _hooks.useFieldFromProps)(props);
  const ComponentToRender = (_props$component = props.component) !== null && _props$component !== void 0 ? _props$component : 'input';

  // Children prevails over anything else provided.
  if (props.children) {
    return props.children(field);
  }
  if (ComponentToRender === 'input') {
    return /*#__PURE__*/_react.default.createElement(ComponentToRender, (0, _extends2.default)({
      type: field.type,
      onChange: field.onChange,
      value: field.value
    }, propsToForward));
  }
  return /*#__PURE__*/_react.default.createElement(ComponentToRender, (0, _extends2.default)({
    field
  }, propsToForward));
}
const UseField = /*#__PURE__*/_react.default.memo(UseFieldComp);

/**
 * Get a <UseField /> component providing some common props for all instances.
 * @param partialProps Partial props to apply to all <UseField /> instances
 *
 * @example
 *
 * // All the "MyUseField" are TextFields
 * const MyUseField = getUseField({ component: TextField });
 *
 * // JSX
 * <Form>
 *   <MyUseField path="textField_0" />
 *   <MyUseField path="textField_1" />
 *   <MyUseField path="textField_2" />
 * </Form>
 */
exports.UseField = UseField;
function getUseField(partialProps) {
  return function (props) {
    const componentProps = {
      ...partialProps,
      ...props
    };
    return /*#__PURE__*/_react.default.createElement(UseField, componentProps);
  };
}