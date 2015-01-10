"use strict";

/**
 * Handles keyboard navigation for HTML input elements of type "time".
 *
 * @param {HTMLInputElement} element
 *   A HTMLInputElement of type "time".
 * @param {KeyboardEvent} event
 *   A KeyboardEvent of type keydown. keypress events can't be used because IE doesn't trigger keypress events for
 *   keys like TAB and BACKSPACE.
 */
function inputTimeAccessibilityOnKeydownHandleNavigation(element, event) {
  var selectionStart = element.selectionStart;

  switch (event.key) {
    case "Backspace":
    case "U+0008":
    case "Del":
      inputTimeAccessibilityClearComponent(element, selectionStart);
      break;
    case "Tab":
    case "U+0009":
      inputTimeAccessibilityOnTabKeydownHandleNavigation(element, event, selectionStart);
      return;
    case "Left":
      inputTimeAccessibilitySelectPreviousComponent(element, selectionStart);
      break;
    case "Up":
      inputTimeAccessibilityIncreaseComponent(element, selectionStart, 1);
      break;
    case "Right":
      inputTimeAccessibilitySelectNextComponent(element, selectionStart);
      break;
    case "Down":
      inputTimeAccessibilityIncreaseComponent(element, selectionStart, -1);
      break;
    default:
      return;
  }
  event.preventDefault();
}

function inputTimeAccessibilityOnTabKeydownHandleNavigation(element, event, selectionStart) {
  if (event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }
  else if (event.shiftKey) {
    if (0 === selectionStart) {
      inputTimeAccessibilityNormalizeSelectedComponent(element, selectionStart);
      return;
    }
  }
  else if (element.selectionEnd === inputDomOriginalValueGetter.call(element).length) {
    inputTimeAccessibilityNormalizeSelectedComponent(element, selectionStart);
    return;
  }


  if (event.shiftKey) {
    inputTimeAccessibilitySelectPreviousComponent(element, selectionStart);
  }
  else {
    inputTimeAccessibilitySelectNextComponent(element, selectionStart);
  }
  event.preventDefault();
}

/**
 * Handles user input for HTML input elements of type "time".
 *
 * @param {HTMLInputElement} element
 *   A HTMLInputElement of type "time".
 * @param {KeyboardEvent} event
 *   A KeyboardEvent of type keypress. User input should be handled on keypress events because these are triggered
 *   every time an actual character is being inserted (keydown and keyup events are triggered only once).
 */
function inputTimeAccessibilityOnKeyPressHandleUserInput(element, event) {
  var selectionStart, value, components, componentOrder, componentSeparator, selectedComponent, componentMin, componentMax, componentLimit;

  // Only allow numeric input.
  if (47 < event.charCode && 58 > event.charCode) {
    selectionStart = element.selectionStart;

    value = inputDomOriginalValueGetter.call(element);
    components = inputTimeComponentsGet(element);

    componentOrder = inputTimeFormatOrderGetter(element);
    componentSeparator = inputTimeFormatSeparatorGetter(element);
    selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);
    componentMin = inputComponentGetMinimum(element, selectedComponent);
    componentMax = inputComponentGetMaximum(element, selectedComponent);
    componentLimit = componentMax / 10;

    components[selectedComponent] = inputAccessibilityComplementComponent(components[selectedComponent], event.key, componentMin, componentMax, componentLimit);

    value = inputTimeComponentsSet(element, components);

    if (components[selectedComponent] > componentLimit) {
      inputTimeAccessibilitySelectNextComponent(element, selectionStart);
    }
    else {
      inputDomOriginalSetSelectionRange.apply(element, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
    }
  }
  event.preventDefault();
}

function inputTimeAccessibilityOnFocusHandleInputSelection(element, event) {
  var value, selectionStart, componentSeparator;

  value = inputDomOriginalValueGetter.call(element);
  componentSeparator = inputTimeFormatSeparatorGetter(element);

  if (!value) {
    value = inputTimeComponentsSet(element, {
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

  inputDomOriginalSetSelectionRange.apply(element, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
  event.preventDefault();
}

function inputTimeAccessibilityOnBlurHandleInputNormalization(element) {
  inputTimeAccessibilityNormalizeSelectedComponent(element, element.selectionStart);
}

function inputTimeAccessibilityClearComponent(element, selectionStart) {
  var value = inputDomOriginalValueGetter.call(element),
    components = inputTimeComponentsGet(element),
    componentOrder = inputTimeFormatOrderGetter(element),
    componentSeparator = inputTimeFormatSeparatorGetter(element),
    selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);

  components[selectedComponent] = INPUT_TIME_COMPONENT_EMPTY;

  value = inputTimeComponentsSet(element, components);
  inputDomOriginalSetSelectionRange.apply(element, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
}

function inputTimeAccessibilityNormalizeSelectedComponent(element, selectionStart) {
  var value = inputDomOriginalValueGetter.call(element),
    components = inputTimeComponentsGet(element),
    componentOrder = inputTimeFormatOrderGetter(element),
    componentSeparator = inputTimeFormatSeparatorGetter(element),
    selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator),
    componentMax = inputComponentGetMaximum(element, selectedComponent);

  if (components[selectedComponent] > componentMax) {
    components[selectedComponent] = componentMax;
  }

  inputTimeComponentsSet(element, components);
}

function inputTimeAccessibilitySelectPreviousComponent(element, selectionStart) {
  inputTimeAccessibilityNormalizeSelectedComponent(element, selectionStart);

  var value = inputDomOriginalValueGetter.call(element),
    componentSeparator = inputTimeFormatSeparatorGetter(element);

  inputDomOriginalSetSelectionRange.apply(element, inputAccessibilityGetPreviousComponentRange(value, selectionStart, componentSeparator));
}

function inputTimeAccessibilitySelectNextComponent(element, selectionStart) {
  inputTimeAccessibilityNormalizeSelectedComponent(element, selectionStart);

  var value = inputDomOriginalValueGetter.call(element),
    componentSeparator = inputTimeFormatSeparatorGetter(element);

  inputDomOriginalSetSelectionRange.apply(element, inputAccessibilityGetNextComponentRange(value, selectionStart, componentSeparator));
}

function inputTimeAccessibilityIncreaseComponent(element, selectionStart, amount) {
  var value = inputDomOriginalValueGetter.call(element),
    components = inputTimeComponentsGet(element),
    componentOrder = inputTimeFormatOrderGetter(element),
    componentSeparator = inputTimeFormatSeparatorGetter(element),
    selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator),
    componentMin = inputComponentGetMinimum(element, selectedComponent),
    componentMax = inputComponentGetMaximum(element, selectedComponent);

  components[selectedComponent] = inputAccessibilityIncreaseComponent(components[selectedComponent], amount, componentMin, componentMax);

  value = inputTimeComponentsSet(element, components);
  inputDomOriginalSetSelectionRange.apply(element, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
}
