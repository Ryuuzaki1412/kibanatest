"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stopPropagationAndPreventDefault = exports.skipFocusInContainerTo = exports.onPageDownOrPageUp = exports.onKeyDownFocusHandler = exports.onHomeEndDown = exports.onFocusReFocusDraggable = exports.onArrowKeyDown = exports.isTab = exports.isPageUp = exports.isPageDownOrPageUp = exports.isPageDown = exports.isHomeOrEnd = exports.isHome = exports.isEscape = exports.isEnd = exports.isArrowUp = exports.isArrowRightOrArrowLeft = exports.isArrowRight = exports.isArrowKey = exports.isArrowDownOrArrowUp = exports.isArrowDown = exports.handleSkipFocus = exports.getTableSkipFocus = exports.getRowindex = exports.getRowRendererClassName = exports.getRowByAriaRowindex = exports.getNotesContainerClassName = exports.getNewAriaRowindex = exports.getNewAriaColindex = exports.getFocusedRow = exports.getFocusedDataColindexCell = exports.getFocusedColumn = exports.getFocusedAriaColindexCell = exports.getFocusableChidren = exports.getFocusOnFromArrowKey = exports.getFirstOrLastAriaRowindex = exports.getFirstNonVisibleAriaRowindex = exports.getElementWithMatchingAriaColindex = exports.getColindex = exports.focusedCellIsPlainColumnHeader = exports.focusedCellHasMoreFocusableChildren = exports.focusedCellHasAlwaysOpenHoverContent = exports.focusColumn = exports.elementOrChildrenHasFocus = exports.arrayIndexToAriaIndex = exports.ariaIndexToArrayIndex = exports.FIRST_ARIA_INDEX = exports.DATA_ROWINDEX_ATTRIBUTE = exports.DATA_COLINDEX_ATTRIBUTE = exports.ARIA_ROWINDEX_ATTRIBUTE = exports.ARIA_COLINDEX_ATTRIBUTE = void 0;
var _securitysolutionTGrid = require("@kbn/securitysolution-t-grid");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * The name of the ARIA attribute representing a column, used in conjunction with
 * the ARIA: grid role https://www.w3.org/TR/wai-aria-practices-1.1/examples/grid/dataGrids.html
 */
const ARIA_COLINDEX_ATTRIBUTE = 'aria-colindex';

/**
 * This alternative attribute to `aria-colindex` is used to decorate the data
 * in existing `EuiTable`s to enable keyboard navigation with minimal
 * refactoring of existing code until we're ready to migrate to `EuiDataGrid`.
 * It may be applied directly to keyboard-focusable elements and thus doesn't
 * have exactly the same semantics as `aria-colindex`.
 */
exports.ARIA_COLINDEX_ATTRIBUTE = ARIA_COLINDEX_ATTRIBUTE;
const DATA_COLINDEX_ATTRIBUTE = 'data-colindex';

/**
 * The name of the ARIA attribute representing a row, used in conjunction with
 * the ARIA: grid role https://www.w3.org/TR/wai-aria-practices-1.1/examples/grid/dataGrids.html
 */
exports.DATA_COLINDEX_ATTRIBUTE = DATA_COLINDEX_ATTRIBUTE;
const ARIA_ROWINDEX_ATTRIBUTE = 'aria-rowindex';

/**
 * This alternative attribute to `aria-rowindex` is used to decorate the data
 * in existing `EuiTable`s to enable keyboard navigation with minimal
 * refactoring of existing code until we're ready to migrate to `EuiDataGrid`.
 * It's typically applied to `<tr>` elements via `EuiTable`'s `rowProps` prop.
 */
exports.ARIA_ROWINDEX_ATTRIBUTE = ARIA_ROWINDEX_ATTRIBUTE;
const DATA_ROWINDEX_ATTRIBUTE = 'data-rowindex';

