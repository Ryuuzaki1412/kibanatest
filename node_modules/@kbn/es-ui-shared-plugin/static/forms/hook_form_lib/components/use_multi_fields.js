"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UseMultiFields = UseMultiFields;
var _react = require("react");
var _hooks = require("../hooks");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Use this component to avoid nesting multiple <UseField />
  @example
```
// before
<UseField path="maxValue">
  {maxValueField => {
    return (
      <UseField path="minValue">
        {minValueField => {
          return (
            // The EuiDualRange handles 2 values (min and max) and thus
            // updates 2 fields in our form
            <EuiDualRange
              min={0}
              max={100}
              value={[minValueField.value, maxValueField.value]}
              onChange={([minValue, maxValue]) => {
                minValueField.setValue(minValue);
                maxValueField.setValue(maxValue);
              }}
            />
          )
        }}
      </UseField>
    )
  }}
</UseField>

// after
const fields = {
  min: {
    ... // any prop you would normally pass to <UseField />
    path: 'minValue',
    config: { ... } // FieldConfig
  },
  max: {
    path: 'maxValue',
  },
};

<UseMultiFields fields={fields}>
  {({ min, max }) => {
    return (
      <EuiDualRange
        min={0}
        max={100}
        value={[min.value, max.value]}
        onChange={([minValue, maxValue]) => {
          min.setValue(minValue);
          max.setValue(maxValue);
        }}
      />
    );
  }}
</UseMultiFields>
```
 */
function UseMultiFields({
  fields,
  children
}) {
  // Create a stable reference of fields Ids to prevent creating more fields
  // by changing the "fields" prop. This is not allowed as it would break
  // the hook order below.
  const fieldIds = (0, _react.useRef)(Object.keys(fields).sort());
  const hookFields = fieldIds.current.reduce((acc, id) => {
    // We can disable the rules-of-hooks that prevents us to create a hook
    // from inside a callback as we have the **guarantee** that the field hooks are created
    // in the same order.

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {
      field
    } = (0, _hooks.useFieldFromProps)(fields[id]);
    return {
      ...acc,
      [id]: field
    };
  }, {});
  if (!Boolean(fieldIds.current.length)) {
    return null;
  }
  return children(hookFields);
}