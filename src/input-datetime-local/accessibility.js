"use strict";

/**
 * Handles keyboard navigation for HTML input elements of type "datetime-local".
 *
 * @param {HTMLInputElement} element
 *   A HTMLInputElement of type "datetime-local".
 * @param {KeyboardEvent} event
 *   A KeyboardEvent of type keydown. keypress events can't be used because IE doesn't trigger keypress events for
 *   keys like TAB and BACKSPACE.
 */
function inputDatetimeLocalAccessibilityOnKeydownHandleNavigation(element, event) {
  var selectionStart = element.selectionStart;

  switch (event.key) {
    case "Backspace":
    case "U+0008":
    case "Del":
      inputDatetimeLocalClearComponent(element, selectionStart);
      break;
    case "Tab":
    case "U+0009":
      inputDatetimeLocalAccessibilityOnTabKeydownHandleNavigation(element, event, selectionStart);
      return;
    case "Left":
      inputDatetimeLocalAccessibilitySelectPreviousComponent(element, selectionStart);
      break;
    case "Up":
      inputDatetimeLocalAccessibilityIncreaseComponent(element, selectionStart, 1);
      break;
    case "Right":
      inputDatetimeLocalAccessibilitySelectNextComponent(element, selectionStart);
      break;
    case "Down":
      inputDatetimeLocalAccessibilityIncreaseComponent(element, selectionStart, -1);
      break;
    default:
      return;
  }
  event.preventDefault();
}

function inputDatetimeLocalAccessibilityOnTabKeydownHandleNavigation(element, event, selectionStart) {
  if (event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }
  else if (event.shiftKey) {
    if (0 === selectionStart) {
      inputDatetimeLocalAccessibilityNormalizeSelectedComponent(element, selectionStart);
      return;
    }
  }
  else if (element.selectionEnd === inputDomOriginalValueGetter.call(element).length) {
    inputDatetimeLocalAccessibilityNormalizeSelectedComponent(element, selectionStart);
    return;
  }


  if (event.shiftKey) {
    inputDatetimeLocalAccessibilitySelectPreviousComponent(element, selectionStart);
  }
  else {
    inputDatetimeLocalAccessibilitySelectNextComponent(element, selectionStart);
  }
  event.preventDefault();
}

/**
 * Handles user input for HTML input elements of type "datetime-local".
 *
 * @param {HTMLInputElement} element
 *   A HTMLInputElement of type "datetime-local".
 * @param {KeyboardEvent} event
 *   A KeyboardEvent of type keypress. User input should be handled on keypress events because these are triggered
 *   every time an actual character is being inserted (keydown and keyup events are triggered only once).
 */
function inputDatetimeLocalAccessibilityOnKeyPressHandleUserInput(element, event) {
  var selectionStart, value, components, componentOrder, componentSeparator, selectedComponent, componentMin, componentMax, componentLimit;

  // Only allow numeric input.
  if (47 < event.charCode && 58 > event.charCode) {
    selectionStart = element.selectionStart;

    value = inputDomOriginalValueGetter.call(element);
    components = inputDateComponentsGet(element);

    componentOrder = inputDateFormatOrderGetter(element);
    componentSeparator = inputDateFormatSeparatorGetter(element);
    selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);
    componentMin = inputComponentGetMinimum(element, selectedComponent);
    componentMax = inputComponentGetMaximum(element, selectedComponent);
    componentLimit = componentMax / 10;

    components[selectedComponent] = inputAccessibilityComplementComponent(components[selectedComponent], event.key, componentMin, componentMax, componentLimit);

    value = inputDatetimeLocalComponentsSet(element, components);

    if (components[selectedComponent] > componentLimit) {
      inputDatetimeLocalAccessibilitySelectNextComponent(element, selectionStart);
    }
    else {
      inputDomOriginalSetSelectionRange.apply(element, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
    }
  }
  event.preventDefault();
}

function inputDatetimeLocalAccessibilityOnFocusHandleInputSelection(element, event) {
  var componentRange, value, selectionStart, componentSeparator;

  value = inputDomOriginalValueGetter.call(element);
  componentSeparator = inputDatetimeLocalFormatSeparatorGetter(element);

  if (!value) {
    value = inputDatetimeLocalComponentsSet(element, {
      yy: INPUT_DATE_YEAR_EMPTY,
      mm: INPUT_DATE_MONTH_EMPTY,
      dd: INPUT_DATE_DAY_EMPTY,
      hh: INPUT_TIME_COMPONENT_EMPTY,
      ii: INPUT_TIME_COMPONENT_EMPTY,
      ss: INPUT_TIME_COMPONENT_HIDDEN,
      ms: INPUT_TIME_COMPONENT_HIDDEN
    });
    selectionStart = 0;
  }
  else {
    selectionStart = element.selectionStart;
  }

  componentRange = inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator);

  inputDomOriginalSetSelectionRange.apply(element, componentRange);
  event.preventDefault();
}

