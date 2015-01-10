"use strict";

/**
 * @file
 * Initialization code for input elements of type datetime-local and code shared between the optional features (dom, accessibility, etc).
 *
 * @see {@link http://www.w3.org/TR/html-markup/input.datetime-local.html}
 */

var inputDatetimeLocalValueFormatter,
  inputDatetimeLocalFormatOrderGetter,
  inputDatetimeLocalFormatSeparatorGetter;

function initInputDatetimeLocal() {
  inputDatetimeLocalValueFormatter = inputDatetimeLocalDefaultValueFormatter;
  inputDatetimeLocalFormatOrderGetter = inputDatetimeLocalDefaultFormatOrder;
  inputDatetimeLocalFormatSeparatorGetter = inputDatetimeLocalDefaultFormatSeparator;
}

function inputDatetimeLocalComponentsGet(input) {
  if (input[INPUT_PROPERTY_COMPONENTS] === undefined) {
    input[INPUT_PROPERTY_COMPONENTS] = inputDatetimeLocalComponentsFromValue(input.getAttribute(INPUT_PROPERTY_VALUE));
  }

  return input[INPUT_PROPERTY_COMPONENTS];
}

function inputDatetimeLocalComponentsSet(element, components) {
  var formattedValue;

  element[INPUT_PROPERTY_COMPONENTS] = {
    yy: components[INPUT_COMPONENT_YEAR],
    mm: components[INPUT_COMPONENT_MONTH],
    dd: components[INPUT_COMPONENT_DAY],

    hh: components[INPUT_COMPONENT_HOUR],
    ii: components[INPUT_COMPONENT_MINUTE],
    ss: components[INPUT_COMPONENT_SECOND],
    ms: components[INPUT_COMPONENT_MILISECOND]
  };

  formattedValue = inputDatetimeLocalValueFormatter(element[INPUT_PROPERTY_COMPONENTS], element);
  inputDomOriginalValueSetter.call(element, formattedValue);
  return formattedValue;
}


function inputDatetimeLocalComponentsFromValue(value) {
  var components;

  if (value) {
    components = inputDatetimeLocalValidValueStringToComponents(value);
  }

  if (components) {
    return components;
  }
  else {
    return {
      yy: INPUT_DATE_YEAR_EMPTY,
      mm: INPUT_DATE_MONTH_EMPTY,
      dd: INPUT_DATE_DAY_EMPTY,

      hh: INPUT_TIME_COMPONENT_EMPTY,
      ii: INPUT_TIME_COMPONENT_EMPTY,
      ss: INPUT_TIME_COMPONENT_HIDDEN,
      ms: INPUT_TIME_COMPONENT_HIDDEN
    };
  }
}

/**
 *
 * @param str
 * @returns {*}
 *
 * @see {@link http://www.w3.org/TR/html/infrastructure.html#floating-dates-and-times}
 */
function inputDatetimeLocalValidValueStringToComponents(str) {
  var date, time;

  str = str.split("T");
  if (2 === str.length) {
    date = getDateFromRfc3339FullDateString(str[0]);
    if (null === date) {
      return null;
    }

    time = inputTimeValidTimeStringToComponents(str[1]);
    if (null === time) {
      return null;
    }

    return {
      yy: date.getUTCFullYear(),
      mm: date.getUTCMonth(),
      dd: date.getUTCDate(),

      hh: time.hh,
      ii: time.ii,
      ss: time.ss,
      ms: time.ms
    };
  }
  return null;
}

function inputDatetimeLocalGetRfc3339(element) {
  var components = inputDatetimeLocalComponentsGet(element);

  if (components.hh > INPUT_TIME_COMPONENT_EMPTY && components.ii > INPUT_TIME_COMPONENT_EMPTY) {
    if (components.ss === INPUT_TIME_COMPONENT_EMPTY) {
      components.ss = INPUT_TIME_COMPONENT_HIDDEN;
    }
    if (components.ms === INPUT_TIME_COMPONENT_EMPTY) {
      components.ms = INPUT_TIME_COMPONENT_HIDDEN;
    }
    return inputDateFuzzyRfc3339ValueFormatter(components) + "T" + inputTimeDefaultValueFormatter(components);
  }
  else {
    return "";
  }
}

function inputDatetimeLocalDefaultValueFormatter(components) {
  return inputDateFuzzyRfc3339ValueFormatter(components) + " " + inputTimeDefaultValueFormatter(components);
}


function inputDatetimeLocalDefaultFormatOrder() {
  return [
    INPUT_COMPONENT_YEAR,
    INPUT_COMPONENT_MONTH,
    INPUT_COMPONENT_DAY,
    INPUT_COMPONENT_HOUR,
    INPUT_COMPONENT_MINUTE,
    INPUT_COMPONENT_SECOND,
    INPUT_COMPONENT_MILISECOND
  ];
}

function inputDatetimeLocalDefaultFormatSeparator() {
  return ["-", " ", ":", "."];
}
