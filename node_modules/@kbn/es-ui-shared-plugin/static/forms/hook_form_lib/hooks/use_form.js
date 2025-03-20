"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useForm = useForm;
var _react = require("react");
var _lodash = require("lodash");
var _saferLodashSet = require("@kbn/safer-lodash-set");
var _lib = require("../lib");
var _use_array = require("../components/use_array");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const DEFAULT_OPTIONS = {
  valueChangeDebounceTime: 500,
  stripEmptyFields: true
};
function useForm(formConfig) {
  const {
    onSubmit,
    schema,
    serializer,
    deserializer,
    options,
    id = 'default',
    defaultValue
  } = formConfig !== null && formConfig !== void 0 ? formConfig : {};

  // Strip out any "undefined" value and run the deserializer
  const initDefaultValue = (0, _react.useCallback)((_defaultValue, runDeserializer = true) => {
    if (_defaultValue === undefined || Object.keys(_defaultValue).length === 0) {
      return undefined;
    }
    const filtered = (0, _lib.stripOutUndefinedValues)(_defaultValue);
    return runDeserializer && deserializer ? (0, _lib.stripOutUndefinedValues)(deserializer(filtered)) : filtered;
  }, [deserializer]);

  // We create this stable reference to be able to initialize our "defaultValueDeserialized" ref below
  // as we can't initialize useRef by calling a function (e.g. useRef(initDefaultValue()))
  const defaultValueInitialized = (0, _react.useMemo)(() => {
    return initDefaultValue(defaultValue);
  }, [defaultValue, initDefaultValue]);
  const {
    valueChangeDebounceTime,
    stripEmptyFields: doStripEmptyFields
  } = options !== null && options !== void 0 ? options : {};
  const formOptions = (0, _react.useMemo)(() => ({
    stripEmptyFields: doStripEmptyFields !== null && doStripEmptyFields !== void 0 ? doStripEmptyFields : DEFAULT_OPTIONS.stripEmptyFields,
    valueChangeDebounceTime: valueChangeDebounceTime !== null && valueChangeDebounceTime !== void 0 ? valueChangeDebounceTime : DEFAULT_OPTIONS.valueChangeDebounceTime
  }), [valueChangeDebounceTime, doStripEmptyFields]);
  const [isSubmitted, setIsSubmitted] = (0, _react.useState)(false);
  const [isSubmitting, setSubmitting] = (0, _react.useState)(false);
  const [isValid, setIsValid] = (0, _react.useState)(undefined);
  const [errorMessages, setErrorMessages] = (0, _react.useState)({});

  /**
   * Map of all the fields currently in the form
   */
  const fieldsRefs = (0, _react.useRef)({});
  /**
   * Keep a track of the fields that have been removed from the form.
   * This will allow us to know if the form has been modified
   * (this ref is then accessed in the "useFormIsModified()" hook)
   */
  const fieldsRemovedRefs = (0, _react.useRef)({});
  /**
   * A list of all subscribers to form data and validity changes that
   * called "form.subscribe()"
   */
  const formUpdateSubscribers = (0, _react.useRef)([]);
  const isMounted = (0, _react.useRef)(false);
  /**
   * Keep a reference to the form defaultValue once it has been deserialized.
   * This allows us to reset the form and put back the initial value of each fields
   */
  const defaultValueDeserialized = (0, _react.useRef)(defaultValueInitialized);

  /**
   * We have both a state and a ref for the error messages so the consumer can, in the same callback,
   * validate the form **and** have the errors returned immediately.
   * Note: As an alternative we could return the errors when calling the "validate()" method but that creates
   * a breaking change in the API which would require to update many forms.
   *
   * ```
   * const myHandler = useCallback(async () => {
   *   const isFormValid = await validate();
   *   const errors = getErrors(); // errors from the validate() call are there
   * }, [validate, getErrors]);
   * ```
   */
  const errorMessagesRef = (0, _react.useRef)({});

  /**
   * formData$ is an observable that gets updated every time a field value changes.
   * It is the "useFormData()" hook that subscribes to this observable and updates
   * its internal "formData" state that in turn triggers the necessary re-renders in the consumer component.
   */
  const formData$ = (0, _react.useRef)(null);

  // ----------------------------------
  // -- HELPERS
  // ----------------------------------
  /**
   * We can't initialize a React ref by calling a function (in this case
   * useRef(new Subject())) the function is called on every render and would
   * create a new "Subject" instance.
   * We use this handler to access the ref and initialize it on first access.
   */
  const getFormData$ = (0, _react.useCallback)(() => {
    if (formData$.current === null) {
      formData$.current = new _lib.Subject({});
    }
    return formData$.current;
  }, []);
  const updateFormData$ = (0, _react.useCallback)(nextValue => {
    getFormData$().next(nextValue);
  }, [getFormData$]);
  const updateFieldErrorMessage = (0, _react.useCallback)((path, errorMessage) => {
    setErrorMessages(prev => {
      const previousMessageValue = prev[path];
      if (errorMessage === previousMessageValue || previousMessageValue === undefined && errorMessage === null) {
        // Don't update the state, the error message has not changed.
        return prev;
      }
      if (errorMessage === null) {
        // The field at this path is now valid, we strip out any previous error message
        const {
          [path]: discard,
          ...next
        } = prev;
        errorMessagesRef.current = next;
        return next;
      }
      const next = {
        ...prev,
        [path]: errorMessage
      };
      errorMessagesRef.current = next;
      return next;
    });
  }, []);
  const fieldsToArray = (0, _react.useCallback)(() => Object.values(fieldsRefs.current), []);
  const getFieldsForOutput = (0, _react.useCallback)((fields, opts) => {
    return Object.entries(fields).reduce((acc, [key, field]) => {
      if (!field.__isIncludedInOutput) {
        return acc;
      }
      if (opts.stripEmptyFields) {
        const isFieldEmpty = typeof field.value === 'string' && field.value.trim() === '';
        if (isFieldEmpty) {
          return acc;
        }
      }
      acc[key] = field;
      return acc;
    }, {});
  }, []);
  const updateFormDataAt = (0, _react.useCallback)((path, value) => {
    const currentFormData = getFormData$().value;
    if (currentFormData[path] !== value) {
      updateFormData$({
        ...currentFormData,
        [path]: value
      });
    }
  }, [getFormData$, updateFormData$]);
  const updateDefaultValueAt = (0, _react.useCallback)((path, value) => {
    if (defaultValueDeserialized.current === undefined) {
      defaultValueDeserialized.current = {};
    }

    // We allow "undefined" to be passed to be able to remove a value from the form `defaultValue` object.
    // When <UseField path="foo" defaultValue="bar" /> mounts it calls `updateDefaultValueAt("foo", "bar")` to
    // update the form "defaultValue" object. When that component unmounts we want to be able to clean up and
    // remove its defaultValue on the form.
    if (value === undefined) {
      const updated = (0, _lib.flattenObject)(defaultValueDeserialized.current);
      delete updated[path];
      defaultValueDeserialized.current = (0, _lib.unflattenObject)(updated);
    } else {
      (0, _saferLodashSet.set)(defaultValueDeserialized.current, path, value);
    }
  }, []);
  const isFieldValid = field => field.isValid && !field.isValidating;
  const waitForFieldsToFinishValidating = (0, _react.useCallback)(async () => {
    let areSomeFieldValidating = fieldsToArray().some(field => field.isValidating);
    return new Promise(resolve => {
      if (areSomeFieldValidating) {
        setTimeout(() => {
          areSomeFieldValidating = fieldsToArray().some(field => field.isValidating);
          if (areSomeFieldValidating) {
            // Recursively wait for all the fields to finish validating.
            return waitForFieldsToFinishValidating().then(resolve);
          }
          resolve();
        }, 100);
      } else {
        /*
         * We need to use "setTimeout()" to ensure that the "validate()" method
         * returns a Promise that is resolved on the next tick. This is important
         * because the "validate()" method is often called in a "useEffect()" hook
         * and we want the "useEffect()" to be triggered on the next tick. If we
         * don't use "setTimeout()" the "useEffect()" would be triggered on the same
         * tick and would not have access to the latest form state.
         * This is also why we don't use "Promise.resolve()" here. It would resolve
         * the Promise on the same tick.
         */
        setTimeout(resolve, 0);
      }
    });
  }, [fieldsToArray]);

  // ----------------------------------
  // -- Internal API
  // ----------------------------------
  const addField = (0, _react.useCallback)(field => {
    const fieldPreviouslyAdded = fieldsRefs.current[field.path] !== undefined;
    fieldsRefs.current[field.path] = field;
    delete fieldsRemovedRefs.current[field.path];
    updateFormDataAt(field.path, field.value);
    updateFieldErrorMessage(field.path, field.getErrorsMessages());
    if (!fieldPreviouslyAdded && !field.isValidated) {
      setIsValid(undefined);

      // When we submit() the form we set the "isSubmitted" state to "true" and all fields are marked as "isValidated: true".
      // If a **new** field is added and and its "isValidated" is "false" it means that we have swapped fields and added new ones:
      // --> we have a new form in front of us with different set of fields. We need to reset the "isSubmitted" state.
      // (e.g. In the mappings editor when the user switches the field "type" it brings a whole new set of settings)
      setIsSubmitted(false);
    }
  }, [updateFormDataAt, updateFieldErrorMessage]);
  const removeField = (0, _react.useCallback)(_fieldNames => {
    const fieldNames = Array.isArray(_fieldNames) ? _fieldNames : [_fieldNames];
    const updatedFormData = {
      ...getFormData$().value
    };
    fieldNames.forEach(name => {
      fieldsRemovedRefs.current[name] = fieldsRefs.current[name];
      updateFieldErrorMessage(name, null);
      delete fieldsRefs.current[name];
      delete updatedFormData[name];
    });
    updateFormData$(updatedFormData);

    /**
     * After removing a field, the form validity might have changed
     * (an invalid field might have been removed and now the form is valid)
     */
    setIsValid(prev => {
      if (prev === false) {
        const isFormValid = fieldsToArray().every(isFieldValid);
        return isFormValid;
      }
      // If the form validity is "true" or "undefined", it remains the same after removing a field
      return prev;
    });
  }, [getFormData$, updateFormData$, fieldsToArray, updateFieldErrorMessage]);
  const getFormDefaultValue = (0, _react.useCallback)(() => defaultValueDeserialized.current, []);
  const readFieldConfigFromSchema = (0, _react.useCallback)(fieldName => {
    const config = (0, _lodash.get)(schema !== null && schema !== void 0 ? schema : {}, fieldName);
    return config;
  }, [schema]);
  const getFieldsRemoved = (0, _react.useCallback)(() => fieldsRemovedRefs.current, []);

  // ----------------------------------
  // -- Public API
  // ----------------------------------
  const validateFields = (0, _react.useCallback)(async (fieldNames, onlyBlocking = false) => {
    const fieldsToValidate = fieldNames.map(name => fieldsRefs.current[name]).filter(field => field !== undefined);
    const formData = getFormData$().value;
    const validationResult = await Promise.all(fieldsToValidate.map(field => field.validate({
      formData,
      onlyBlocking
    })));
    if (isMounted.current === false) {
      // If the form has unmounted while validating, the result is not pertinent
      // anymore. Let's satisfy TS and exit.
      return {
        areFieldsValid: true,
        isFormValid: true
      };
    }
    const areFieldsValid = validationResult.every(res => res.isValid);
    const validationResultByPath = fieldsToValidate.reduce((acc, field, i) => {
      acc[field.path] = validationResult[i].isValid;
      return acc;
    }, {});

    // At this stage we have an updated field validation state inside the "validationResultByPath" object.
    // The fields object in "fieldsRefs.current" have not been updated yet with their new validation state
    // (isValid, isValidated...) as this occurs later, when the "useEffect" kicks in and calls "addField()" on the form.
    // This means that we have **stale state value** in our fieldsRefs map.
    // To know the current form validity, we will then merge the "validationResult" with the fieldsRefs object state.
    const formFieldsValidity = fieldsToArray().map(field => {
      var _validationResultByPa;
      const hasUpdatedValidity = validationResultByPath[field.path] !== undefined;
      return {
        isValid: (_validationResultByPa = validationResultByPath[field.path]) !== null && _validationResultByPa !== void 0 ? _validationResultByPa : field.isValid,
        isValidated: hasUpdatedValidity ? true : field.isValidated,
        isValidating: hasUpdatedValidity ? false : field.isValidating
      };
    });
    const areAllFieldsValidated = formFieldsValidity.every(field => field.isValidated);
    const areSomeFieldValidating = formFieldsValidity.some(field => field.isValidating);

    // If *not* all the fields have been validated, the validity of the form is unknown, thus still "undefined"
    const isFormValid = areAllFieldsValidated && areSomeFieldValidating === false ? formFieldsValidity.every(field => field.isValid) : undefined;
    setIsValid(isFormValid);
    return {
      areFieldsValid,
      isFormValid
    };
  }, [getFormData$, fieldsToArray]);
  const getFormData = (0, _react.useCallback)(() => {
    const fieldsToOutput = getFieldsForOutput(fieldsRefs.current, {
      stripEmptyFields: formOptions.stripEmptyFields
    });
    const fieldsValue = (0, _lib.mapFormFields)(fieldsToOutput, field => field.__serializeValue());
    return serializer ? serializer((0, _lib.unflattenObject)(fieldsValue)) : (0, _lib.unflattenObject)(fieldsValue);
  }, [getFieldsForOutput, formOptions.stripEmptyFields, serializer]);
  const getErrors = (0, _react.useCallback)(() => {
    if (isValid === true) {
      return [];
    }
    return Object.values({
      ...errorMessages,
      ...errorMessagesRef.current
    });
  }, [isValid, errorMessages]);
  const validate = (0, _react.useCallback)(async () => {
    // Maybe some field are being validated because of their async validation(s).
    // We make sure those validations have finished executing before proceeding.
    await waitForFieldsToFinishValidating();
    if (!isMounted.current) {
      return false;
    }
    const fieldsArray = fieldsToArray();
    // We only need to validate the fields that haven't been validated yet. Those
    // are pristine fields (dirty fields are always validated when their value changed)
    const fieldsToValidate = fieldsArray.filter(field => !field.isValidated);
    let isFormValid;
    if (fieldsToValidate.length === 0) {
      isFormValid = fieldsArray.every(isFieldValid);
    } else {
      const fieldPathsToValidate = fieldsToValidate.map(field => field.path);
      const validateOnlyBlockingValidation = true;
      ({
        isFormValid
      } = await validateFields(fieldPathsToValidate, validateOnlyBlockingValidation));
    }
    setIsValid(isFormValid);
    return isFormValid;
  }, [fieldsToArray, validateFields, waitForFieldsToFinishValidating]);
  const setFieldValue = (0, _react.useCallback)((fieldName, value) => {
    if (fieldsRefs.current[fieldName]) {
      fieldsRefs.current[fieldName].setValue(value);
    }
  }, []);
  const setFieldErrors = (0, _react.useCallback)((fieldName, errors) => {
    if (fieldsRefs.current[fieldName]) {
      fieldsRefs.current[fieldName].setErrors(errors);
    }
  }, []);
  const getFields = (0, _react.useCallback)(() => fieldsRefs.current, []);
  const getFieldDefaultValue = (0, _react.useCallback)(fieldName => {
    var _defaultValueDeserial;
    return (0, _lodash.get)((_defaultValueDeserial = defaultValueDeserialized.current) !== null && _defaultValueDeserial !== void 0 ? _defaultValueDeserial : {}, fieldName);
  }, []);
  const updateFieldValues = (0, _react.useCallback)((updatedFormData, {
    runDeserializer = true
  } = {}) => {
    if (!updatedFormData || typeof updatedFormData !== 'object' || Object.keys(updatedFormData).length === 0) {
      return;
    }
    const updatedFormDataInitialized = initDefaultValue(updatedFormData, runDeserializer);
    const mergedDefaultValue = (0, _lodash.mergeWith)({}, defaultValueDeserialized.current, updatedFormDataInitialized, (_, srcValue) => {
      if (Array.isArray(srcValue)) {
        // Arrays are returned as provided, we don't want to merge
        // previous array values with the new ones.
        return srcValue;
      }
    });
    defaultValueDeserialized.current = (0, _lib.stripOutUndefinedValues)(mergedDefaultValue);
    const doUpdateValues = (obj, currentObjPath = []) => {
      Object.entries(obj).forEach(([key, value]) => {
        const fullPath = [...currentObjPath, key].join('.');
        const internalArrayfieldPath = (0, _use_array.getInternalArrayFieldPath)(fullPath);

        // Check if there is an **internal array** (created by <UseArray />) defined at this key.
        // If there is one, we update that field value and don't go any further as from there it will
        // be the individual fields (children) declared inside the UseArray that will read the "defaultValue"
        // object of the form (which we've updated above).
        if (Array.isArray(value) && fieldsRefs.current[internalArrayfieldPath]) {
          const field = fieldsRefs.current[internalArrayfieldPath];
          const fieldValue = value.map((_, index) => (0, _use_array.createArrayItem)(fullPath, index, false));
          field.setValue(fieldValue);
          return;
        }
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // We make sure that at least _some_ leaf fields are present in the fieldsRefs object
          // If not, we should not consider this as a multi fields but single field (e.g. a select field whose value is { label: 'Foo', value: 'foo' })
          const hasSomeLeafField = Object.keys(value).some(leaf => fieldsRefs.current[`${fullPath}.${leaf}`] !== undefined);
          if (hasSomeLeafField) {
            // Recursively update internal objects
            doUpdateValues(value, [...currentObjPath, key]);
            return;
          }
        }
        const field = fieldsRefs.current[fullPath];
        if (!field) {
          return;
        }
        field.setValue(value);
      });
    };
    doUpdateValues(updatedFormDataInitialized);
  }, [initDefaultValue]);
  const submit = (0, _react.useCallback)(async e => {
    if (e) {
      e.preventDefault();
    }
    setIsSubmitted(true); // User has attempted to submit the form at least once
    setSubmitting(true);
    const isFormValid = await validate();
    const formData = isFormValid ? getFormData() : {};
    if (onSubmit) {
      await onSubmit(formData, isFormValid);
    }
    if (isMounted.current) {
      setSubmitting(false);
    }
    return {
      data: formData,
      isValid: isFormValid
    };
  }, [validate, getFormData, onSubmit]);
  const subscribe = (0, _react.useCallback)(handler => {
    const subscription = getFormData$().subscribe(raw => {
      handler({
        isValid,
        data: {
          internal: (0, _lib.unflattenObject)(raw),
          format: getFormData
        },
        validate
      });
    });
    formUpdateSubscribers.current.push(subscription);
    return {
      unsubscribe() {
        formUpdateSubscribers.current = formUpdateSubscribers.current.filter(sub => sub !== subscription);
        return subscription.unsubscribe();
      }
    };
  }, [getFormData$, isValid, getFormData, validate]);
  const reset = (0, _react.useCallback)((resetOptions = {
    resetValues: true
  }) => {
    const {
      resetValues = true,
      defaultValue: updatedDefaultValue
    } = resetOptions;
    const currentFormData = {
      ...getFormData$().value
    };
    if (updatedDefaultValue) {
      defaultValueDeserialized.current = initDefaultValue(updatedDefaultValue);
    }
    Object.entries(fieldsRefs.current).forEach(([path, field]) => {
      // By resetting the form and changing field values, some fields might be unmounted
      // (e.g. a toggle might be set back to "false" and some fields removed from the UI as a consequence).
      // We make sure that the field still exists before resetting it.
      const isFieldMounted = fieldsRefs.current[path] !== undefined;
      if (isFieldMounted) {
        const fieldDefaultValue = getFieldDefaultValue(path);
        field.reset({
          resetValue: resetValues,
          defaultValue: fieldDefaultValue
        });
        currentFormData[path] = fieldDefaultValue;
      }
    });
    if (resetValues) {
      updateFormData$(currentFormData);
    }
    setIsSubmitted(false);
    setSubmitting(false);
    setIsValid(undefined);
  }, [getFormData$, updateFormData$, initDefaultValue, getFieldDefaultValue]);
  const form = (0, _react.useMemo)(() => {
    return {
      isSubmitted,
      isSubmitting,
      isValid,
      id,
      submit,
      validate,
      subscribe,
      setFieldValue,
      setFieldErrors,
      getFields,
      getFieldDefaultValue,
      getFormData,
      getErrors,
      updateFieldValues,
      reset,
      validateFields,
      __options: formOptions,
      __getFormData$: getFormData$,
      __updateFormDataAt: updateFormDataAt,
      __updateDefaultValueAt: updateDefaultValueAt,
      __readFieldConfigFromSchema: readFieldConfigFromSchema,
      __getFormDefaultValue: getFormDefaultValue,
      __addField: addField,
      __removeField: removeField,
      __getFieldsRemoved: getFieldsRemoved
    };
  }, [isSubmitted, isSubmitting, isValid, id, submit, subscribe, setFieldValue, setFieldErrors, getFields, getFieldsRemoved, getFormData, getErrors, getFormDefaultValue, getFieldDefaultValue, updateFieldValues, reset, formOptions, getFormData$, updateFormDataAt, updateDefaultValueAt, readFieldConfigFromSchema, addField, removeField, validateFields, validate]);

  // ----------------------------------
  // -- EFFECTS
  // ----------------------------------
  (0, _react.useEffect)(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      formUpdateSubscribers.current.forEach(subscription => subscription.unsubscribe());
      formUpdateSubscribers.current = [];
    };
  }, []);
  return {
    form
  };
}