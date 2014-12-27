'use strict';

function initAccessibility() {
  // Binding event handlers to the window (instead of to each date input element) to closely
  // emulate native behavior (e.g. so that other scripts can override it).
  window.addEventListener('keydown', onKeydownHandleNavigation);
  window.addEventListener('keypress', onKeyPressHandleUserInput);

  window.addEventListener('focus', onFocusHandleInputSelection, true);
  window.addEventListener('focusin', onFocusHandleInputSelection);
  window.addEventListener('click', onFocusHandleInputSelection);
  window.addEventListener('blur', onBlurNormalizeInputSelection, true);
  //window.addEventListener('focusout', onBlurNormalizeInputSelection);
}

/**
 * Handles keyboard navigation for HTML input elements of type "date".
 *
 * @param evt
 *   A KeyboardEvent of type keydown. keypress events can't be used because IE doesn't trigger keypress events for
 *   keys like TAB and BACKSPACE.
 */
function onKeydownHandleNavigation(evt) {
  var el, selectionStart, selectionEnd;

  // Returning early if the user input is irrelevant for this event handler.
  if (evt.charCode) {
    return;
  }

  if (evt.defaultPrevented) {
  //return;
  }

  el = evt.target;

  if (el instanceof HTMLInputElement && el.getAttribute(INPUT_ATTR_TYPE) === 'date') {
    selectionStart = el.selectionStart;
    selectionEnd = el.selectionEnd;

    switch (evt.key) {
      case 'Backspace':
      case 'U+0008':
      case 'Del':
        inputDateClearDateComponent(el, selectionStart, selectionEnd);
        break;
      case 'Tab':
      case 'U+0009':
        inputDateNormalizeSelectedComponent(el, selectionStart, selectionEnd);
        if (evt.altKey || evt.ctrlKey || evt.metaKey) {
          return;
        }

        if (evt.shiftKey) {
          if (getSelectedDateComponentNumber(inputDomOriginalValueGetter.call(el), selectionStart, selectionEnd, inputDateFormatSeparatorGetter(el)) !== 0) {
            inputDateSelectPreviousDateComponent(el, selectionStart, selectionEnd);
          }
          else {
            return;
          }
        }
        else if (getSelectedDateComponentNumber(inputDomOriginalValueGetter.call(el), selectionStart, selectionEnd, inputDateFormatSeparatorGetter(el)) !== 2) {
          inputDateSelectNextDateComponent(el, selectionStart, selectionEnd);
        }
        else {
          return;
        }

        break;
      case 'Left':
        inputDateNormalizeSelectedComponent(el, selectionStart, selectionEnd);
        inputDateSelectPreviousDateComponent(el, selectionStart, selectionEnd);
        break;
      case 'Up':
        inputDateIncreaseDateComponent(el, selectionStart, selectionEnd, 1);
        break;
      case 'Right':
        inputDateNormalizeSelectedComponent(el, selectionStart, selectionEnd);
        inputDateSelectNextDateComponent(el, selectionStart, selectionEnd);
        break;
      case 'Down':
        inputDateIncreaseDateComponent(el, selectionStart, selectionEnd, -1);
        break;
      default:
        return;
    }
    evt.preventDefault();
  }
}

/**
 * Handles user input for HTML input elements of type "date".
 *
 * @param evt
 *   A KeyboardEvent of type keypress. User input should be handled on keypress events because these are triggered
 *   every time an actual character is being inserted (keydown and keyup events are triggered only once).
 */