/** `aria-colindex` and `aria-rowindex` start at one */
exports.DATA_ROWINDEX_ATTRIBUTE = DATA_ROWINDEX_ATTRIBUTE;
const FIRST_ARIA_INDEX = 1;

/** Converts an aria index, which starts at one, to an array index, which starts at zero */
exports.FIRST_ARIA_INDEX = FIRST_ARIA_INDEX;
const ariaIndexToArrayIndex = ariaIndex => ariaIndex - 1;

/** Converts an array index, which starts at zero, to an aria index, which starts at one */
exports.ariaIndexToArrayIndex = ariaIndexToArrayIndex;
const arrayIndexToAriaIndex = arrayIndex => arrayIndex + 1;

/** Returns `true` if the left or right arrow was pressed  */
exports.arrayIndexToAriaIndex = arrayIndexToAriaIndex;
const isArrowRightOrArrowLeft = event => event.key === 'ArrowLeft' || event.key === 'ArrowRight';

/** Returns `true` if the down arrow key was pressed */
exports.isArrowRightOrArrowLeft = isArrowRightOrArrowLeft;
const isArrowDown = event => event.key === 'ArrowDown';

/** Returns `true` if the up arrow key was pressed */
exports.isArrowDown = isArrowDown;
const isArrowUp = event => event.key === 'ArrowUp';

/** Returns `true` if the down or up arrow was pressed  */
exports.isArrowUp = isArrowUp;
const isArrowDownOrArrowUp = event => isArrowDown(event) || isArrowUp(event);

/** Returns `true` if an arrow key was pressed */
exports.isArrowDownOrArrowUp = isArrowDownOrArrowUp;
const isArrowKey = event => isArrowRightOrArrowLeft(event) || isArrowDownOrArrowUp(event);

/** Returns `true` if the right arrow key was pressed */
exports.isArrowKey = isArrowKey;
const isArrowRight = event => event.key === 'ArrowRight';

/** Returns `true` if the escape key was pressed */
exports.isArrowRight = isArrowRight;
const isEscape = event => event.key === 'Escape';

/** Returns `true` if the home key was pressed */
exports.isEscape = isEscape;
const isHome = event => event.key === 'Home';

/** Returns `true` if the end key was pressed */
exports.isHome = isHome;
const isEnd = event => event.key === 'End';

/** Returns `true` if the home or end key was pressed */
exports.isEnd = isEnd;
const isHomeOrEnd = event => isHome(event) || isEnd(event);

/** Returns `true` if the page up key was pressed */
exports.isHomeOrEnd = isHomeOrEnd;
const isPageUp = event => event.key === 'PageUp';

/** Returns `true` if the page down key was pressed */
exports.isPageUp = isPageUp;
const isPageDown = event => event.key === 'PageDown';

/** Returns `true` if the page up or page down key was pressed */
exports.isPageDown = isPageDown;
const isPageDownOrPageUp = event => isPageDown(event) || isPageUp(event);

/** Returns `true` if the tab key was pressed */
exports.isPageDownOrPageUp = isPageDownOrPageUp;
const isTab = event => event.key === 'Tab';

/** Returns `previous` or `next`, depending on which arrow key was pressed */
exports.isTab = isTab;
const getFocusOnFromArrowKey = event => event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? 'previous' : 'next';

/**
 * Returns the column that directly owns focus, or contains a focused element,
 * using the `aria-colindex` attribute.
 */
exports.getFocusOnFromArrowKey = getFocusOnFromArrowKey;
const getFocusedColumn = ({
  colindexAttribute,
  element
}) => {
  var _element$querySelecto;
  return (_element$querySelecto = element === null || element === void 0 ? void 0 : element.querySelector(`[${colindexAttribute}]:focus-within`)) !== null && _element$querySelecto !== void 0 ? _element$querySelecto : null;
};

