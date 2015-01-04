'use strict';

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
    case 'Backspace':
    case 'U+0008':
    case 'Del':
      inputTimeClearComponent(element, selectionStart);
      break;
    case 'Tab':
    case 'U+0009':
      inputTimeAccessibilityOnTabKeydownHandleNavigation(element, event, selectionStart);
      return;
    case 'Left':
      inputTimeAccessibilitySelectPreviousComponent(element, selectionStart);
      break;
    case 'Up':
      inputTimeAccessibilityIncreaseComponent(element, selectionStart, 1);
      break;
    case 'Right':
      inputTimeAccessibilitySelectNextComponent(element, selectionStart);
      break;
    case 'Down':
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
    if (selectionStart === 0) {
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
  // Only allow numeric input.
  if (event.charCode > 47 && event.charCode < 58) {
    var selectionStart = element.selectionStart,
      selectNext = false,

      value = inputDomOriginalValueGetter.call(element),
      components = inputTimeComponentsGet(element),

      componentOrder = inputTimeFormatOrderGetter(element),
      componentSeparator = inputTimeFormatSeparatorGetter(element),
      selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);

    switch (selectedComponent) {
      case INPUT_TIME_COMPONENT_HOUR:
        components.hour = inputAccessibilityComplementComponent(components.hour, event.key, INPUT_TIME_COMPONENT_HOUR_MIN, INPUT_TIME_COMPONENT_HOUR_MAX, 2);
        if (components.hour > 2) {
          selectNext = true;
        }
        break;
      case INPUT_TIME_COMPONENT_MINUTE:
        components.minute = inputAccessibilityComplementComponent(components.minute, event.key, INPUT_TIME_COMPONENT_MINUTE_MIN, INPUT_TIME_COMPONENT_MINUTE_MAX, 5);
        if (components.minute > 5) {
          selectNext = true;
        }
        break;
      case INPUT_TIME_COMPONENT_SECOND:
        components.second = inputAccessibilityComplementComponent(components.second, event.key, INPUT_TIME_COMPONENT_SECOND_MIN, INPUT_TIME_COMPONENT_SECOND_MAX, 5);
        if (components.second > 5) {
          selectNext = true;
        }
        break;
      case INPUT_TIME_COMPONENT_MILISECOND:
        components.milisecond = inputAccessibilityComplementComponent(components.second, event.key, INPUT_TIME_COMPONENT_MILISECOND_MIN, INPUT_TIME_COMPONENT_MILISECOND_MAX, 99);
        if (components.milisecond > 99) {
          selectNext = true;
        }
        break;
      default:
        return;
    }

    value = inputTimeComponentsSet(element, components.hour, components.minute, components.second, components.milisecond);

    var selection = inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator);
    if (selectNext) {
      inputTimeAccessibilitySelectNextComponent(element, selection[0]);
    }
    else {
      element.setSelectionRange.apply(element, selection);
    }
  }
  event.preventDefault();
}

function inputTimeAccessibilityOnFocusHandleInputSelection(element, event) {
  var componentRange, value, selectionStart, componentSeparator;

  value = inputDomOriginalValueGetter.call(element);
  componentSeparator = inputTimeFormatSeparatorGetter(element);

  if (!value) {
    value = inputTimeComponentsSet(element, INPUT_TIME_COMPONENT_EMPTY, INPUT_TIME_COMPONENT_EMPTY, INPUT_TIME_COMPONENT_HIDDEN, INPUT_TIME_COMPONENT_HIDDEN);
    selectionStart = 0;
  }
  else {
    selectionStart = element.selectionStart;
  }

  componentRange = inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator);

  element.setSelectionRange.apply(element, componentRange);
  event.preventDefault();
}

function inputTimeAccessibilityOnBlurHandleInputNormalization(element) {
  inputTimeAccessibilityNormalizeSelectedComponent(element, element.selectionStart);
}

function inputTimeClearComponent(input, selectionStart) {
  var value = inputDomOriginalValueGetter.call(input),
    components = inputTimeComponentsGet(input),
    componentOrder = inputTimeFormatOrderGetter(input),
    componentSeparator = inputTimeFormatSeparatorGetter(input),
    selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);

  switch (selectedComponent) {
    case INPUT_TIME_COMPONENT_HOUR:
      components.hour = INPUT_TIME_COMPONENT_EMPTY;
      break;
    case INPUT_TIME_COMPONENT_MINUTE:
      components.minute = INPUT_TIME_COMPONENT_EMPTY;
      break;
    case INPUT_TIME_COMPONENT_SECOND:
      components.second = INPUT_TIME_COMPONENT_EMPTY;
      break;
    case INPUT_TIME_COMPONENT_MILISECOND:
      components.milisecond = INPUT_TIME_COMPONENT_EMPTY;
      break;
    default:
      return;
  }

  value = inputTimeComponentsSet(input, components.hour, components.minute, components.second, components.milisecond);
  input.setSelectionRange.apply(input, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
}

