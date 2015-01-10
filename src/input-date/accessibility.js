"use strict";

/**
 * Handles keyboard navigation for HTML input elements of type "date".
 *
 * @param {HTMLInputElement} element
 *   A HTMLInputElement of type "date".
 * @param {KeyboardEvent} event
 *   A KeyboardEvent of type keydown. keypress events can't be used because IE doesn't trigger keypress events for
 *   keys like TAB and BACKSPACE.
 */
function inputDateAccessibilityOnKeydownHandleNavigation(element, event) {
  var selectionStart = element.selectionStart;

  switch (event.key) {
    case "Backspace":
    case "U+0008":
    case "Del":
      inputDateAccessibilityClearComponent(element, selectionStart);
      break;
    case "Tab":
    case "U+0009":
      inputDateAccessibilityOnTabKeydownHandleNavigation(element, event, selectionStart);
      return;
    case "Left":
      inputDateAccessibilityNormalizeSelectedComponent(element, selectionStart);
      inputDateAccessibilitySelectPreviousComponent(element, selectionStart);
      break;
    case "Up":
      inputDateAccessibilityIncreaseComponent(element, selectionStart, 1);
      break;
    case "Right":
      inputDateAccessibilityNormalizeSelectedComponent(element, selectionStart);
      inputDateAccessibilitySelectNextComponent(element, selectionStart);
      break;
    case "Down":
      inputDateAccessibilityIncreaseComponent(element, selectionStart, -1);
      break;
    default:
      return;
  }
  event.preventDefault();
}

function inputDateAccessibilityOnTabKeydownHandleNavigation(element, event, selectionStart) {
  inputDateAccessibilityNormalizeSelectedComponent(element, selectionStart);
  if (event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }

  if (event.shiftKey) {
    if (0 !== inputAccessibilityGetSelectedComponentNumber(inputDomOriginalValueGetter.call(element), selectionStart, inputDateFormatSeparatorGetter(element))) {
      inputDateAccessibilitySelectPreviousComponent(element, selectionStart);
    }
    else {
      return;
    }
  }
  else if (2 !== inputAccessibilityGetSelectedComponentNumber(inputDomOriginalValueGetter.call(element), selectionStart, inputDateFormatSeparatorGetter(element))) {
    inputDateAccessibilitySelectNextComponent(element, selectionStart);
  }
  else {
    return;
  }
  event.preventDefault();
}

/**
 * Handles user input for HTML input elements of type "date".
 *
 * @param {HTMLInputElement} element
 *   A HTMLInputElement of type "date".
 * @param {KeyboardEvent} event
 *   A KeyboardEvent of type keypress. User input should be handled on keypress events because these are triggered
 *   every time an actual character is being inserted (keydown and keyup events are triggered only once).
 */
function inputDateAccessibilityOnKeyPressHandleUserInput(element, event) {
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

    value = inputDateComponentsSet(element, components);

    if (components[selectedComponent] > componentLimit) {
      inputDateAccessibilitySelectNextComponent(element, selectionStart);
    }
    else {
      inputDomOriginalSetSelectionRange.apply(element, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
    }
  }
  event.preventDefault();
}

function inputDateAccessibilityOnFocusHandleInputSelection(element, event) {
  var componentRange, value, selectionStart, componentSeparator;

  value = inputDomOriginalValueGetter.call(element);
  componentSeparator = inputDateFormatSeparatorGetter(element);

  if (!value) {
    value = inputDateComponentsSet(element, {yy: INPUT_DATE_YEAR_EMPTY, mm: INPUT_DATE_MONTH_EMPTY, dd: INPUT_DATE_DAY_EMPTY});
    selectionStart = 0;
  }
  else {
    selectionStart = element.selectionStart;
  }

  componentRange = inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator);

  inputDomOriginalSetSelectionRange.apply(element, componentRange);
  event.preventDefault();
}

function inputDateAccessibilityOnBlurHandleInputNormalization(element) {
  inputDateAccessibilityNormalizeSelectedComponent(element, element.selectionStart);
}

function inputDateAccessibilityClearComponent(element, selectionStart) {
  var value = inputDomOriginalValueGetter.call(element),
    components = inputDateComponentsGet(element),
    componentOrder = inputDateFormatOrderGetter(element),
    componentSeparator = inputDateFormatSeparatorGetter(element),
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
    default:
      return;
  }

  value = inputDateComponentsSet(element, components);
  inputDomOriginalSetSelectionRange.apply(element, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
}

function inputDateAccessibilityNormalizeSelectedComponent(element, selectionStart) {
  var value = inputDomOriginalValueGetter.call(element),
    components = inputDateComponentsGet(element),
    componentOrder = inputDateFormatOrderGetter(element),
    componentSeparator = inputDateFormatSeparatorGetter(element),
    selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator),
    componentMax = inputComponentGetMaximum(element, selectedComponent);

  if (components[selectedComponent] > componentMax) {
    components[selectedComponent] = componentMax;
  }

  inputDateComponentsSet(element, components);
}

function inputDateAccessibilitySelectPreviousComponent(element, selectionStart) {
  var value = inputDomOriginalValueGetter.call(element),
    componentSeparator = inputDateFormatSeparatorGetter(element),
    selection = inputAccessibilityGetPreviousComponentRange(value, selectionStart, componentSeparator);

  inputDomOriginalSetSelectionRange.apply(element, selection);
}

function inputDateAccessibilitySelectNextComponent(element, selectionStart) {
  var value = inputDomOriginalValueGetter.call(element),
    componentSeparator = inputDateFormatSeparatorGetter(element),
    selection = inputAccessibilityGetNextComponentRange(value, selectionStart, componentSeparator);

  inputDomOriginalSetSelectionRange.apply(element, selection);
}

function inputDateAccessibilityIncreaseComponent(element, selectionStart, amount) {
  var value = inputDomOriginalValueGetter.call(element),
    components = inputDateComponentsGet(element),
    componentOrder = inputDateFormatOrderGetter(element),
    componentSeparator = inputDateFormatSeparatorGetter(element),
    selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator),
    componentMin = inputComponentGetMinimum(element, selectedComponent),
    componentMax = inputComponentGetMaximum(element, selectedComponent);

  components[selectedComponent] = inputAccessibilityIncreaseComponent(components[selectedComponent], amount, componentMin, componentMax);

  value = inputDateComponentsSet(element, components);
  inputDomOriginalSetSelectionRange.apply(element, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
}