/** Returns the numeric `aria-colindex` of the specified element */
exports.getFocusedColumn = getFocusedColumn;
const getColindex = ({
  colindexAttribute,
  element
}) => (element === null || element === void 0 ? void 0 : element.getAttribute(colindexAttribute)) != null ? Number(element === null || element === void 0 ? void 0 : element.getAttribute(colindexAttribute)) : null;

/**  Returns the row that directly owns focus, or contains a focused element */
exports.getColindex = getColindex;
const getFocusedRow = ({
  rowindexAttribute,
  element
}) => {
  var _element$querySelecto2;
  return (_element$querySelecto2 = element === null || element === void 0 ? void 0 : element.querySelector(`[${rowindexAttribute}]:focus-within`)) !== null && _element$querySelecto2 !== void 0 ? _element$querySelecto2 : null;
};

/** Returns the numeric `aria-rowindex` of the specified element */
exports.getFocusedRow = getFocusedRow;
const getRowindex = ({
  rowindexAttribute,
  element
}) => (element === null || element === void 0 ? void 0 : element.getAttribute(rowindexAttribute)) != null ? Number(element === null || element === void 0 ? void 0 : element.getAttribute(rowindexAttribute)) : null;

/** Returns the row with the specified `aria-rowindex` */
exports.getRowindex = getRowindex;
const getRowByAriaRowindex = ({
  ariaRowindex,
  element,
  rowindexAttribute
}) => {
  var _element$querySelecto3;
  return (_element$querySelecto3 = element === null || element === void 0 ? void 0 : element.querySelector(`[${rowindexAttribute}="${ariaRowindex}"]`)) !== null && _element$querySelecto3 !== void 0 ? _element$querySelecto3 : null;
};

/** Returns the `previous` or `next` `aria-colindex` relative to the currently focused `aria-colindex` */
exports.getRowByAriaRowindex = getRowByAriaRowindex;
const getNewAriaColindex = ({
  focusedAriaColindex,
  focusOn,
  maxAriaColindex
}) => {
  const newAriaColindex = focusOn === 'previous' ? focusedAriaColindex - 1 : focusedAriaColindex + 1;
  if (newAriaColindex < FIRST_ARIA_INDEX) {
    return FIRST_ARIA_INDEX;
  }
  if (newAriaColindex > maxAriaColindex) {
    return maxAriaColindex;
  }
  return newAriaColindex;
};

/** Returns the element at the specified `aria-colindex` */
exports.getNewAriaColindex = getNewAriaColindex;
const getElementWithMatchingAriaColindex = ({
  ariaColindex,
  colindexAttribute,
  element
}) => {
  var _element$querySelecto4;
  if ((element === null || element === void 0 ? void 0 : element.getAttribute(colindexAttribute)) === `${ariaColindex}`) {
    return element; // the current element has it
  }

  return (_element$querySelecto4 = element === null || element === void 0 ? void 0 : element.querySelector(`[${colindexAttribute}="${ariaColindex}"]`)) !== null && _element$querySelecto4 !== void 0 ? _element$querySelecto4 : null;
};

/** Returns the `previous` or `next` `aria-rowindex` relative to the currently focused `aria-rowindex` */
exports.getElementWithMatchingAriaColindex = getElementWithMatchingAriaColindex;
const getNewAriaRowindex = ({
  focusedAriaRowindex,
  focusOn,
  maxAriaRowindex
}) => {
  const newAriaRowindex = focusOn === 'previous' ? focusedAriaRowindex - 1 : focusedAriaRowindex + 1;
  if (newAriaRowindex < FIRST_ARIA_INDEX) {
    return FIRST_ARIA_INDEX;
  }
  if (newAriaRowindex > maxAriaRowindex) {
    return maxAriaRowindex;
  }
  return newAriaRowindex;
};

