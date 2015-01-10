"use strict";

/**
 * @file
 * Initialization code for input elements of type date and code shared between the optional features (dom, accessibility, etc).
 *
 * @see {@link http://www.w3.org/TR/html-markup/input.date.html|input type=date - date input control}
 * @see {@link http://www.w3.org/TR/html/forms.html#date-state-(type=date)|HTML5 - 4.10.5.1.7 Date state (type=date)}
 */

/** @const */
var INPUT_COMPONENT_YEAR = "yy",
  INPUT_COMPONENT_MONTH ="mm",
  INPUT_COMPONENT_DAY = "dd";

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

var inputDateValueFormatter,
  inputDateFormatOrderGetter,
  inputDateFormatSeparatorGetter;

function initInputDate() {
  inputDateValueFormatter = inputDateFuzzyRfc3339ValueFormatter;
  inputDateFormatOrderGetter = inputDateRfc3339FormatOrder;
  inputDateFormatSeparatorGetter = inputDateRfc3339FormatSeparator;

  initInputDateLocalization();
}

function inputDateComponentsGet(input) {
  if (input[INPUT_PROPERTY_COMPONENTS] === undefined) {
    input[INPUT_PROPERTY_COMPONENTS] = inputDateComponentsFromValue(input.getAttribute(INPUT_PROPERTY_VALUE));
  }

  return input[INPUT_PROPERTY_COMPONENTS];
}

function inputDateComponentsSet(element, components) {
  var formattedValue;

  element[INPUT_PROPERTY_COMPONENTS] = {
    yy: components[INPUT_COMPONENT_YEAR],
    mm: components[INPUT_COMPONENT_MONTH],
    dd: components[INPUT_COMPONENT_DAY]
  };

  formattedValue = inputDateValueFormatter(element[INPUT_PROPERTY_COMPONENTS], element);
  inputDomOriginalValueSetter.call(element, formattedValue);
  return formattedValue;
}

function inputDateFuzzyRfc3339ValueFormatter(components) {
  var year, month, day;

  if (components.yy === INPUT_DATE_YEAR_EMPTY) {
    year = "yyyy";
  }
  else {
    if (9999 >= components.yy) {
      year = ("000" + components.yy).slice(-4);
    }
  }

  if (components.mm === INPUT_DATE_MONTH_EMPTY) {
    month = "mm";
  }
  else {
    month = ("00" + (components.mm + 1)).slice(-2);
  }

  if (components.dd === INPUT_DATE_DAY_EMPTY) {
    day = "dd";
  }
  else {
    day = ("00" + components.dd).slice(-2);
  }

  return year + "-" + month + "-" + day;
}

function inputDateRfc3339FormatOrder() {
  return [
    INPUT_COMPONENT_YEAR,
    INPUT_COMPONENT_MONTH,
    INPUT_COMPONENT_DAY
  ];
}

function inputDateRfc3339FormatSeparator() {
  return ["-"];
}

function getDateFromRfc3339FullDateString(str) {
  var date, dateComponents;
  if (str && rfc3999FullDateRegExp.test(str)) {
    dateComponents = str.split("-");
    // Max possible date; http://ecma-international.org/ecma-262/5.1/#sec-15.9.1.1
    if (2757600914 > dateComponents.join("")) {
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

function inputDateComponentsFromValue(value) {
  var date;

  if ("" !== value) {
    date = getDateFromRfc3339FullDateString(value);
  }

  if (date) {
    return {
      yy: date.getUTCFullYear(),
      mm: date.getUTCMonth(),
      dd: date.getUTCDate()
    };
  }
  else {
    return {
      yy: INPUT_DATE_YEAR_EMPTY,
      mm: INPUT_DATE_MONTH_EMPTY,
      dd: INPUT_DATE_DAY_EMPTY
    };
  }
}

function inputDateGetRfc3339(input) {
  var date = inputDateGetDate(input), value;

  if (date) {
    value = date
      .toISOString()
      // IE prefixes years later than 9999 with "+0" and years later than 99999 with "+".
      .replace("+0", "").replace("+", "");
    value = value.substr(0, value.indexOf("T"));
  }
  else {
    value = "";
  }
  return value;
}

function inputDateGetDate(input) {
  var dateComponents = inputDateComponentsGet(input), date = null;

  if (dateComponents.yy !== INPUT_DATE_YEAR_EMPTY && dateComponents.mm !== INPUT_DATE_MONTH_EMPTY && dateComponents.dd !== INPUT_DATE_DAY_EMPTY) {
    date = new Date(0);
    // TODO setUTCFullYear automatically updates incorrect dates, e.g. february 31th to march 3rd.
    date.setUTCFullYear(dateComponents.yy, dateComponents.mm, dateComponents.dd);
  }

  return date;
}
