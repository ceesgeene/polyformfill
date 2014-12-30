'use strict';

/**
 * @file
 * Initialization code for input elements of type date and code shared between the optional features (dom, accessibility, etc).
 *
 * @see {@link http://www.w3.org/TR/html-markup/input.date.html|input type=date - date input control}
 * @see {@link http://www.w3.org/TR/html/forms.html#date-state-(type=date)|HTML5 - 4.10.5.1.7 Date state (type=date)}
 */

/** @const */
var DATECOMPONENT_YEAR = 1,
  DATECOMPONENT_MONTH = 2,
  DATECOMPONENT_DAY = 4;

/** @const */
var INPUT_DATE_YEAR_EMPTY = 0,
  INPUT_DATE_MONTH_EMPTY = -1,
  INPUT_DATE_DAY_EMPTY = 0;

/** @const */
var INPUT_DATE_YEAR_MIN = 1,
  INPUT_DATE_YEAR_MAX = 275760;

/** @const */
var INPUT_DATE_MONTH_MIN = 0,
  INPUT_DATE_MONTH_MAX = 11;

/** @const */
var INPUT_DATE_DAY_MIN = 1,
  INPUT_DATE_DAY_MAX = 31;

var rfc3999FullDateRegExp = /^([0-9]{4,})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;

var inputDateValueFormatter;
var inputDateFormatOrderGetter;
var inputDateFormatSeparatorGetter;

function initInputDate() {
  inputDateValueFormatter = inputDateFuzzyRfc3339ValueFormatter;
  inputDateFormatOrderGetter = inputDateRfc3339FormatOrder;
  inputDateFormatSeparatorGetter = inputDateRfc3339FormatSeparator;

  initInputDateLocalization();
}

function inputDateComponentsSet(input, year, month, day) {
  var formattedValue;

  input.__polyformfillInputDate = {
    year: year,
    month: month,
    day: day
  };

  formattedValue = inputDateValueFormatter(input, year, month, day);
  inputDomOriginalValueSetter.call(input, formattedValue);
  return formattedValue;
}

function inputDateComponentsGet(input) {
  if (input.__polyformfillInputDate === undefined) {
    inputDateInitInternalValue(input);
  }

  return input.__polyformfillInputDate;
}

function inputDateFuzzyRfc3339ValueFormatter(input, year, month, day) {
  if (year === INPUT_DATE_YEAR_EMPTY) {
    year = 'yyyy';
  }
  else {
    if (year <= 9999) {
      year = ('000' + year).slice(-4);
    }
  }

  if (month === INPUT_DATE_MONTH_EMPTY) {
    month = 'mm';
  }
  else {
    month = ('00' + (month + 1)).slice(-2);
  }

  if (day === INPUT_DATE_DAY_EMPTY) {
    day = 'dd';
  }
  else {
    day = ('00' + day).slice(-2);
  }

  return year + '-' + month + '-' + day;
}

function inputDateRfc3339FormatOrder() {
  return [
    DATECOMPONENT_YEAR,
    DATECOMPONENT_MONTH,
    DATECOMPONENT_DAY
  ];
}

function inputDateRfc3339FormatSeparator() {
  return ['-'];
}

function getDateFromRfc3339FullDateString(str) {
  var date, dateComponents;
  if (str && rfc3999FullDateRegExp.test(str)) {
    dateComponents = str.split('-');
    // Max possible date; http://ecma-international.org/ecma-262/5.1/#sec-15.9.1.1
    if (dateComponents.join('') < 2757600914) {
      date = new Date(0);
      date.setUTCFullYear(dateComponents[0], dateComponents[1] - 1, dateComponents[2]);
      // Don't accept values like february 31th. setUTCFullYear() automatically updates these values to correct dates,
      // like march 3 for given example.
      if (date.getUTCMonth() != dateComponents[1] - 1 || date.getUTCDate() != dateComponents[2]) {
        return null;
      }
      return date;
    }
  }
  return null;
}

function inputDateInitInternalValue(input) {
  var value = input.getAttribute('value'),
      date;

  if (value !== '') {
    date = getDateFromRfc3339FullDateString(value);
  }

  if (date) {
    input.__polyformfillInputDate = {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth(),
      day: date.getUTCDate()
    };
  }
  else {
    input.__polyformfillInputDate = {
      year: INPUT_DATE_YEAR_EMPTY,
      month: INPUT_DATE_MONTH_EMPTY,
      day: INPUT_DATE_DAY_EMPTY
    };
  }
}

function inputDateGetRfc3339(input) {
  var date = inputDateGetDate(input), value;

  if (date) {
    value = date
      .toISOString()
      // IE prefixes years later than 9999 with "+0" and years later than 99999 with "+".
      .replace('+0', '').replace('+', '');
    value = value.substr(0, value.indexOf('T'));
  }
  else {
    value = '';
  }
  return value;
}

function inputDateGetDate(input) {
  var dateComponents = inputDateComponentsGet(input), date = null;

  if (dateComponents.year !== INPUT_DATE_YEAR_EMPTY && dateComponents.month !== INPUT_DATE_MONTH_EMPTY && dateComponents.day !== INPUT_DATE_DAY_EMPTY) {
    date = new Date(0);
    // TODO setUTCFullYear automatically updates incorrect dates, e.g. february 31th to march 3rd.
    date.setUTCFullYear(dateComponents.year, dateComponents.month, dateComponents.day);
  }

  return date;
}
