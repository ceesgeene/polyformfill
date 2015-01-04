'use strict';

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
    case 'Backspace':
    case 'U+0008':
    case 'Del':
      inputDatetimeLocalClearComponent(element, selectionStart);
      break;
    case 'Tab':
    case 'U+0009':
      inputDatetimeLocalAccessibilityOnTabKeydownHandleNavigation(element, event, selectionStart);
      return;
    case 'Left':
      inputDatetimeLocalAccessibilitySelectPreviousComponent(element, selectionStart);
      break;
    case 'Up':
      inputDatetimeLocalAccessibilityIncreaseComponent(element, selectionStart, 1);
      break;
    case 'Right':
      inputDatetimeLocalAccessibilitySelectNextComponent(element, selectionStart);
      break;
    case 'Down':
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
    if (selectionStart === 0) {
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
  // Only allow numeric input.
  if (event.charCode > 47 && event.charCode < 58) {
    var selectionStart = element.selectionStart,
      selectNext = false,

      value = inputDomOriginalValueGetter.call(element),
      components = inputDatetimeLocalComponentsGet(element),

      componentOrder = inputDatetimeLocalFormatOrderGetter(element),
      componentSeparator = inputDatetimeLocalFormatSeparatorGetter(element),
      selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);

    switch (selectedComponent) {
      case DATECOMPONENT_YEAR:
        components.year = inputAccessibilityComplementComponent(components.year, event.key, INPUT_DATE_YEAR_MIN, INPUT_DATE_YEAR_MAX, 27576);
        if (components.year > 27576) {
          selectNext = true;
        }
        break;
      case DATECOMPONENT_MONTH:
        components.month = inputAccessibilityComplementComponent(components.month, event.key, INPUT_DATE_MONTH_MIN, INPUT_DATE_MONTH_MAX, 0);
        if (components.month > 0) {
          selectNext = true;
        }
        break;
      case DATECOMPONENT_DAY:
        components.day = inputAccessibilityComplementComponent(components.day, event.key, INPUT_DATE_DAY_MIN, INPUT_DATE_DAY_MAX, 3);
        if (components.day > 3) {
          selectNext = true;
        }
        break;

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

    value = inputDatetimeLocalComponentsSet(element, components.year, components.month, components.day, components.hour, components.minute, components.second, components.milisecond);

    var selection = inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator);
    if (selectNext) {
      inputDatetimeLocalAccessibilitySelectNextComponent(element, selection[0]);
    }
    else {
      element.setSelectionRange.apply(element, selection);
    }
  }
  event.preventDefault();
}

function inputDatetimeLocalAccessibilityOnFocusHandleInputSelection(element, event) {
  var componentRange, value, selectionStart, componentSeparator;

  value = inputDomOriginalValueGetter.call(element);
  componentSeparator = inputDatetimeLocalFormatSeparatorGetter(element);

  if (!value) {
    value = inputDatetimeLocalComponentsSet(element, INPUT_DATE_YEAR_EMPTY, INPUT_DATE_MONTH_EMPTY, INPUT_DATE_DAY_EMPTY, INPUT_TIME_COMPONENT_EMPTY, INPUT_TIME_COMPONENT_EMPTY, INPUT_TIME_COMPONENT_HIDDEN, INPUT_TIME_COMPONENT_HIDDEN);
    selectionStart = 0;
  }
  else {
    selectionStart = element.selectionStart;
  }

  componentRange = inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator);

  element.setSelectionRange.apply(element, componentRange);
  event.preventDefault();
}

function inputDatetimeLocalAccessibilityOnBlurHandleInputNormalization(element) {
  inputDatetimeLocalAccessibilityNormalizeSelectedComponent(element, element.selectionStart);
}

