"use strict";

/**
 * @file
 * Initialization code for input elements of type time and code shared between the optional features (dom, accessibility, etc).
 *
 * @see {@link http://www.w3.org/TR/html-markup/input.time.html|input type=time - time input control}
 * @see {@link http://www.w3.org/TR/html/forms.html#time-state-(type=time)|HTML5 - 4.10.5.1.8 Time state (type=time)}
 */

/** @const */
var INPUT_COMPONENT_HOUR = "hh",
  INPUT_COMPONENT_MINUTE = "ii",
  INPUT_COMPONENT_SECOND = "ss",
  INPUT_COMPONENT_MILISECOND = "ms";

/** @const */
var INPUT_TIME_COMPONENT_EMPTY = -1;

/** @const */
var INPUT_TIME_COMPONENT_HIDDEN = -2;

/** @const */
var INPUT_TIME_COMPONENT_HOUR_MIN = 0,
  INPUT_TIME_COMPONENT_HOUR_MAX = 23;

/** @const */
var INPUT_TIME_COMPONENT_MINUTE_MIN = 0,
  INPUT_TIME_COMPONENT_MINUTE_MAX = 59;

/** @const */
var INPUT_TIME_COMPONENT_SECOND_MIN = 0,
  INPUT_TIME_COMPONENT_SECOND_MAX = 59;

/** @const */
var INPUT_TIME_COMPONENT_MILISECOND_MIN = 0,
  INPUT_TIME_COMPONENT_MILISECOND_MAX = 999;

var inputTimeValidTimeStringRegExp = /^(([0-1][0-9])|(2[0-3])):[0-5][0-9](:[0-5][0-9](\.[0-9]{1,3})?)?$/;

var inputTimeValueFormatter,
  inputTimeFormatOrderGetter,
  inputTimeFormatSeparatorGetter;

function initInputTime() {
  inputTimeValueFormatter = inputTimeDefaultValueFormatter;
  inputTimeFormatOrderGetter = inputTimeDefaultFormatOrder;
  inputTimeFormatSeparatorGetter = inputTimeDefaultFormatSeparator;
}

function inputTimeComponentsGet(input) {
  if (input[INPUT_PROPERTY_COMPONENTS] === undefined) {
    input[INPUT_PROPERTY_COMPONENTS] = inputTimeComponentsFromValue(input.getAttribute(INPUT_PROPERTY_VALUE));
  }

  return input[INPUT_PROPERTY_COMPONENTS];
}

function inputTimeComponentsSet(element, components) {
  var formattedValue;

  element[INPUT_PROPERTY_COMPONENTS] = {
    hh: components[INPUT_COMPONENT_HOUR],
    ii: components[INPUT_COMPONENT_MINUTE],
    ss: components[INPUT_COMPONENT_SECOND],
    ms: components[INPUT_COMPONENT_MILISECOND]
  };

  formattedValue = inputTimeValueFormatter(element[INPUT_PROPERTY_COMPONENTS], element);
  inputDomOriginalValueSetter.call(element, formattedValue);
  return formattedValue;
}


function inputTimeComponentsFromValue(value) {
  var components;

  if ("" !== value) {
    components = inputTimeValidTimeStringToComponents(value);
  }

  if (components) {
    return components;
  }
  else {
    return {
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
 * @see {@link http://www.w3.org/TR/html/infrastructure.html#valid-time-string}
 */
function inputTimeValidTimeStringToComponents(str) {
  var components;
  if (str && inputTimeValidTimeStringRegExp.test(str)) {
    components = str.split(/[:.]/);

    if (components[2] === undefined) {
      components[2] = INPUT_TIME_COMPONENT_HIDDEN;
    }
    if (components[3] === undefined) {
      components[3] = INPUT_TIME_COMPONENT_HIDDEN;
    }
    else {
      components[3] = (components[3] + "000").slice(0, 3);
    }

    return {
      hh: parseInt(components[0], 10),
      ii: parseInt(components[1], 10),
      ss: parseInt(components[2], 10),
      ms: parseInt(components[3], 10)
    };
  }
  return null;
}

function inputTimeGetRfc3339(element) {
  var components = inputTimeComponentsGet(element);

  if (components.hh > INPUT_TIME_COMPONENT_EMPTY && components.ii > INPUT_TIME_COMPONENT_EMPTY) {
    if (components.ss === INPUT_TIME_COMPONENT_EMPTY) {
      components.ss = INPUT_TIME_COMPONENT_HIDDEN
    }
    if (components.ms === INPUT_TIME_COMPONENT_EMPTY) {
      components.ms = INPUT_TIME_COMPONENT_HIDDEN
    }
    return inputTimeDefaultValueFormatter(components);
  }
  else {
    return "";
  }
}

function inputTimeDefaultValueFormatter(components) {
  var formatted;

  if (components.hh === INPUT_TIME_COMPONENT_EMPTY) {
    formatted = "--";
  }
  else {
    formatted = ("00" + components.hh).slice(-2);
  }

  formatted += ":";
  if (components.ii === INPUT_TIME_COMPONENT_EMPTY) {
    formatted += "--";
  }
  else {
    formatted += ("00" + components.ii).slice(-2);
  }

  if (components.ss !== INPUT_TIME_COMPONENT_HIDDEN) {
    formatted += ":";
    if (components.ss === INPUT_TIME_COMPONENT_EMPTY) {
      formatted += "--";
    }
    else {
      formatted += ("00" + components.ss).slice(-2);
    }

    if (components.ms !== INPUT_TIME_COMPONENT_HIDDEN) {
      formatted += ".";
      if (components.ms === INPUT_TIME_COMPONENT_EMPTY) {
        formatted += "---";
      }
      else {
        formatted += ("000" + components.ms).slice(-3);
      }
    }
  }

  return formatted;
}


function inputTimeDefaultFormatOrder() {
  return [
    INPUT_COMPONENT_HOUR,
    INPUT_COMPONENT_MINUTE,
    INPUT_COMPONENT_SECOND,
    INPUT_COMPONENT_MILISECOND
  ];
}

function inputTimeDefaultFormatSeparator() {
  return [":", "."];
}