function inputTimeAccessibilityNormalizeSelectedComponent(input, selectionStart) {
  var value = inputDomOriginalValueGetter.call(input),
    components = inputTimeComponentsGet(input),
    componentOrder = inputTimeFormatOrderGetter(input),
    componentSeparator = inputTimeFormatSeparatorGetter(input),
    selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);

  switch (selectedComponent) {
    case INPUT_TIME_COMPONENT_HOUR:
      if (components.hour > INPUT_TIME_COMPONENT_HOUR_MAX) {
        components.hour = INPUT_TIME_COMPONENT_HOUR_MAX;
      }
      break;
    case INPUT_TIME_COMPONENT_MINUTE:
      if (components.minute > INPUT_TIME_COMPONENT_MINUTE_MAX) {
        components.minute = INPUT_TIME_COMPONENT_MINUTE_MAX;
      }
      break;
    case INPUT_TIME_COMPONENT_SECOND:
      if (components.second > INPUT_TIME_COMPONENT_SECOND_MAX) {
        components.second = INPUT_TIME_COMPONENT_SECOND_MAX;
      }
      break;
    case INPUT_TIME_COMPONENT_MILISECOND:
      if (components.milisecond > INPUT_TIME_COMPONENT_MILISECOND_MAX) {
        components.milisecond = INPUT_TIME_COMPONENT_MILISECOND_MAX;
      }
      break;
    default:
      return;
  }

  inputTimeComponentsSet(input, components.hour, components.minute, components.second, components.milisecond);
}

function inputTimeAccessibilitySelectPreviousComponent(element, selectionStart) {
  inputTimeAccessibilityNormalizeSelectedComponent(element, selectionStart);

  var value = inputDomOriginalValueGetter.call(element),
    componentSeparator = inputTimeFormatSeparatorGetter(element),
    selection = inputAccessibilityGetPreviousComponentRange(value, selectionStart, componentSeparator);

  element.setSelectionRange(selection[0], selection[1]);
}

function inputTimeAccessibilitySelectNextComponent(element, selectionStart) {
  inputTimeAccessibilityNormalizeSelectedComponent(element, selectionStart);

  var value = inputDomOriginalValueGetter.call(element),
    componentSeparator = inputTimeFormatSeparatorGetter(element),
    selection = inputAccessibilityGetNextComponentRange(value, selectionStart, componentSeparator);

  element.setSelectionRange(selection[0], selection[1]);
}

function inputTimeAccessibilityIncreaseComponent(input, selectionStart, amount) {
  var value = inputDomOriginalValueGetter.call(input),
    components = inputTimeComponentsGet(input),
    componentOrder = inputTimeFormatOrderGetter(input),
    componentSeparator = inputTimeFormatSeparatorGetter(input),
    selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);

  switch (selectedComponent) {
    case INPUT_TIME_COMPONENT_HOUR:
      components.hour = inputAccessibilityIncreaseComponent(components.hour, amount, INPUT_TIME_COMPONENT_HOUR_MIN, INPUT_TIME_COMPONENT_HOUR_MAX);
      break;
    case INPUT_TIME_COMPONENT_MINUTE:
      components.minute = inputAccessibilityIncreaseComponent(components.minute, amount, INPUT_TIME_COMPONENT_MINUTE_MIN, INPUT_TIME_COMPONENT_MINUTE_MAX);
      break;
    case INPUT_TIME_COMPONENT_SECOND:
      components.second = inputAccessibilityIncreaseComponent(components.second, amount, INPUT_TIME_COMPONENT_SECOND_MIN, INPUT_TIME_COMPONENT_SECOND_MAX);
      break;
    case INPUT_TIME_COMPONENT_MILISECOND:
      components.milisecond = inputAccessibilityIncreaseComponent(components.milisecond, amount, INPUT_TIME_COMPONENT_MILISECOND_MIN, INPUT_TIME_COMPONENT_MILISECOND_MAX);
      break;
    default:
      return;
  }

  value = inputTimeComponentsSet(input, components.hour, components.minute, components.second, components.milisecond);
  input.setSelectionRange.apply(input, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
}
