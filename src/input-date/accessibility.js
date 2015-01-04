'use strict';

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
    case 'Backspace':
    case 'U+0008':
    case 'Del':
      inputDateClearDateComponent(element, selectionStart);
      break;
    case 'Tab':
    case 'U+0009':
      inputDateAccessibilityOnTabKeydownHandleNavigation(element, event, selectionStart);
      return;
    case 'Left':
      inputDateAccessibilityNormalizeSelectedComponent(element, selectionStart);
      inputDateAccessibilitySelectPreviousDateComponent(element, selectionStart);
      break;
    case 'Up':
      inputDateAccessibilityIncreaseDateComponent(element, selectionStart, 1);
      break;
    case 'Right':
      inputDateAccessibilityNormalizeSelectedComponent(element, selectionStart);
      inputDateAccessibilitySelectNextDateComponent(element, selectionStart);
      break;
    case 'Down':
      inputDateAccessibilityIncreaseDateComponent(element, selectionStart, -1);
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
    if (inputAccessibilityGetSelectedComponentNumber(inputDomOriginalValueGetter.call(element), selectionStart, inputDateFormatSeparatorGetter(element)) !== 0) {
      inputDateAccessibilitySelectPreviousDateComponent(element, selectionStart);
    }
    else {
      return;
    }
  }
  else if (inputAccessibilityGetSelectedComponentNumber(inputDomOriginalValueGetter.call(element), selectionStart, inputDateFormatSeparatorGetter(element)) !== 2) {
    inputDateAccessibilitySelectNextDateComponent(element, selectionStart);
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
  // Only allow numeric input.
  if (event.charCode > 47 && event.charCode < 58) {
    var selectionStart = element.selectionStart;
    var selectNext = false;

    var value = inputDomOriginalValueGetter.call(element),
      components = inputDateComponentsGet(element),

      componentOrder = inputDateFormatOrderGetter(element),
      componentSeparator = inputDateFormatSeparatorGetter(element),
      selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);

    switch (selectedComponent) {
      case DATECOMPONENT_YEAR:
        components.year = parseInt((components.year + event.key).substr(-6), 10);
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
      default:
        return;
    }

    value = inputDateComponentsSet(element, components.year, components.month, components.day);

    var selection = inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator);
    if (selectNext) {
      inputDateAccessibilitySelectNextDateComponent(element, selection[0], selection[1]);
    }
    else {
      element.setSelectionRange.apply(element, selection);
    }
  }
  event.preventDefault();
}

function inputDateAccessibilityOnFocusHandleInputSelection(element, event) {
  var componentRange, value, selectionStart, componentSeparator;

  value = inputDomOriginalValueGetter.call(element);
  componentSeparator = inputDateFormatSeparatorGetter(element);

  if (!value) {
    value = inputDateComponentsSet(element, INPUT_DATE_YEAR_EMPTY, INPUT_DATE_MONTH_EMPTY, INPUT_DATE_DAY_EMPTY);
    selectionStart = 0;
  }
  else {
    selectionStart = element.selectionStart;
  }

  componentRange = inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator);

  element.setSelectionRange.apply(element, componentRange);
  event.preventDefault();
}

function inputDateAccessibilityOnBlurHandleInputNormalization(element) {
  inputDateAccessibilityNormalizeSelectedComponent(element, element.selectionStart);
}

function inputDateClearDateComponent(input, selectionStart) {
  var value = inputDomOriginalValueGetter.call(input),
    components = inputDateComponentsGet(input),
    componentOrder = inputDateFormatOrderGetter(input),
    componentSeparator = inputDateFormatSeparatorGetter(input),
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
    default:
      return;
  }

  value = inputDateComponentsSet(input, components.year, components.month, components.day);
  input.setSelectionRange.apply(input, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
}

function inputDateAccessibilityNormalizeSelectedComponent(input, selectionStart) {
  var value = inputDomOriginalValueGetter.call(input),
    components = inputDateComponentsGet(input),
    componentOrder = inputDateFormatOrderGetter(input),
    componentSeparator = inputDateFormatSeparatorGetter(input),
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
    default:
      return;
  }

  inputDateComponentsSet(input, components.year, components.month, components.day);
}

function inputDateAccessibilitySelectPreviousDateComponent(input, selectionStart) {
  var value = inputDomOriginalValueGetter.call(input),
    componentSeparator = inputDateFormatSeparatorGetter(input),
    selection = inputAccessibilityGetPreviousComponentRange(value, selectionStart, componentSeparator);

  input.setSelectionRange(selection[0], selection[1]);
}

function inputDateAccessibilitySelectNextDateComponent(input, selectionStart) {
  var value = inputDomOriginalValueGetter.call(input),
    componentSeparator = inputDateFormatSeparatorGetter(input),
    selection = inputAccessibilityGetNextComponentRange(value, selectionStart, componentSeparator);

  input.setSelectionRange(selection[0], selection[1]);
}

function inputDateAccessibilityIncreaseDateComponent(input, selectionStart, amount) {
  var value = inputDomOriginalValueGetter.call(input),
    components = inputDateComponentsGet(input),
    componentOrder = inputDateFormatOrderGetter(input),
    componentSeparator = inputDateFormatSeparatorGetter(input),
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
    default:
      return;
  }

  value = inputDateComponentsSet(input, components.year, components.month, components.day);
  input.setSelectionRange.apply(input, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
}
