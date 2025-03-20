"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useField = void 0;
var _react = require("react");
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const errorsToString = errors => {
  return errors.length ? errors.map(error => error.message) : null;
};
const useField = (form, path, config, valueChangeListener, errorChangeListener, {
  validationData = null,
  validationDataProvider = () => Promise.resolve(undefined)
} = {}) => {
  const {
    type = _constants.FIELD_TYPES.TEXT,
    defaultValue = '',
    // The default value instead of "undefined" (when resetting the form this will be the field value)
    initialValue,
    // The initial value of the field when rendering the form
    isIncludedInOutput = true,
    label = '',
    labelAppend = '',
    helpText = '',
    validations,
    formatters,
    fieldsToValidateOnChange,
    valueChangeDebounceTime = form.__options.valueChangeDebounceTime,
    // By default 500ms
    serializer,
    deserializer
  } = config;
  const {
    getFormData,
    getFields,
    validateFields,
    __addField,
    __removeField,
    __getFormData$
  } = form;
  const deserializeValue = (0, _react.useCallback)(rawValue => {
    if (typeof rawValue === 'function') {
      return deserializer ? deserializer(rawValue()) : rawValue();
    }
    return deserializer ? deserializer(rawValue) : rawValue;
  }, [deserializer]);
  const initialValueDeserialized = (0, _react.useMemo)(() => {
    return deserializeValue(initialValue);
  }, [deserializeValue, initialValue]);
  const [value, setStateValue] = (0, _react.useState)(initialValueDeserialized);
  const [errors, setStateErrors] = (0, _react.useState)([]);
  const [isPristine, setPristine] = (0, _react.useState)(true);
  const [isModified, setIsModified] = (0, _react.useState)(false);
  const [isValidating, setValidating] = (0, _react.useState)(false);
  const [isChangingValue, setIsChangingValue] = (0, _react.useState)(false);
  const [isValidated, setIsValidated] = (0, _react.useState)(false);
  const isMounted = (0, _react.useRef)(false);
  const validateCounter = (0, _react.useRef)(0);
  const changeCounter = (0, _react.useRef)(0);
  const inflightValidation = (0, _react.useRef)(null);
  const debounceTimeout = (0, _react.useRef)(null);
  // Keep a ref of the last state (value and errors) notified to the consumer so they don't get
  // loads of updates whenever they don't wrap the "onChange()" and "onError()" handlers with a useCallback
  // e.g. <UseField onChange={() => { // inline code }}
  const lastNotifiedState = (0, _react.useRef)({
    value: initialValueDeserialized,
    errors: null
  });
  const hasAsyncValidation = (0, _react.useMemo)(() => validations === undefined ? false : validations.some(validation => validation.isAsync === true), [validations]);
  const valueHasChanged = value !== lastNotifiedState.current.value;
  const errorsHaveChanged = lastNotifiedState.current.errors !== errorsToString(errors);

  // ----------------------------------
  // -- HELPERS
  // ----------------------------------
  /**
   * Filter an array of errors for a specific validation type
   *
   * @param _errors The array of errors to filter
   * @param validationType The validation type to filter out
   */
  const filterErrors = (_errors, validationTypeToFilterOut = _constants.VALIDATION_TYPES.FIELD) => {
    const validationTypeToArray = Array.isArray(validationTypeToFilterOut) ? validationTypeToFilterOut : [validationTypeToFilterOut];
    return _errors.filter(error => validationTypeToArray.every(_type => error.validationType !== _type));
  };

  /**
   * If the field has some "formatters" defined in its config, run them in series and return
   * the transformed value. This handler is called whenever the field value changes, right before
   * updating the "value" state.
   */
  const formatInputValue = (0, _react.useCallback)(inputValue => {
    const isEmptyString = typeof inputValue === 'string' && inputValue.trim() === '';
    if (isEmptyString || !formatters) {
      return inputValue;
    }
    const formData = __getFormData$().value;
    return formatters.reduce((output, formatter) => formatter(output, formData), inputValue);
  }, [formatters, __getFormData$]);
  const runValidationsOnValueChange = (0, _react.useCallback)(async done => {
    const changeIteration = ++changeCounter.current;
    const startTime = Date.now();

    // We call "validateFields" on the form which in turn will call
    // our "validate()" function here below.
    // The form is the coordinator and has access to all of the fields. We can
    // this way validate multiple field whenever one field value changes.
    await validateFields(fieldsToValidateOnChange !== null && fieldsToValidateOnChange !== void 0 ? fieldsToValidateOnChange : [path]);
    if (!isMounted.current) {
      return;
    }

    /**
     * If we have set a delay to display possible validation error message after the field value has changed we
     * 1. check that this is the last "change iteration" (--> the last keystroke from the user)
     * 2. verify how long we've already waited for to run the validations (those can be async and make HTTP requests).
     * 3. (if needed) add a timeout to set the "isChangingValue" state back to "false".
     */
    if (changeIteration === changeCounter.current) {
      if (valueChangeDebounceTime > 0) {
        const timeElapsed = Date.now() - startTime;
        if (timeElapsed < valueChangeDebounceTime) {
          const timeLeftToWait = valueChangeDebounceTime - timeElapsed;
          debounceTimeout.current = setTimeout(() => {
            debounceTimeout.current = null;
            done();
          }, timeLeftToWait);
          return;
        }
      }
      done();
    }
  }, [path, valueChangeDebounceTime, fieldsToValidateOnChange, validateFields]);

  // Cancel any inflight validation (e.g an HTTP Request)
  const cancelInflightValidation = (0, _react.useCallback)(() => {
    if (inflightValidation.current && typeof inflightValidation.current.cancel === 'function') {
      inflightValidation.current.cancel();
      inflightValidation.current = null;
    }
  }, []);

  /**
   * Run all the validations in sequence. If any of the validations is marked as asynchronous
   * ("isAsync: true") this method will be asynchronous.
   * The reason why we maintain both a "sync" and "async" option for field.validate() is because
   * in some cases validating a field must be synchronous (e.g. when adding an item to the EuiCombobox,
   * we want to first validate the value before adding it. The "onCreateOption" handler expects a boolean
   * to be returned synchronously).
   * Keeping both alternative (sync and async) is then a good thing to avoid refactoring dependencies (and
   * the whole jungle with it!).
   */
  const runValidations = (0, _react.useCallback)(({
    formData,
    value: valueToValidate,
    onlyBlocking: runOnlyBlockingValidations,
    validationTypeToValidate
  }, clearFieldErrors) => {
    if (!validations) {
      return [];
    }

    // -- helpers
    const doByPassValidation = ({
      type: validationType,
      isBlocking
    }) => {
      if (validationType !== undefined && validationType !== validationTypeToValidate) {
        return true;
      }
      if (runOnlyBlockingValidations && isBlocking === false) {
        return true;
      }
      return false;
    };
    const enhanceValidationError = (validationError, validation, validationType) => {
      var _validationError$__is;
      return {
        ...validationError,
        // We add an "__isBlocking__" property to know if this error is a blocker or no.
        // Most validation errors are blockers but in some cases a validation is more a warning than an error
        // (e.g when adding an item to the EuiComboBox item. The item might be invalid and can't be added
        // but the field (the array of items) is still valid).
        __isBlocking__: (_validationError$__is = validationError.__isBlocking__) !== null && _validationError$__is !== void 0 ? _validationError$__is : validation.isBlocking,
        validationType
      };
    };
    const runAsync = async () => {
      const validationErrors = [];
      for (const validation of validations) {
        const {
          validator,
          exitOnFail = true,
          type: validationType = _constants.VALIDATION_TYPES.FIELD
        } = validation;
        if (doByPassValidation(validation)) {
          continue;
        }
        inflightValidation.current = validator({
          value: valueToValidate,
          errors: validationErrors,
          form: {
            getFormData,
            getFields
          },
          formData,
          path,
          customData: {
            provider: validationDataProvider,
            value: validationData
          }
        });
        const validationResult = await inflightValidation.current;
        inflightValidation.current = null;
        if (!validationResult) {
          continue;
        }
        validationErrors.push(enhanceValidationError(validationResult, validation, validationType));
        if (exitOnFail) {
          break;
        }
      }
      return validationErrors;
    };
    const runSync = () => {
      const validationErrors = [];
      for (const validation of validations) {
        const {
          validator,
          exitOnFail = true,
          type: validationType = _constants.VALIDATION_TYPES.FIELD
        } = validation;
        if (doByPassValidation(validation)) {
          continue;
        }
        const validationResult = validator({
          value: valueToValidate,
          errors: validationErrors,
          form: {
            getFormData,
            getFields
          },
          formData,
          path,
          customData: {
            provider: validationDataProvider,
            value: validationData
          }
        });
        if (!validationResult) {
          continue;
        }
        if (!!validationResult.then) {
          // The validator returned a Promise: abort and run the validations asynchronously.
          // This is a fallback mechansim, it is recommended to explicitly mark a validation
          // as asynchronous with the "isAsync" flag to avoid runnning twice the same validation
          // (and possible HTTP requests).
          // We keep a reference to the inflight promise so we can cancel it.

          inflightValidation.current = validationResult;
          cancelInflightValidation();
          return runAsync();
        }
        validationErrors.push(enhanceValidationError(validationResult, validation, validationType));
        if (exitOnFail) {
          break;
        }
      }
      return validationErrors;
    };
    // -- end helpers

    clearFieldErrors([validationTypeToValidate !== null && validationTypeToValidate !== void 0 ? validationTypeToValidate : _constants.VALIDATION_TYPES.FIELD, _constants.VALIDATION_TYPES.ASYNC // Immediately clear errors for "async" type validations.
    ]);

    cancelInflightValidation();
    if (hasAsyncValidation) {
      return runAsync();
    }
    return runSync();
  }, [cancelInflightValidation, validations, hasAsyncValidation, getFormData, getFields, path, validationData, validationDataProvider]);

  // ----------------------------------
  // -- Internal API
  // ----------------------------------
  const serializeValue = (0, _react.useCallback)((internalValue = value) => {
    return serializer ? serializer(internalValue) : internalValue;
  }, [serializer, value]);

  // ----------------------------------
  // -- Public API
  // ----------------------------------
  const clearErrors = (0, _react.useCallback)((validationType = _constants.VALIDATION_TYPES.FIELD) => {
    setStateErrors(previousErrors => filterErrors(previousErrors, validationType));
  }, []);
  const validate = (0, _react.useCallback)((validationConfig = {}) => {
    const {
      formData = __getFormData$().value,
      value: valueToValidate = value,
      validationType = _constants.VALIDATION_TYPES.FIELD,
      onlyBlocking = false
    } = validationConfig;
    setValidating(true);

    // By the time our validate function has reached completion, it’s possible
    // that we have called validate() again. If this is the case, we need
    // to ignore the results of this invocation and only use the results of
    // the most recent invocation to update the error state for a field
    const validateIteration = ++validateCounter.current;
    const onValidationResult = _validationErrors => {
      if (validateIteration === validateCounter.current && isMounted.current) {
        // This is the most recent invocation
        setValidating(false);
        setIsValidated(true);
        // Update the errors array
        setStateErrors(prev => {
          const filteredErrors = filterErrors(prev, validationType);
          return [...filteredErrors, ..._validationErrors];
        });
      }
      return {
        isValid: _validationErrors.length === 0,
        errors: _validationErrors
      };
    };
    const validationErrors = runValidations({
      formData,
      value: valueToValidate,
      validationTypeToValidate: validationType,
      onlyBlocking
    }, clearErrors);
    if (Reflect.has(validationErrors, 'then')) {
      return validationErrors.then(onValidationResult);
    }
    return onValidationResult(validationErrors);
  }, [__getFormData$, value, runValidations, clearErrors]);
  const setValue = (0, _react.useCallback)(newValue => {
    setStateValue(prev => {
      let _newValue = newValue;
      if (typeof _newValue === 'function') {
        _newValue = _newValue(prev);
      }
      return formatInputValue(_newValue);
    });
  }, [formatInputValue]);
  const setErrors = (0, _react.useCallback)(_errors => {
    setStateErrors(_errors.map(error => ({
      validationType: _constants.VALIDATION_TYPES.FIELD,
      __isBlocking__: true,
      ...error
    })));
  }, []);
  const onChange = (0, _react.useCallback)(event => {
    const newValue = {}.hasOwnProperty.call(event.target, 'checked') ? event.target.checked : event.target.value;
    setValue(newValue);
  }, [setValue]);
  const getErrorsMessages = (0, _react.useCallback)(({
    errorCode,
    validationType = _constants.VALIDATION_TYPES.FIELD
  } = {}) => {
    const errorMessages = errors.reduce((messages, error) => {
      const isSameErrorCode = errorCode && error.code === errorCode;
      const isSamevalidationType = error.validationType === validationType || validationType === _constants.VALIDATION_TYPES.FIELD && !{}.hasOwnProperty.call(error, 'validationType');
      if (isSameErrorCode || typeof errorCode === 'undefined' && isSamevalidationType) {
        return messages ? `${messages}, ${error.message}` // concatenate error message
        : error.message;
      }
      return messages;
    }, '');
    return errorMessages ? errorMessages : null;
  }, [errors]);
  const reset = (0, _react.useCallback)((resetOptions = {
    resetValue: true
  }) => {
    const {
      resetValue = true,
      defaultValue: updatedDefaultValue
    } = resetOptions;
    setPristine(true);
    if (isMounted.current) {
      setIsModified(false);
      setValidating(false);
      setIsChangingValue(false);
      setIsValidated(false);
      setStateErrors([]);
      if (resetValue) {
        const newValue = deserializeValue(updatedDefaultValue !== null && updatedDefaultValue !== void 0 ? updatedDefaultValue : defaultValue);
        lastNotifiedState.current.value = newValue;
        setValue(newValue);
        return newValue;
      }
    }
  }, [deserializeValue, defaultValue, setValue, setStateErrors]);

  // Don't take into account non blocker validation. Some are just warning (like trying to add a wrong ComboBox item)
  const isValid = errors.filter(e => e.__isBlocking__ !== false).length === 0;
  const field = (0, _react.useMemo)(() => {
    return {
      path,
      type,
      label,
      labelAppend,
      helpText,
      value,
      errors,
      isPristine,
      isDirty: !isPristine,
      isModified,
      isValid,
      isValidating,
      isValidated,
      isChangingValue,
      onChange,
      getErrorsMessages,
      setValue,
      setErrors,
      clearErrors,
      validate,
      reset,
      __isIncludedInOutput: isIncludedInOutput,
      __serializeValue: serializeValue
    };
  }, [path, type, label, labelAppend, helpText, value, isPristine, isModified, errors, isValid, isValidating, isValidated, isChangingValue, isIncludedInOutput, onChange, getErrorsMessages, setValue, setErrors, clearErrors, validate, reset, serializeValue]);

  // ----------------------------------
  // -- EFFECTS
  // ----------------------------------
  (0, _react.useEffect)(() => {
    // Add the fieldHook object to the form "fieldsRefs" map
    __addField(field);
  }, [field, __addField]);
  (0, _react.useEffect)(() => {
    return () => {
      // We only remove the field from the form "fieldsRefs" map when its path
      // changes (which in practice never occurs) or whenever the <UseField /> unmounts
      __removeField(path);

      // We also have to trigger validation of dependant fields
      const dependantFields = fieldsToValidateOnChange === null || fieldsToValidateOnChange === void 0 ? void 0 : fieldsToValidateOnChange.filter(f => f !== path);
      if (dependantFields !== null && dependantFields !== void 0 && dependantFields.length) {
        validateFields(dependantFields);
      }
    };
  }, [path, __removeField, fieldsToValidateOnChange, validateFields]);

  // Value change: notify prop listener (<UseField onChange={() => {...}})
  // We have a separate useEffect for this as the "onChange" handler pass through prop
  // might not be wrapped inside a "useCallback" and that would trigger a possible infinite
  // amount of effect executions.
  (0, _react.useEffect)(() => {
    if (!isMounted.current || value === undefined) {
      return;
    }
    if (valueChangeListener && valueHasChanged) {
      valueChangeListener(value);
    }
  }, [value, valueHasChanged, valueChangeListener]);

  // Value change: update state and run validations
  (0, _react.useEffect)(() => {
    if (!isMounted.current || !valueHasChanged) {
      return;
    }
    setPristine(false);
    setIsChangingValue(true);
    runValidationsOnValueChange(() => {
      if (isMounted.current) {
        setIsChangingValue(false);
      }
    });
  }, [valueHasChanged, runValidationsOnValueChange]);

  // Value change: set "isModified" state
  (0, _react.useEffect)(() => {
    setIsModified(() => {
      if (typeof value === 'object') {
        return JSON.stringify(value) !== JSON.stringify(initialValueDeserialized);
      }
      return value !== initialValueDeserialized;
    });
  }, [value, initialValueDeserialized]);

  // Errors change: notify prop listener (<UseField onError={() => {...}} />)
  (0, _react.useEffect)(() => {
    if (!isMounted.current) {
      return;
    }
    if (errorChangeListener && errorsHaveChanged) {
      errorChangeListener(errorsToString(errors));
    }
  }, [errors, errorsHaveChanged, errorChangeListener]);
  (0, _react.useEffect)(() => {
    lastNotifiedState.current.value = value;
  }, [value]);
  (0, _react.useEffect)(() => {
    lastNotifiedState.current.errors = errorsToString(errors);
  }, [errors]);
  (0, _react.useEffect)(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
        debounceTimeout.current = null;
      }
    };
  }, []);
  return field;
};
exports.useField = useField;