function inputDatetimeLocalClearComponent(input, selectionStart) {
  var value = inputDomOriginalValueGetter.call(input),
    components = inputDatetimeLocalComponentsGet(input),
    componentOrder = inputDatetimeLocalFormatOrderGetter(input),
    componentSeparator = inputDatetimeLocalFormatSeparatorGetter(input),
    selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);

  switch (selectedComponent) {
    case DATECOMPONENT_YEAR:
      components.year = INPUT_DATE_YEAR_EMPTY;
      break;
    case DATECOMPONENT_MONTH:
      components.month = INPUT_DATE_MONTH_EMPTY;
      break;
    case DATECOMPONENT_DAY:
      components.day = INPUT_DATE_DAY_EMPTY;
      break;

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

  value = inputDatetimeLocalComponentsSet(input, components.year, components.month, components.day, components.hour, components.minute, components.second, components.milisecond);
  input.setSelectionRange.apply(input, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
}

function inputDatetimeLocalAccessibilityNormalizeSelectedComponent(input, selectionStart) {
  var value = inputDomOriginalValueGetter.call(input),
    components = inputDatetimeLocalComponentsGet(input),
    componentOrder = inputDatetimeLocalFormatOrderGetter(input),
    componentSeparator = inputDatetimeLocalFormatSeparatorGetter(input),
    selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);

  switch (selectedComponent) {
    case DATECOMPONENT_YEAR:
      if (components.year > INPUT_DATE_YEAR_MAX) {
        components.year = INPUT_DATE_YEAR_MAX;
      }
      break;
    case DATECOMPONENT_MONTH:
      if (components.month > INPUT_DATE_MONTH_MAX) {
        components.month = INPUT_DATE_MONTH_MAX;
      }
      break;
    case DATECOMPONENT_DAY:
      if (components.day > INPUT_DATE_DAY_MAX) {
        components.day = INPUT_DATE_DAY_MAX;
      }
      break;

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

  inputDatetimeLocalComponentsSet(input, components.year, components.month, components.day, components.hour, components.minute, components.second, components.milisecond);
}

function inputDatetimeLocalAccessibilitySelectPreviousComponent(element, selectionStart) {
  inputDatetimeLocalAccessibilityNormalizeSelectedComponent(element, selectionStart);

  var value = inputDomOriginalValueGetter.call(element),
    componentSeparator = inputDatetimeLocalFormatSeparatorGetter(element),
    selection = inputAccessibilityGetPreviousComponentRange(value, selectionStart, componentSeparator);

  element.setSelectionRange(selection[0], selection[1]);
}

function inputDatetimeLocalAccessibilitySelectNextComponent(element, selectionStart) {
  inputDatetimeLocalAccessibilityNormalizeSelectedComponent(element, selectionStart);

  var value = inputDomOriginalValueGetter.call(element),
    componentSeparator = inputDatetimeLocalFormatSeparatorGetter(element),
    selection = inputAccessibilityGetNextComponentRange(value, selectionStart, componentSeparator);

  element.setSelectionRange(selection[0], selection[1]);
}

function inputDatetimeLocalAccessibilityIncreaseComponent(input, selectionStart, amount) {
  var value = inputDomOriginalValueGetter.call(input),
    components = inputDatetimeLocalComponentsGet(input),
    componentOrder = inputDatetimeLocalFormatOrderGetter(input),
    componentSeparator = inputDatetimeLocalFormatSeparatorGetter(input),
    selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);

  switch (selectedComponent) {
    case DATECOMPONENT_YEAR:
      components.year = inputAccessibilityIncreaseComponent(components.year, amount, INPUT_DATE_YEAR_MIN, INPUT_DATE_YEAR_MAX);
      break;
    case DATECOMPONENT_MONTH:
      components.month = inputAccessibilityIncreaseComponent(components.month, amount, INPUT_DATE_MONTH_MIN, INPUT_DATE_MONTH_MAX);
      break;
    case DATECOMPONENT_DAY:
      components.day = inputAccessibilityIncreaseComponent(components.day, amount, INPUT_DATE_DAY_MIN, INPUT_DATE_DAY_MAX);
      break;

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

  value = inputDatetimeLocalComponentsSet(input, components.year, components.month, components.day, components.hour, components.minute, components.second, components.milisecond);
  input.setSelectionRange.apply(input, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
}
