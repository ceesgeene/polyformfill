'use strict';

/**
 * @file
 * Initialization code for input elements of type datetime-local and code shared between the optional features (dom, accessibility, etc).
 *
 * @see {@link http://www.w3.org/TR/html-markup/input.datetime-local.html}
 */

var inputDatetimeLocalValueFormatter;
var inputDatetimeLocalFormatOrderGetter;
var inputDatetimeLocalFormatSeparatorGetter;

function initInputDatetimeLocal() {
  inputDatetimeLocalValueFormatter = inputDatetimeLocalDefaultValueFormatter;
  inputDatetimeLocalFormatOrderGetter = inputDatetimeLocalDefaultFormatOrder;
  inputDatetimeLocalFormatSeparatorGetter = inputDatetimeLocalDefaultFormatSeparator;
}

function inputDatetimeLocalComponentsGet(input) {
  if (input.__polyformfillInputComponents === undefined) {
    inputDatetimeLocalInitInternalValue(input);
  }

  return input.__polyformfillInputComponents;
}

function inputDatetimeLocalComponentsSet(input, year, month, day, hour, minute, second, milisecond) {
  var formattedValue;

  input.__polyformfillInputComponents = {
    year: year,
    month: month,
    day: day,

    hour: hour,
    minute: minute,
    second: second,
    milisecond: milisecond
  };

  formattedValue = inputDatetimeLocalValueFormatter(input, year, month, day, hour, minute, second, milisecond);
  inputDomOriginalValueSetter.call(input, formattedValue);
  return formattedValue;
}


function inputDatetimeLocalInitInternalValue(input) {
  var value = input.getAttribute('value'),
    components;

  if (value) {
    components = inputDatetimeLocalValidValueStringToComponents(value);
  }

  if (components) {
    input.__polyformfillInputComponents = components;
  }
  else {
    input.__polyformfillInputComponents = {
      year: INPUT_DATE_YEAR_EMPTY,
      month: INPUT_DATE_MONTH_EMPTY,
      day: INPUT_DATE_DAY_EMPTY,

      hour: INPUT_TIME_COMPONENT_EMPTY,
      minute: INPUT_TIME_COMPONENT_EMPTY,
      second: INPUT_TIME_COMPONENT_HIDDEN,
      milisecond: INPUT_TIME_COMPONENT_HIDDEN
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

  str = str.split('T');
  if (str.length === 2) {
    date = getDateFromRfc3339FullDateString(str[0]);
    if (date === null) {
      return null;
    }

    time = inputTimeValidTimeStringToComponents(str[1]);
    if (time === null) {
      return null;
    }

    return {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth(),
      day: date.getUTCDate(),

      hour: time.hour,
      minute: time.minute,
      second: time.second,
      milisecond: time.milisecond
    };
  }
  return null;
}

function inputDatetimeLocalGetRfc3339(element) {
  var components = inputDatetimeLocalComponentsGet(element);

  if (components.hour > INPUT_TIME_COMPONENT_EMPTY && components.minute > INPUT_TIME_COMPONENT_EMPTY) {
    if (components.second === INPUT_TIME_COMPONENT_EMPTY) {
      components.second = INPUT_TIME_COMPONENT_HIDDEN;
    }
    if (components.milisecond === INPUT_TIME_COMPONENT_EMPTY) {
      components.milisecond = INPUT_TIME_COMPONENT_HIDDEN;
    }
    return inputDateFuzzyRfc3339ValueFormatter(element, components.year, components.month, components.day) + 'T' + inputTimeDefaultValueFormatter(element, components.hour, components.minute, components.second, components.milisecond);
  }
  else {
    return '';
  }
}

function inputDatetimeLocalDefaultValueFormatter(input, year, month, day, hour, minute, second, milisecond) {
  return inputDateFuzzyRfc3339ValueFormatter(input, year, month, day) + ' ' + inputTimeDefaultValueFormatter(input, hour, minute, second, milisecond);
}


function inputDatetimeLocalDefaultFormatOrder() {
  return [
    DATECOMPONENT_YEAR,
    DATECOMPONENT_MONTH,
    DATECOMPONENT_DAY,
    INPUT_TIME_COMPONENT_HOUR,
    INPUT_TIME_COMPONENT_MINUTE,
    INPUT_TIME_COMPONENT_SECOND,
    INPUT_TIME_COMPONENT_MILISECOND
  ];
}

function inputDatetimeLocalDefaultFormatSeparator() {
  return ['-', ' ', ':', '.'];
}
