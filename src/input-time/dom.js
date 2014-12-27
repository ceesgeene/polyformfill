'use strict';

/**
 * @file
 * Dom interface polyfill code for input elements of type time.
 */

function inputTimeValueGet(element) {
  return inputTimeGetRfc3339(element);
}

function inputTimeValueSet(element, value) {
  var date;

  if (value !== '') {
    date = getDateFromRfc3339FullDateString(value);
  }

  if (date) {
    inputTimeSetDateComponents(element, date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  }
  else {
    //console.warn("The specified value '" + value + "' does not conform to the required format, 'yyyy-MM-dd'.");
    inputTimeSetDateComponents(element, INPUT_DATE_YEAR_EMPTY, INPUT_DATE_MONTH_EMPTY, INPUT_DATE_DAY_EMPTY);
  }

  return value;
}

function inputTimeValueAsDateGet(element) {
  return inputTimeGetDate(element);
}

function inputTimeValueAsDateSet(element, value) {
  inputTimeSetDateComponents(element, value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());
}
