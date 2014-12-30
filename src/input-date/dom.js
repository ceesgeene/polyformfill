'use strict';

/** @const */
var INPUT_DATE_STEP_SCALE_FACTOR = 86400000;

function inputDateDomValueGet(element) {
  return inputDateGetRfc3339(element);
}

function inputDateDomValueSet(element, value) {
  var date;

  if (value !== '') {
    date = getDateFromRfc3339FullDateString(value);
  }

  if (date) {
    inputDateComponentsSet(element, date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  }
  else {
    //console.warn("The specified value '" + value + "' does not conform to the required format, 'yyyy-MM-dd'.");
    inputDateComponentsSet(element, INPUT_DATE_YEAR_EMPTY, INPUT_DATE_MONTH_EMPTY, INPUT_DATE_DAY_EMPTY);
  }

  return value;
}

function inputDateDomValueAsDateGet(element) {
  return inputDateGetDate(element);
}

function inputDateDomValueAsDateSet(element, value) {
  inputDateComponentsSet(element, value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());
}
