"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInternalArrayFieldPath = exports.createArrayItem = exports.UseArray = void 0;
var _react = require("react");
var _helpers = require("../helpers");
var _form_context = require("../form_context");
var _hooks = require("../hooks");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

let uniqueId = 0;
const createArrayItem = (path, index, isNew = true) => ({
  id: uniqueId++,
  path: `${path}[${index}]`,
  isNew
});

/**
 * We create an internal field to represent the Array items. This field is not returned
 * as part as the form data but is used internally to run validation on the array items.
 * It is this internal field value (ArrayItem[]) that we then map to actual form fields
 * (in the children func <UseArray>{({ items }) => (...)}</UseArray>)
 *
 * @param path The array path in the form data
 * @returns The internal array field path
 */
exports.createArrayItem = createArrayItem;
const getInternalArrayFieldPath = path => `${path}__array__`;

/**
 * Use UseArray to dynamically add fields to your form.
 *
 * example:
 * If your form data looks like this:
 *
 * {
 *   users: []
 * }
 *
 * and you want to be able to add user objects (e.g. { name: 'john', lastName. 'snow' }) inside
 * the "users" array, you would use UseArray to render rows of user objects with 2 fields in each of them ("name" and "lastName")
 *
 * Look at the README.md for some examples.
 */
exports.getInternalArrayFieldPath = getInternalArrayFieldPath;
const UseArray = ({
  path,
  initialNumberOfItems = 1,
  validations,
  readDefaultValueOnForm = true,
  children
}) => {
  const isMounted = (0, _react.useRef)(false);
  const form = (0, _form_context.useFormContext)();
  const {
    getFieldDefaultValue
  } = form;
  const fieldDefaultValue = (0, _react.useMemo)(() => {
    const defaultValues = readDefaultValueOnForm ? getFieldDefaultValue(path) : undefined;
    if (defaultValues) {
      return defaultValues.map((_, index) => createArrayItem(path, index, false));
    }
    return new Array(initialNumberOfItems).fill('').map((_, i) => createArrayItem(path, i));
  }, [path, initialNumberOfItems, readDefaultValueOnForm, getFieldDefaultValue]);

  // Create an internal hook field which behaves like any other form field except that it is not
  // outputed in the form data (when calling form.submit() or form.getFormData())
  // This allow us to run custom validations (passed to the props) on the Array items
  const internalFieldPath = (0, _react.useMemo)(() => getInternalArrayFieldPath(path), [path]);
  const fieldConfigBase = {
    defaultValue: fieldDefaultValue,
    initialValue: fieldDefaultValue,
    valueChangeDebounceTime: 0,
    isIncludedInOutput: false // indicate to not include this field when returning the form data
  };

  const fieldConfig = validations ? {
    validations,
    ...fieldConfigBase
  } : fieldConfigBase;
  const field = (0, _hooks.useField)(form, internalFieldPath, fieldConfig);
  const {
    setValue,
    value,
    isChangingValue,
    errors
  } = field;

  // Derived state from the field
  const error = (0, _react.useMemo)(() => {
    const {
      errorMessage
    } = (0, _helpers.getFieldValidityAndErrorMessage)({
      isChangingValue,
      errors
    });
    return errorMessage;
  }, [isChangingValue, errors]);
  const updatePaths = (0, _react.useCallback)(_rows => {
    return _rows.map((row, index) => ({
      ...row,
      path: `${path}[${index}]`
    }));
  }, [path]);
  const addItem = (0, _react.useCallback)(() => {
    setValue(previousItems => {
      const itemIndex = previousItems.length;
      return [...previousItems, createArrayItem(path, itemIndex)];
    });
  }, [setValue, path]);
  const removeItem = (0, _react.useCallback)(id => {
    setValue(previousItems => {
      const updatedItems = previousItems.filter(item => item.id !== id);
      return updatePaths(updatedItems);
    });
  }, [setValue, updatePaths]);
  const moveItem = (0, _react.useCallback)((sourceIdx, destinationIdx) => {
    setValue(previousItems => {
      const nextItems = [...previousItems];
      const removed = nextItems.splice(sourceIdx, 1)[0];
      nextItems.splice(destinationIdx, 0, removed);
      return updatePaths(nextItems);
    });
  }, [setValue, updatePaths]);
  (0, _react.useEffect)(() => {
    if (!isMounted.current) {
      return;
    }
    setValue(prev => {
      return updatePaths(prev);
    });
  }, [path, updatePaths, setValue]);
  (0, _react.useEffect)(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return children({
    items: value,
    error,
    form,
    addItem,
    removeItem,
    moveItem
  });
};
exports.UseArray = UseArray;