/** Returns the first `aria-rowindex` if the home key is pressed, otherwise the last `aria-rowindex` is returned */
exports.getNewAriaRowindex = getNewAriaRowindex;
const getFirstOrLastAriaRowindex = ({
  event,
  maxAriaRowindex
}) => isHome(event) ? FIRST_ARIA_INDEX : maxAriaRowindex;
exports.getFirstOrLastAriaRowindex = getFirstOrLastAriaRowindex;
/**
 * SIDE EFFECT: mutates the DOM by focusing the specified column
 * returns the `aria-colindex` of the newly-focused column
 */
const focusColumn = ({
  colindexAttribute,
  containerElement,
  ariaColindex,
  ariaRowindex,
  rowindexAttribute
}) => {
  if (containerElement == null) {
    return {
      newFocusedColumnAriaColindex: null,
      newFocusedColumn: null
    };
  }
  const row = getRowByAriaRowindex({
    ariaRowindex,
    element: containerElement,
    rowindexAttribute
  });
  const column = getElementWithMatchingAriaColindex({
    ariaColindex,
    colindexAttribute,
    element: row
  });
  if (column != null) {
    column.focus(); // DOM mutation side effect
    return {
      newFocusedColumnAriaColindex: ariaColindex,
      newFocusedColumn: column
    };
  }
  return {
    newFocusedColumnAriaColindex: null,
    newFocusedColumn: null
  };
};
exports.focusColumn = focusColumn;
const getRowRendererClassName = ariaRowindex => `${_securitysolutionTGrid.ROW_RENDERER_CLASS_NAME}-${ariaRowindex}`;
exports.getRowRendererClassName = getRowRendererClassName;
const getNotesContainerClassName = ariaRowindex => `${_securitysolutionTGrid.NOTES_CONTAINER_CLASS_NAME}-${ariaRowindex}`;

/**
 * This function implements arrow key support for the `onKeyDownFocusHandler`.
 *
 * See the `Keyboard Support` section of
 * https://www.w3.org/TR/wai-aria-practices-1.1/examples/grid/dataGrids.html
 * for details
 */
exports.getNotesContainerClassName = getNotesContainerClassName;
const onArrowKeyDown = ({
  colindexAttribute,
  containerElement,
  event,
  focusedAriaColindex,
  focusedAriaRowindex,
  maxAriaColindex,
  maxAriaRowindex,
  onColumnFocused,
  rowindexAttribute
}) => {
  if (isArrowDown(event) && event.shiftKey) {
    const firstRowRendererDraggable = containerElement === null || containerElement === void 0 ? void 0 : containerElement.querySelector(`.${getRowRendererClassName(focusedAriaRowindex)} .${_securitysolutionTGrid.DRAGGABLE_KEYBOARD_WRAPPER_CLASS_NAME}`);
    if (firstRowRendererDraggable) {
      firstRowRendererDraggable.focus();
      return;
    }
  }
  if (isArrowRight(event) && event.shiftKey) {
    const firstNoteContent = containerElement === null || containerElement === void 0 ? void 0 : containerElement.querySelector(`.${getNotesContainerClassName(focusedAriaRowindex)} .${_securitysolutionTGrid.NOTE_CONTENT_CLASS_NAME}`);
    if (firstNoteContent) {
      firstNoteContent.focus();
      return;
    }
  }
  const ariaColindex = isArrowRightOrArrowLeft(event) ? getNewAriaColindex({
    focusedAriaColindex,
    focusOn: getFocusOnFromArrowKey(event),
    maxAriaColindex
  }) : focusedAriaColindex;
  const ariaRowindex = isArrowDownOrArrowUp(event) ? getNewAriaRowindex({
    focusedAriaRowindex,
    focusOn: getFocusOnFromArrowKey(event),
    maxAriaRowindex
  }) : focusedAriaRowindex;
  const {
    newFocusedColumn,
    newFocusedColumnAriaColindex
  } = focusColumn({
    ariaColindex,
    ariaRowindex,
    colindexAttribute,
    containerElement,
    rowindexAttribute
  });
  if (onColumnFocused != null && newFocusedColumnAriaColindex != null) {
    onColumnFocused({
      newFocusedColumn,
      newFocusedColumnAriaColindex
    });
  }
};

