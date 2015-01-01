'use strict';

/* global window, HTMLInputElement */

/**
 * @file
 * Provides accessibility features for a number of HTML input elements.
 *
 * While the W3C Technical Report on HTML does not specify such features, it does recommend browsers to implement
 * (localized) user interfaces for input types representing dates, times, and numbers. This is exactly what browsers do
 * that already support input types such as "date" and "time".
 *
 * @see {@link http://www.w3.org/TR/html/forms.html#input-author-notes}
 * @see {@link http://www.w3.org/TR/html/forms.html#input-impl-notes}
 */

function initInputAccessibility() {
  // Binding event handlers to the window (instead of to each input element) to closely emulate native behavior (e.g. so
  // that other scripts can override it).
  window.addEventListener('keydown', inputAccessibilityOnKeydownHandleNavigation);
  window.addEventListener('keypress', inputAccessibilityOnKeyPressHandleUserInput);

  window.addEventListener('focus', inputAccessibilityOnFocusHandleInputSelection, true);
  window.addEventListener('focusin', inputAccessibilityOnFocusHandleInputSelection);

  window.addEventListener('click', inputAccessibilityOnFocusHandleInputSelection);

  window.addEventListener('blur', inputAccessibilityOnBlurHandleInputNormalization, true);
  //window.addEventListener('focusout', inputAccessibilityOnBlurHandleInputNormalization);
}

/**
 * Handles keyboard navigation for HTML input elements.
 *
 * Keypress events can't be used because IE doesn't trigger keypress events for keys like TAB and BACKSPACE.
 *
 * @param event
 *   A KeyboardEvent of type keydown.
 */
function inputAccessibilityOnKeydownHandleNavigation(event) {
  if (event.defaultPrevented) {
    return;
  }

  // Returning early if the user input is irrelevant for this event handler.
  if (event.charCode) {
    return;
  }

  if (event.target instanceof HTMLInputElement) {
    switch (event.target.getAttribute(INPUT_ATTR_TYPE)) {
      case 'date':
        inputDateAccessibilityOnKeydownHandleNavigation(event.target, event);
        break;
      case 'time':
        inputTimeAccessibilityOnKeydownHandleNavigation(event.target, event);
        break;
      default:
        break;
    }
  }
}

/**
 * Handles user input for HTML input elements.
 *
 * User input should be handled on keypress events because these are triggered every time an actual character is being
 * inserted (keydown and keyup events are triggered only once).
 *
 * @param event
 *   A KeyboardEvent of type keypress.
 */
function inputAccessibilityOnKeyPressHandleUserInput(event) {
  if (event.defaultPrevented) {
    return;
  }

  // Returning early if the user input is irrelevant for this event handler.
  if (event.altKey || event.ctrlKey || event.shiftKey || event.metaKey || !event.charCode) {
    return;
  }

  if (event.target instanceof HTMLInputElement) {
    switch (event.target.getAttribute(INPUT_ATTR_TYPE)) {
      case 'date':
        inputDateAccessibilityOnKeyPressHandleUserInput(event.target, event);
        break;
      case 'time':
        inputTimeAccessibilityOnKeyPressHandleUserInput(event.target, event);
        break;
      default:
        break;
    }
  }
}

function inputAccessibilityOnFocusHandleInputSelection(event) {
  if (event.target instanceof HTMLInputElement) {
    switch (event.target.getAttribute(INPUT_ATTR_TYPE)) {
      case 'date':
        inputDateAccessibilityOnFocusHandleInputSelection(event.target, event);
        break;
      case 'time':
        inputTimeAccessibilityOnFocusHandleInputSelection(event.target, event);
        break;
      default:
        break;
    }
  }
}

function inputAccessibilityOnBlurHandleInputNormalization(event) {
  if (event.target instanceof HTMLInputElement) {
    switch (event.target.getAttribute(INPUT_ATTR_TYPE)) {
      case 'date':
        inputDateAccessibilityOnBlurHandleInputNormalization(event.target);
        break;
      case 'time':
        inputTimeAccessibilityOnBlurHandleInputNormalization(event.target);
        break;
      default:
        break;
    }
  }
}

function inputAccessibilityIncreaseComponent(value, amount, min, max) {
  value += amount;
  if (value > max) {
    value = min;
  }
  else if (value < min) {
    value = max;
  }
  return value;
}


function inputAccessibilityComplementComponent(value, addition, min, max, limit) {
  if (value > limit) {
    value = parseInt(addition, 10);
    if (min === 0) {
      value -= 1;
    }
  }
  else if (min === 0) {
    value = parseInt('' + (value + 1) + addition, 10) - 1;
  }
  else {
    value = parseInt('' + value + addition, 10);
  }
  if (value > max) {
    value = max;
  }
  return value;
}

function inputAccessibilityPreviousSeparator(value, position, componentSeparators) {
  var previous = 0, test, i, componentSeparatorsCount = componentSeparators.length;

  for (i = 0; i < componentSeparatorsCount; i++) {
    test = value.lastIndexOf(componentSeparators[i], position - 1) + 1;
    if (test > previous) {
      previous = test;
    }
  }

  return previous;
}

function inputAccessibilityNextSeparator(value, position, componentSeparators) {
  var next = value.length, test, i, componentSeparatorsCount = componentSeparators.length;

  for (i = 0; i < componentSeparatorsCount; i++) {
    test = value.indexOf(componentSeparators[i], position);
    if (test < next && test !== -1) {
      next = test;
    }
  }

  return next;
}

function inputAccessibilityGetComponentRange(value, position, componentSeparators) {
  var start = inputAccessibilityPreviousSeparator(value, position, componentSeparators),
    end = inputAccessibilityNextSeparator(value, position, componentSeparators);

  return [start, end];
}

function inputAccessibilityGetPreviousComponentRange(value, position, componentSeparators) {
  var start, end;

  end = inputAccessibilityPreviousSeparator(value, position, componentSeparators);
  if (end === 0) {
    start = end;
    end = inputAccessibilityNextSeparator(value, position, componentSeparators);
  }
  else {
    end = end - 1;
    start = inputAccessibilityPreviousSeparator(value, end, componentSeparators);
  }

  return [start, end];
}

function inputAccessibilityGetNextComponentRange(value, position, componentSeparators) {
  var start, end;

  start = inputAccessibilityNextSeparator(value, position, componentSeparators);
  if (start === value.length) {
    end = start;
    start = inputAccessibilityPreviousSeparator(value, position, componentSeparators);
  }
  else {
    start = start + 1;
    end = inputAccessibilityNextSeparator(value, start, componentSeparators);
  }

  return [start, end];
}

function inputAccessibilityGetSelectedComponentNumber(value, position, componentSeparators) {
  var number = 0, test, i, componentSeparatorsCount = componentSeparators.length;

  while (position > 0) {
    test = -1;
    for (i = 0; i < componentSeparatorsCount; i++) {
      test = Math.max(test, value.lastIndexOf(componentSeparators[i], position));
    }
    position = test - 1;
    if (position > -2) {
      number++;
    }
  }

  return number;
}

function inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator) {
  return componentOrder[inputAccessibilityGetSelectedComponentNumber(value, selectionStart, componentSeparator)];
}
