"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useFormData = void 0;
var _react = require("react");
var _lib = require("../lib");
var _form_data_context = require("../form_data_context");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const useFormData = (options = {}) => {
  const {
    watch,
    form,
    onChange
  } = options;
  const ctx = (0, _form_data_context.useFormDataContext)();
  const watchToArray = watch === undefined ? [] : Array.isArray(watch) ? watch : [watch];
  // We will use "stringifiedWatch" to compare if the array has changed in the useMemo() below
  const stringifiedWatch = watchToArray.join('.');
  let getFormData;
  let getFormData$;
  if (form !== undefined) {
    getFormData = form.getFormData;
    getFormData$ = form.__getFormData$;
  } else if (ctx !== undefined) {
    ({
      getFormData,
      getFormData$
    } = ctx);
  } else {
    throw new Error('useFormData() must be used within a <FormDataContextProvider /> or you need to pass FormHook object in the options.');
  }
  const initialValue = getFormData$().value;
  const previousRawData = (0, _react.useRef)(initialValue);
  const isMounted = (0, _react.useRef)(false);
  /**
   * The first time the subscribe listener is called with no form data (empty object)
   * this means that no field has mounted --> we don't want to update the state just yet.
   */
  const isFirstSubscribeListenerCall = (0, _react.useRef)(true);
  const [formData, setFormData] = (0, _react.useState)(() => (0, _lib.unflattenObject)(previousRawData.current));
  const formDataSerializer = (0, _react.useCallback)(() => {
    return getFormData();
    /**
     * The "form.getFormData()" handler (which serializes the form data) is a static ref that does not change
     * when the underlying form data changes. As we do want to return to the consumer a handler to serialize the form data
     * that **does** changes along with the form data we've added the "formData" state to the useCallback dependencies.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFormData, formData]);
  (0, _react.useEffect)(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  (0, _react.useEffect)(() => {
    const subscription = getFormData$().subscribe(raw => {
      if (isFirstSubscribeListenerCall.current && Object.keys(raw).length === 0) {
        // No field has mounted and been added to the form yet, skip this invocation.
        isFirstSubscribeListenerCall.current = false;
        return;
      }
      if (watchToArray.length > 0) {
        // Only update the state if one of the field we watch has changed.
        if (watchToArray.some(path => previousRawData.current[path] !== raw[path])) {
          previousRawData.current = raw;
          const nextState = (0, _lib.unflattenObject)(raw);
          if (onChange) {
            onChange(nextState);
          }
          if (isMounted.current) {
            setFormData(nextState);
          }
        }
      } else {
        const nextState = (0, _lib.unflattenObject)(raw);
        if (onChange) {
          onChange(nextState);
        }
        if (isMounted.current) {
          setFormData(nextState);
        }
      }
    });
    return subscription.unsubscribe;

    // To compare we use the stringified version of the "watchToArray" array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedWatch, getFormData$, onChange]);
  if (!isMounted.current && Object.keys(formData).length === 0) {
    // No field has mounted yet
    return [formData, formDataSerializer, false];
  }
  return [formData, formDataSerializer, true];
};
exports.useFormData = useFormData;