/**
 * This function implements `home` and `end` key support for the `onKeyDownFocusHandler`.
 *
 * See the `Keyboard Support` section of
 * https://www.w3.org/TR/wai-aria-practices-1.1/examples/grid/dataGrids.html
 * for details
 */
exports.onArrowKeyDown = onArrowKeyDown;
const onHomeEndDown = ({
  colindexAttribute,
  containerElement,
  event,
  focusedAriaRowindex,
  maxAriaColindex,
  maxAriaRowindex,
  onColumnFocused,
  rowindexAttribute
}) => {
  const ariaColindex = isHome(event) ? FIRST_ARIA_INDEX : maxAriaColindex;
  const ariaRowindex = event.ctrlKey ? getFirstOrLastAriaRowindex({
    event,
    maxAriaRowindex
  }) : focusedAriaRowindex;
  const {
    newFocusedColumn,
    newFocusedColumnAriaColindex
  } = focusColumn({
    ariaColindex,
    ariaRowindex,
    colindexAttribute,
    containerElement,
    rowindexAttribute
  });
  if (isHome(event) && event.ctrlKey) {
    containerElement === null || containerElement === void 0 ? void 0 : containerElement.scrollTo(0, 0);
  }
  if (onColumnFocused != null && newFocusedColumnAriaColindex != null) {
    onColumnFocused({
      newFocusedColumn,
      newFocusedColumnAriaColindex
    });
  }
};

/** Returns `true` if the specified row is completely visible in the container */
exports.onHomeEndDown = onHomeEndDown;
const isRowCompletelyScrolledIntoView = ({
  container,
  row
}) => {
  const rect = row.getBoundingClientRect();
  const top = rect.top;
  const bottom = rect.bottom;
  return top >= container.top && bottom <= container.bottom;
};
const getFirstNonVisibleAriaRowindex = ({
  focusedAriaRowindex,
  element,
  event,
  maxAriaRowindex,
  rowindexAttribute
}) => {
  var _element$querySelecto5;
  const defaultAriaRowindex = isPageUp(event) ? FIRST_ARIA_INDEX : maxAriaRowindex; // default to the first or last row

  if (element === null) {
    return defaultAriaRowindex;
  }
  const container = element.getBoundingClientRect();
  const rows = Array.from((_element$querySelecto5 = element.querySelectorAll(`[${rowindexAttribute}]`)) !== null && _element$querySelecto5 !== void 0 ? _element$querySelecto5 : []);
  if (isPageUp(event)) {
    return arrayIndexToAriaIndex(rows.reduceRight((found, row, i) => i < ariaIndexToArrayIndex(focusedAriaRowindex) && found === ariaIndexToArrayIndex(defaultAriaRowindex) && !isRowCompletelyScrolledIntoView({
      container,
      row
    }) ? i : found, ariaIndexToArrayIndex(defaultAriaRowindex)));
  } else if (isPageDown(event)) {
    return arrayIndexToAriaIndex(rows.reduce((found, row, i) => i > ariaIndexToArrayIndex(focusedAriaRowindex) && found === ariaIndexToArrayIndex(defaultAriaRowindex) && !isRowCompletelyScrolledIntoView({
      container,
      row
    }) ? i : found, ariaIndexToArrayIndex(defaultAriaRowindex)));
  } else {
    return defaultAriaRowindex;
  }
};

/**
 * This function implements `page down` and `page up` key support for the `onKeyDownFocusHandler`.
 *
 * See the `Keyboard Support` section of
 * https://www.w3.org/TR/wai-aria-practices-1.1/examples/grid/dataGrids.html
 * for details
 */
