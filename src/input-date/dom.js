"use strict";


/** @const */
var INPUT_DATE_STEP_DEFAULT = 1;

/** @const */
var INPUT_DATE_STEP_SCALE_FACTOR = 86400000;

function inputDateDomValueGet(element) {
  return inputDateGetRfc3339(element);
}

function inputDateDomValueSet(element, value) {
  var date;

  if ("" !== value) {
    date = getDateFromRfc3339FullDateString(value);
  }

  if (date) {
    inputDateComponentsSet(element, {yy: date.getUTCFullYear(), mm: date.getUTCMonth(), dd: date.getUTCDate()});
  }
  else {
    //console.warn("The specified value '" + value + "' does not conform to the required format, 'yyyy-MM-dd'.");
    inputDateComponentsSet(element, {yy: INPUT_DATE_YEAR_EMPTY, mm: INPUT_DATE_MONTH_EMPTY, dd: INPUT_DATE_DAY_EMPTY});
  }

  return value;
}

function inputDateDomValueAsDateGet(element) {
  return inputDateGetDate(element);
}

function inputDateDomValueAsDateSet(element, value) {
  inputDateComponentsSet(element, {yy: value.getUTCFullYear(), mm: value.getUTCMonth(), dd: value.getUTCDate()});
}
