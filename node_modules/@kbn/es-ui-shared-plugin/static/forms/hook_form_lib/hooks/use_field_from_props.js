"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useFieldFromProps = void 0;
var _react = require("react");
var _form_context = require("../form_context");
var _use_field = require("./use_field");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Hook to initialize a FieldHook based on Props passed to <UseField /> or <UseMultiFields />
 *
 * @param props The props passed to <UseField /> or <UseMultiFields />
 * @returns The field hook and props to forward to component to render for the field
 */

const useFieldFromProps = props => {
  const form = (0, _form_context.useFormContext)();
  const {
    getFieldDefaultValue,
    __readFieldConfigFromSchema,
    __updateDefaultValueAt
  } = form;
  const {
    path,
    config = __readFieldConfigFromSchema(props.path),
    defaultValue,
    component,
    componentProps,
    readDefaultValueOnForm = true,
    onChange,
    onError,
    children,
    validationData,
    validationDataProvider,
    ...rest
  } = props;
  const initialValue = (0, _react.useMemo)(() => {
    // The initial value of the field.
    // Order in which we'll determine this value:
    // 1. The "defaultValue" passed through prop
    //    --> <UseField path="foo" defaultValue="bar" />
    // 2. A value declared in the "defaultValue" object passed to the form when initiating
    //    --> const { form } = useForm({ defaultValue: { foo: 'bar' } }))
    // 3. The "defaultValue" declared on the field "config". Either passed through prop or on the form schema
    //    a. --> <UseField path="foo" config={{ defaultValue: 'bar' }} />
    //    b. --> const formSchema = { foo: { defaultValue: 'bar' } }
    // 4. An empty string ("")

    if (defaultValue !== undefined) {
      return defaultValue; // defaultValue passed through props
    }

    let value;
    if (readDefaultValueOnForm) {
      // Check the "defaultValue" object passed to the form
      value = getFieldDefaultValue(path);
    }
    if (value === undefined) {
      // Check the field "config" object (passed through prop or declared on the form schema)
      value = config === null || config === void 0 ? void 0 : config.defaultValue;
    }

    // If still undefined return an empty string
    return value === undefined ? '' : value;
  }, [defaultValue, path, config, readDefaultValueOnForm, getFieldDefaultValue]);
  const fieldConfig = (0, _react.useMemo)(() => ({
    ...config,
    initialValue
  }), [config, initialValue]);
  const fieldValidationData = (0, _react.useMemo)(() => ({
    validationData,
    validationDataProvider
  }), [validationData, validationDataProvider]);
  const field = (0, _use_field.useField)(form, path, fieldConfig, onChange, onError, fieldValidationData);
  (0, _react.useEffect)(() => {
    let needsCleanUp = false;
    if (defaultValue !== undefined) {
      needsCleanUp = true;
      // Update the form "defaultValue" ref object.
      // This allows us to reset the form and put back the defaultValue of each field
      __updateDefaultValueAt(path, defaultValue);
    }
    return () => {
      if (needsCleanUp) {
        __updateDefaultValueAt(path, undefined);
      }
    };
  }, [path, defaultValue, __updateDefaultValueAt]);
  const propsToForward = {
    ...componentProps,
    ...rest
  };
  return {
    field,
    propsToForward
  };
};
exports.useFieldFromProps = useFieldFromProps;