exports.getFirstNonVisibleAriaRowindex = getFirstNonVisibleAriaRowindex;
const onPageDownOrPageUp = ({
  colindexAttribute,
  containerElement,
  event,
  focusedAriaColindex,
  focusedAriaRowindex,
  maxAriaRowindex,
  onColumnFocused,
  rowindexAttribute
}) => {
  const ariaRowindex = getFirstNonVisibleAriaRowindex({
    element: containerElement,
    event,
    focusedAriaRowindex,
    maxAriaRowindex,
    rowindexAttribute
  });
  const {
    newFocusedColumn,
    newFocusedColumnAriaColindex
  } = focusColumn({
    ariaColindex: focusedAriaColindex,
    ariaRowindex,
    colindexAttribute,
    containerElement,
    rowindexAttribute
  });
  if (onColumnFocused != null) {
    onColumnFocused({
      newFocusedColumn,
      newFocusedColumnAriaColindex
    });
  }
};

/**
 * This function has side effects: It stops propagation of the provided
 * `KeyboardEvent` and prevents the browser's default behavior.
 */
exports.onPageDownOrPageUp = onPageDownOrPageUp;
const stopPropagationAndPreventDefault = event => {
  event.stopPropagation();
  event.preventDefault();
};

/**
 * This function adds keyboard accessability to any `containerElement` that
 * renders its rows with support for `aria-colindex` and `aria-rowindex`.
 *
 * To use this function, invoke it in the `onKeyDown` handler of the specified
 * `containerElement`.
 *
 * See the `Keyboard Support` section of
 * https://www.w3.org/TR/wai-aria-practices-1.1/examples/grid/dataGrids.html
 * for details of the behavior.
 */
exports.stopPropagationAndPreventDefault = stopPropagationAndPreventDefault;
const onKeyDownFocusHandler = ({
  colindexAttribute,
  containerElement,
  event,
  maxAriaColindex,
  maxAriaRowindex,
  onColumnFocused,
  rowindexAttribute
}) => {
  var _getColindex;
  // NOTE: When a row has focus, but none of the columns in that row have focus
  // because, for example, the row renderer contained by the row has focus, we
  // default `focusedAriaColindex` to be the first non-action column:
  const focusedAriaColindex = (_getColindex = getColindex({
    colindexAttribute,
    element: getFocusedColumn({
      colindexAttribute,
      element: containerElement
    })
  })) !== null && _getColindex !== void 0 ? _getColindex : FIRST_ARIA_INDEX;
  const focusedAriaRowindex = getRowindex({
    rowindexAttribute,
    element: getFocusedRow({
      rowindexAttribute,
      element: containerElement
    })
  });
  if (focusedAriaColindex != null && focusedAriaRowindex != null) {
    if (isArrowKey(event)) {
      stopPropagationAndPreventDefault(event);
      onArrowKeyDown({
        colindexAttribute,
        containerElement,
        event,
        focusedAriaColindex,
        focusedAriaRowindex,
        maxAriaColindex,
        maxAriaRowindex,
        onColumnFocused,
        rowindexAttribute
      });
    } else if (isHomeOrEnd(event)) {
      stopPropagationAndPreventDefault(event);
      onHomeEndDown({
        colindexAttribute,
        containerElement,
        event,
        focusedAriaRowindex,
        maxAriaColindex,
        maxAriaRowindex,
        onColumnFocused,
        rowindexAttribute
      });
    } else if (isPageDownOrPageUp(event)) {
      stopPropagationAndPreventDefault(event);
      onPageDownOrPageUp({
        colindexAttribute,
        containerElement,
        event,
        focusedAriaColindex,
        focusedAriaRowindex,
        maxAriaRowindex,
        onColumnFocused,
        rowindexAttribute
      });
    }
  }
};

/**
 * An `onFocus` event handler that focuses the first child draggable
 * keyboard handler
 */