function onKeyPressHandleUserInput(evt) {
  var el;

  // Returning early if the user input is irrelevant for this event handler.
  if (evt.altKey || evt.ctrlKey || evt.shiftKey || evt.metaKey || !evt.charCode) {
    return;
  }

  if (evt.defaultPrevented) {
    return;
  }

  el = evt.target;

  if (el instanceof HTMLInputElement && el.getAttribute(INPUT_ATTR_TYPE) === 'date') {
    // Only allow numeric input.
    if (evt.charCode > 47 && evt.charCode < 58) {
      var selectionStart = el.selectionStart;
      var selectNext = false;

      var value = inputDomOriginalValueGetter.call(el),
        dateComponents = inputDateGetDateComponents(el),

        dateComponentsOrder = inputDateFormatOrderGetter(el),
        dateComponentSeparator = inputDateFormatSeparatorGetter(el),
        dateComponent = getSelectedDateComponent(value, selectionStart, el.selectionEnd, dateComponentsOrder, dateComponentSeparator);

      switch (dateComponent) {
        case DATECOMPONENT_YEAR:
          dateComponents.year = parseInt((dateComponents.year + evt.key).substr(-6), 10);
          break;
        case DATECOMPONENT_MONTH:
          if (dateComponents.month > 0) {
            dateComponents.month = parseInt(evt.key, 10) - 1;
          }
          else {
            dateComponents.month = parseInt((dateComponents.month + 1) + evt.key, 10) - 1;
          }
          if (dateComponents.month > INPUT_DATE_MONTH_MAX) {
            dateComponents.month = INPUT_DATE_MONTH_MAX;
          }
          if (dateComponents.month > 0) {
            selectNext = true;
          }
          break;
        case DATECOMPONENT_DAY:
          if (dateComponents.day > 3) {
            dateComponents.day = parseInt(evt.key, 10);
          }
          else {
            dateComponents.day = parseInt(dateComponents.day + evt.key, 10);
          }
          if (dateComponents.day > INPUT_DATE_DAY_MAX) {
            dateComponents.day = INPUT_DATE_DAY_MAX;
          }
          if (dateComponents.day > 3) {
            selectNext = true;
          }
          break;
        default:
          return;
      }

      inputDateSetDateComponents(el, dateComponents.year, dateComponents.month, dateComponents.day);
      value = inputDomOriginalValueGetter.call(el);

      if (selectNext) {
        var selection = getDateComponentRange(value, selectionStart, dateComponentSeparator);
        inputDateSelectNextDateComponent(el, selection[0], selection[1]);
      }
      else {
        el.setSelectionRange.apply(el, getDateComponentRange(value, selectionStart, dateComponentSeparator));
      }
    }
    evt.preventDefault();
  }
}

function onFocusHandleInputSelection(evt) {
  var dateComponentRange, el, value, selectionStart, dateComponentSeparator;

  if (evt.defaultPrevented) {
    return;
  }

  el = evt.target;

  if (el instanceof HTMLInputElement && el.getAttribute(INPUT_ATTR_TYPE) === 'date') {
    value = inputDomOriginalValueGetter.call(el);
    dateComponentSeparator = inputDateFormatSeparatorGetter(el);

    if (!value) {
      inputDateSetDateComponents(el, INPUT_DATE_YEAR_EMPTY, INPUT_DATE_MONTH_EMPTY, INPUT_DATE_DAY_EMPTY);
      value = inputDomOriginalValueGetter.call(el);
      selectionStart = 0;
    }
    else {
      selectionStart = el.selectionStart;
    }

    dateComponentRange = getDateComponentRange(value, selectionStart, dateComponentSeparator);

    el.setSelectionRange.apply(el, dateComponentRange);
    evt.preventDefault();
  }
}

function onBlurNormalizeInputSelection(evt) {
  var el = evt.target;
  if (el instanceof HTMLInputElement && el.getAttribute(INPUT_ATTR_TYPE) === 'date') {
    inputDateNormalizeSelectedComponent(el, el.selectionStart, el.selectionEnd);
  }
}

function getDateComponentRange(value, position, dateComponentSeparator) {
  var start, end;

  start = value.substring(0, position).lastIndexOf(dateComponentSeparator);

  start = (start < 1) ? 0 : start + 1;

  end = value.indexOf(dateComponentSeparator, position);
  if (end < 1) {
    end = value.length;
  }
  return [start, end];
}

function getSelectedDateComponentNumber(value, selectionStart, selectionEnd, dateComponentSeparator) {
  selectionEnd = selectionEnd || selectionStart;
  if (selectionStart !== 0) {
    if (value.substring(selectionEnd).indexOf(dateComponentSeparator) === -1) {
      return 2;
    }
    else {
      return 1;
    }
  }
  return 0;
}

function getSelectedDateComponent(value, selectionStart, selectionEnd, dateComponentsOrder, dateComponentSeparator) {
  return dateComponentsOrder[getSelectedDateComponentNumber(value, selectionStart, selectionEnd, dateComponentSeparator)];
}

function inputDateClearDateComponent(input, selectionStart, selectionEnd) {
  var value = inputDomOriginalValueGetter.call(input),
    dateComponents = inputDateGetDateComponents(input),
    dateComponentsOrder = inputDateFormatOrderGetter(input),
    dateComponentSeparator = inputDateFormatSeparatorGetter(input),
    dateComponent = getSelectedDateComponent(value, selectionStart, selectionEnd, dateComponentsOrder, dateComponentSeparator);

  switch (dateComponent) {
    case DATECOMPONENT_YEAR:
      dateComponents.year = INPUT_DATE_YEAR_EMPTY;
      break;
    case DATECOMPONENT_MONTH:
      dateComponents.month = INPUT_DATE_MONTH_EMPTY;
      break;
    case DATECOMPONENT_DAY:
      dateComponents.day = INPUT_DATE_DAY_EMPTY;
      break;
    default:
      return;
  }

  inputDateSetDateComponents(input, dateComponents.year, dateComponents.month, dateComponents.day);
  value = inputDomOriginalValueGetter.call(input);
  input.setSelectionRange.apply(input, getDateComponentRange(value, selectionStart, dateComponentSeparator));
}