function inputDatetimeLocalAccessibilityOnBlurHandleInputNormalization(element) {
  inputDatetimeLocalAccessibilityNormalizeSelectedComponent(element, element.selectionStart);
}

function inputDatetimeLocalClearComponent(element, selectionStart) {
  var value = inputDomOriginalValueGetter.call(element),
    components = inputDatetimeLocalComponentsGet(element),
    componentOrder = inputDatetimeLocalFormatOrderGetter(element),
    componentSeparator = inputDatetimeLocalFormatSeparatorGetter(element),
    selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);

  switch (selectedComponent) {
    case INPUT_COMPONENT_YEAR:
      components.yy = INPUT_DATE_YEAR_EMPTY;
      break;
    case INPUT_COMPONENT_MONTH:
      components.mm = INPUT_DATE_MONTH_EMPTY;
      break;
    case INPUT_COMPONENT_DAY:
      components.dd = INPUT_DATE_DAY_EMPTY;
      break;

    case INPUT_COMPONENT_HOUR:
      components.hh = INPUT_TIME_COMPONENT_EMPTY;
      break;
    case INPUT_COMPONENT_MINUTE:
      components.ii = INPUT_TIME_COMPONENT_EMPTY;
      break;
    case INPUT_COMPONENT_SECOND:
      components.ss = INPUT_TIME_COMPONENT_EMPTY;
      break;
    case INPUT_COMPONENT_MILISECOND:
      components.ms = INPUT_TIME_COMPONENT_EMPTY;
      break;
    default:
      return;
  }

  value = inputDatetimeLocalComponentsSet(element, components);
  inputDomOriginalSetSelectionRange.apply(element, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
}

function inputDatetimeLocalAccessibilityNormalizeSelectedComponent(element, selectionStart) {
  var value = inputDomOriginalValueGetter.call(element),
    components = inputDatetimeLocalComponentsGet(element),
    componentOrder = inputDatetimeLocalFormatOrderGetter(element),
    componentSeparator = inputDatetimeLocalFormatSeparatorGetter(element),
    selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator),
    componentMax = inputComponentGetMaximum(element, selectedComponent);

  if (components[selectedComponent] > componentMax) {
    components[selectedComponent] = componentMax;
  }

  inputDatetimeLocalComponentsSet(element, components);
}

function inputDatetimeLocalAccessibilitySelectPreviousComponent(element, selectionStart) {
  inputDatetimeLocalAccessibilityNormalizeSelectedComponent(element, selectionStart);

  var value = inputDomOriginalValueGetter.call(element),
    componentSeparator = inputDatetimeLocalFormatSeparatorGetter(element),
    selection = inputAccessibilityGetPreviousComponentRange(value, selectionStart, componentSeparator);

  inputDomOriginalSetSelectionRange.apply(element, selection);
}

function inputDatetimeLocalAccessibilitySelectNextComponent(element, selectionStart) {
  inputDatetimeLocalAccessibilityNormalizeSelectedComponent(element, selectionStart);

  var value = inputDomOriginalValueGetter.call(element),
    componentSeparator = inputDatetimeLocalFormatSeparatorGetter(element),
    selection = inputAccessibilityGetNextComponentRange(value, selectionStart, componentSeparator);

  inputDomOriginalSetSelectionRange.apply(element, selection);
}

function inputDatetimeLocalAccessibilityIncreaseComponent(element, selectionStart, amount) {
  var value = inputDomOriginalValueGetter.call(element),
    components = inputDatetimeLocalComponentsGet(element),
    componentOrder = inputDatetimeLocalFormatOrderGetter(element),
    componentSeparator = inputDatetimeLocalFormatSeparatorGetter(element),
    selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator),
    componentMin = inputComponentGetMinimum(element, selectedComponent),
    componentMax = inputComponentGetMaximum(element, selectedComponent);

  components[selectedComponent] = inputAccessibilityIncreaseComponent(components[selectedComponent], amount, componentMin, componentMax);

  value = inputDatetimeLocalComponentsSet(element, components);
  inputDomOriginalSetSelectionRange.apply(element, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
}