exports.onKeyDownFocusHandler = onKeyDownFocusHandler;
const onFocusReFocusDraggable = event => {
  var _event$target$querySe;
  return (_event$target$querySe = event.target.querySelector(`.${_securitysolutionTGrid.DRAGGABLE_KEYBOARD_WRAPPER_CLASS_NAME}`)) === null || _event$target$querySe === void 0 ? void 0 : _event$target$querySe.focus();
};

/** Returns `true` when the element, or one of it's children has focus */
exports.onFocusReFocusDraggable = onFocusReFocusDraggable;
const elementOrChildrenHasFocus = element => element === document.activeElement || (element === null || element === void 0 ? void 0 : element.querySelector(':focus-within')) != null;
exports.elementOrChildrenHasFocus = elementOrChildrenHasFocus;
/**
 * This function has a side effect. It focuses the first element with a
 * matching `className` in the `containerElement`.
 */
const skipFocusInContainerTo = ({
  containerElement,
  className
}) => {
  var _containerElement$que;
  return containerElement === null || containerElement === void 0 ? void 0 : (_containerElement$que = containerElement.querySelector(`.${className}`)) === null || _containerElement$que === void 0 ? void 0 : _containerElement$que.focus();
};

/**
 * Returns a table cell's focusable children, which may be one of the following
 * a) a `HTMLButtonElement` that does NOT have the `disabled` attribute
 * b) an element with the `DRAGGABLE_KEYBOARD_WRAPPER_CLASS_NAME`
 */
exports.skipFocusInContainerTo = skipFocusInContainerTo;
const getFocusableChidren = cell => {
  var _cell$querySelectorAl;
  return Array.from((_cell$querySelectorAl = cell === null || cell === void 0 ? void 0 : cell.querySelectorAll(`button:not([disabled]), button:not([tabIndex="-1"]), .${_securitysolutionTGrid.DRAGGABLE_KEYBOARD_WRAPPER_CLASS_NAME}`)) !== null && _cell$querySelectorAl !== void 0 ? _cell$querySelectorAl : []);
};
exports.getFocusableChidren = getFocusableChidren;
/**
 * If the value of `skipFocus` is `SKIP_FOCUS_BACKWARDS` or `SKIP_FOCUS_FORWARD`
 * this function will invoke the provided `onSkipFocusBackwards` or
 * `onSkipFocusForward` functions respectively.
 *
 * If `skipFocus` is `SKIP_FOCUS_NOOP`, the `onSkipFocusBackwards` and
 * `onSkipFocusForward` functions will not be invoked.
 */
const handleSkipFocus = ({
  onSkipFocusBackwards,
  onSkipFocusForward,
  skipFocus
}) => {
  switch (skipFocus) {
    case 'SKIP_FOCUS_BACKWARDS':
      onSkipFocusBackwards();
      break;
    case 'SKIP_FOCUS_FORWARD':
      onSkipFocusForward();
      break;
    case 'SKIP_FOCUS_NOOP': // fall through to the default, which does nothing
    default:
      break;
  }
};

/**
 * The provided `focusedCell` may contain multiple focusable children. For,
 * example, the cell may contain multiple `HTMLButtonElement`s that represent
 * actions, or the cell may contain multiple draggables.
 *
 * This function returns `true` when there are still more children of the cell
 * that should receive focus when the tab key is pressed.
 *
 * When this function returns `true`, the caller should NOT move focus away
 * from the table. Instead, the browser's "natural" focus management should be
 * allowed to automatically focus the next (or previous) focusable child of the
 * cell.
 */
exports.handleSkipFocus = handleSkipFocus;
const focusedCellHasMoreFocusableChildren = ({
  focusedCell,
  shiftKey
}) => {
  const focusableChildren = getFocusableChidren(focusedCell);
  if (focusableChildren.length === 0) {
    return false; // there no children to focus
  }

  const firstOrLastChild = shiftKey ? focusableChildren[0] : focusableChildren[focusableChildren.length - 1];
  return firstOrLastChild !== document.activeElement;
};