function inputDateNormalizeSelectedComponent(input, selectionStart, selectionEnd) {
  var value = inputDomOriginalValueGetter.call(input),
    dateComponents = inputDateGetDateComponents(input),
    dateComponentsOrder = inputDateFormatOrderGetter(input),
    dateComponentSeparator = inputDateFormatSeparatorGetter(input),
    dateComponent = getSelectedDateComponent(value, selectionStart, selectionEnd, dateComponentsOrder, dateComponentSeparator);

  switch (dateComponent) {
    case DATECOMPONENT_YEAR:
      if (dateComponents.year > INPUT_DATE_YEAR_MAX) {
        dateComponents.year = INPUT_DATE_YEAR_MAX;
        inputDateSetDateComponents(input, dateComponents.year, dateComponents.month, dateComponents.day);
      }
      break;
    case DATECOMPONENT_MONTH:
      if (dateComponents.month > INPUT_DATE_MONTH_MAX) {
        dateComponents.month = INPUT_DATE_MONTH_MAX;
        inputDateSetDateComponents(input, dateComponents.year, dateComponents.month, dateComponents.day);
      }
      break;
    case DATECOMPONENT_DAY:
      if (dateComponents.day > INPUT_DATE_DAY_MAX) {
        dateComponents.day = INPUT_DATE_DAY_MAX;
        inputDateSetDateComponents(input, dateComponents.year, dateComponents.month, dateComponents.day);
      }
      break;
    default:
      return;
  }
}

function inputDateSelectPreviousDateComponent(input, selectionStart, selectionEnd) {
  var value = inputDomOriginalValueGetter.call(input),
    dateComponentSeparator = inputDateFormatSeparatorGetter(input);

  if (selectionStart !== 0) {
    selectionStart = value.substring(0, selectionStart - 2).lastIndexOf(dateComponentSeparator);
    selectionStart = (selectionStart < 1) ? 0 : selectionStart + 1;

    selectionEnd = input.selectionStart - 1;

    input.setSelectionRange(selectionStart, selectionEnd);
  }
}

function inputDateSelectNextDateComponent(input, selectionStart, selectionEnd) {
  var value = inputDomOriginalValueGetter.call(input),
    dateComponentSeparator = inputDateFormatSeparatorGetter(input);

  if (selectionEnd === 0) {
    selectionEnd = value.indexOf(dateComponentSeparator);
  }
  if (selectionEnd !== value.length) {
    selectionStart = selectionEnd + 1;

    selectionEnd = value.indexOf(dateComponentSeparator, selectionStart);
    if (selectionEnd < 1) {
      selectionEnd = value.length;
    }

    input.setSelectionRange(selectionStart, selectionEnd);
  }
}

function inputDateIncreaseDateComponent(input, selectionStart, selectionEnd, amount) {
  var value = inputDomOriginalValueGetter.call(input),
    dateComponents = inputDateGetDateComponents(input),
    dateComponentsOrder = inputDateFormatOrderGetter(input),
    dateComponentSeparator = inputDateFormatSeparatorGetter(input),
    dateComponent = getSelectedDateComponent(value, selectionStart, selectionEnd, dateComponentsOrder, dateComponentSeparator);

  switch (dateComponent) {
    case DATECOMPONENT_YEAR:
      dateComponents.year = dateComponents.year + amount;
      if (dateComponents.year > INPUT_DATE_YEAR_MAX) {
        dateComponents.year = INPUT_DATE_YEAR_MIN;
      }
      else if (dateComponents.year < INPUT_DATE_YEAR_MIN) {
        dateComponents.year = INPUT_DATE_YEAR_MAX;
      }
      break;
    case DATECOMPONENT_MONTH:
      dateComponents.month = dateComponents.month + amount;
      if (dateComponents.month > INPUT_DATE_MONTH_MAX) {
        dateComponents.month = INPUT_DATE_MONTH_MIN;
      }
      else if (dateComponents.month < INPUT_DATE_MONTH_MIN) {
        dateComponents.month = INPUT_DATE_MONTH_MAX;
      }
      break;
    case DATECOMPONENT_DAY:
      dateComponents.day = dateComponents.day + amount;
      if (dateComponents.day > INPUT_DATE_DAY_MAX) {
        dateComponents.day = INPUT_DATE_DAY_MIN;
      }
      else if (dateComponents.day < INPUT_DATE_DAY_MIN) {
        dateComponents.day = INPUT_DATE_DAY_MAX;
      }
      break;
    default:
      return;
  }

  inputDateSetDateComponents(input, dateComponents.year, dateComponents.month, dateComponents.day);
  value = inputDomOriginalValueGetter.call(input);
  input.setSelectionRange.apply(input, getDateComponentRange(value, selectionStart, dateComponentSeparator));
}
