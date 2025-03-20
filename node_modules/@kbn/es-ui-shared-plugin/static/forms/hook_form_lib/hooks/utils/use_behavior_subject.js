"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useBehaviorSubject = void 0;
var _react = require("react");
var _rxjs = require("rxjs");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Utility to create an observable with a handler to update its value.
 * Useful for validations when dynamic data needs to be passed through the
 * "validationDataProvider" prop **and** this dynamic data arrives _after_ the
 * field value has changed (e.g. when the field value changes it triggers an HTTP requests and
 * the field validators needs the response to be able to validate the field).
 *
 * @param initialState any The initial value of the observable
 * @returns Array<Observable, (newValue) => void>
 *
 * @example
 *
  const MyForm = () => {
    const { form } = useForm();
    const [indices, setIndices] = useState([]);
    const [indices$, nextIndices] = useBehaviorSubject(null); // Use the provided util hook to create an observable

    const onIndexNameChange = useCallback(({ indexName }) => {
      // Whenever the indexName changes reset the subject to not send stale data to the validator
      nextIndices(null);
    }, []);

    const [{ indexName }] = useFormData({
      form,
      watch: 'indexName',
      onChange: onIndexNameChange, // React to changes before any validation is executed
    });

    const indicesProvider = useCallback(() => {
      // Wait until we have fetched the indices.
      // The result will then be sent to the field validator(s) (when calling await provider(););
      return await firstValueFrom(indices$.pipe(first((data) => data !== null)));
    }, [indices$, nextIndices]);

    const fetchIndices = useCallback(async () => {
      const result = await httpClient.get(`/api/search/${indexName}`);
      // update the component state
      setIndices(result);

      // Send the indices to the BehaviorSubject to resolve the "indicesProvider()" promise
      nextIndices(result);
    }, [indexName]);

    // Whenever the indexName changes we fetch the indices
    useEffect(() => {
      fetchIndices();
    }, [fetchIndices]);

    return (
      <>
        <Form form={form}>
          <UseField path="indexName" validationDataProvider={indicesProvider} />
        </Form>

        ...
      <>
    );
  }
 */
const useBehaviorSubject = initialState => {
  const subjectRef = (0, _react.useRef)();
  const getSubject$ = (0, _react.useCallback)(() => {
    if (subjectRef.current === undefined) {
      subjectRef.current = new _rxjs.BehaviorSubject(initialState);
    }
    return subjectRef.current;
  }, [initialState]);
  const hook = (0, _react.useMemo)(() => {
    const subject = getSubject$();
    const observable = subject.asObservable();
    const next = subject.next.bind(subject);
    return [observable, next];
  }, [getSubject$]);
  return hook;
};
exports.useBehaviorSubject = useBehaviorSubject;