/**
 * Returns `true` when the provided `focusedCell` has always-open hover
 * content (i.e. a hover menu)
 *
 * When this function returns true, the caller should `NOT` move focus away
 * from the table. Instead, the browser's "natural" focus management should
 * be allowed to manage focus between the table and the hover content.
 */
exports.focusedCellHasMoreFocusableChildren = focusedCellHasMoreFocusableChildren;
const focusedCellHasAlwaysOpenHoverContent = focusedCell => (focusedCell === null || focusedCell === void 0 ? void 0 : focusedCell.querySelector(`.${_securitysolutionTGrid.HOVER_ACTIONS_ALWAYS_SHOW_CLASS_NAME}`)) != null;
exports.focusedCellHasAlwaysOpenHoverContent = focusedCellHasAlwaysOpenHoverContent;
/**
 * Returns true if the focused cell is a plain, non-action `columnheader`
 */
const focusedCellIsPlainColumnHeader = focusedCell => (focusedCell === null || focusedCell === void 0 ? void 0 : focusedCell.getAttribute('role')) === 'columnheader' && !(focusedCell !== null && focusedCell !== void 0 && focusedCell.classList.contains('siemEventsTable__thGroupActions'));

/**
 * This function, which works with tables that use the `aria-colindex` or
 * `data-colindex` attributes, examines the focus state of the table, and
 * returns a `SkipFocus` enumeration.
 *
 * The `SkipFocus` return value indicates whether the caller should skip focus
 * to "before" the table, "after" the table, or take no action, and let the
 * browser's "natural" focus management manage focus.
 */
exports.focusedCellIsPlainColumnHeader = focusedCellIsPlainColumnHeader;
const getTableSkipFocus = ({
  containerElement,
  getFocusedCell,
  shiftKey,
  tableHasFocus,
  tableClassName
}) => {
  if (tableHasFocus(containerElement)) {
    const focusedCell = getFocusedCell({
      containerElement,
      tableClassName
    });
    if (focusedCell == null) {
      return 'SKIP_FOCUS_NOOP'; // no cells have focus, often because something with a `dialog` role has focus
    }

    if (focusedCellHasMoreFocusableChildren({
      focusedCell,
      shiftKey
    }) && !focusedCellIsPlainColumnHeader(focusedCell)) {
      return 'SKIP_FOCUS_NOOP'; // the focused cell still has focusable children
    }

    if (focusedCellHasAlwaysOpenHoverContent(focusedCell)) {
      return 'SKIP_FOCUS_NOOP'; // the focused cell has always-open hover content
    }

    return shiftKey ? 'SKIP_FOCUS_BACKWARDS' : 'SKIP_FOCUS_FORWARD'; // the caller should skip focus "before" or "after" the table
  }

  return 'SKIP_FOCUS_NOOP'; // the table does NOT have focus
};

/**
 * Returns the focused cell for tables that use `aria-colindex`
 */
exports.getTableSkipFocus = getTableSkipFocus;
const getFocusedAriaColindexCell = ({
  containerElement,
  tableClassName
}) => {
  var _containerElement$que2;
  return (_containerElement$que2 = containerElement === null || containerElement === void 0 ? void 0 : containerElement.querySelector(`.${tableClassName} [aria-colindex]:focus-within`)) !== null && _containerElement$que2 !== void 0 ? _containerElement$que2 : null;
};

/**
 * Returns the focused cell for tables that use `data-colindex`
 */
exports.getFocusedAriaColindexCell = getFocusedAriaColindexCell;
const getFocusedDataColindexCell = ({
  containerElement,
  tableClassName
}) => {
  var _containerElement$que3;
  return (_containerElement$que3 = containerElement === null || containerElement === void 0 ? void 0 : containerElement.querySelector(`.${tableClassName} [data-colindex]:focus-within`)) !== null && _containerElement$que3 !== void 0 ? _containerElement$que3 : null;
};
exports.getFocusedDataColindexCell = getFocusedDataColindexCell;