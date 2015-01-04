'use strict';

/**
 * @file
 * Initialization code for input elements of type time and code shared between the optional features (dom, accessibility, etc).
 *
 * @see {@link http://www.w3.org/TR/html-markup/input.time.html|input type=time - time input control}
 * @see {@link http://www.w3.org/TR/html/forms.html#time-state-(type=time)|HTML5 - 4.10.5.1.8 Time state (type=time)}
 */

/** @const */
var INPUT_TIME_COMPONENT_HOUR = 8,
  INPUT_TIME_COMPONENT_MINUTE = 16,
  INPUT_TIME_COMPONENT_SECOND = 32,
  INPUT_TIME_COMPONENT_MILISECOND = 64;

/** @const */
var INPUT_TIME_COMPONENT_EMPTY = -1;

/** @const */
var INPUT_TIME_COMPONENT_HIDDEN = -2;

/** @const */
var INPUT_TIME_COMPONENT_HOUR_MIN = 0;
var INPUT_TIME_COMPONENT_HOUR_MAX = 23;

var INPUT_TIME_COMPONENT_MINUTE_MIN = 0;
var INPUT_TIME_COMPONENT_MINUTE_MAX = 59;

var INPUT_TIME_COMPONENT_SECOND_MIN = 0;
var INPUT_TIME_COMPONENT_SECOND_MAX = 59;

var INPUT_TIME_COMPONENT_MILISECOND_MIN = 0;
var INPUT_TIME_COMPONENT_MILISECOND_MAX = 999;

var inputTimeValidTimeStringRegExp = /^(([0-1][0-9])|(2[0-3])):[0-5][0-9](:[0-5][0-9](\.[0-9]{1,3})?)?$/;

var inputTimeValueFormatter;
var inputTimeFormatOrderGetter;
var inputTimeFormatSeparatorGetter;

function initInputTime() {
  inputTimeValueFormatter = inputTimeDefaultValueFormatter;
  inputTimeFormatOrderGetter = inputTimeDefaultFormatOrder;
  inputTimeFormatSeparatorGetter = inputTimeDefaultFormatSeparator;
}

function inputTimeComponentsGet(input) {
  if (input.__polyformfillInputComponents === undefined) {
    inputTimeInitInternalValue(input);
  }

  return input.__polyformfillInputComponents;
}

function inputTimeComponentsSet(input, hour, minute, second, milisecond) {
  var formattedValue;

  input.__polyformfillInputComponents = {
    hour: hour,
    minute: minute,
    second: second,
    milisecond: milisecond
  };

  formattedValue = inputTimeValueFormatter(input, hour, minute, second, milisecond);
  inputDomOriginalValueSetter.call(input, formattedValue);
  return formattedValue;
}


function inputTimeInitInternalValue(input) {
  var value = input.getAttribute('value'),
    components;

  if (value !== '') {
    components = inputTimeValidTimeStringToComponents(value);
  }

  if (components) {
    input.__polyformfillInputComponents = components;
  }
  else {
    input.__polyformfillInputComponents = {
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
      components[3] = (components[3] + '000').slice(0, 3);
    }

    return {
      hour: parseInt(components[0], 10),
      minute: parseInt(components[1], 10),
      second: parseInt(components[2], 10),
      milisecond: parseInt(components[3], 10)
    };
  }
  return null;
}

function inputTimeGetRfc3339(element) {
  var components = inputTimeComponentsGet(element);

  if (components.hour > INPUT_TIME_COMPONENT_EMPTY && components.minute > INPUT_TIME_COMPONENT_EMPTY) {
    if (components.second === INPUT_TIME_COMPONENT_EMPTY) {
      components.second = INPUT_TIME_COMPONENT_HIDDEN
    }
    if (components.milisecond === INPUT_TIME_COMPONENT_EMPTY) {
      components.milisecond = INPUT_TIME_COMPONENT_HIDDEN
    }
    return inputTimeDefaultValueFormatter(element, components.hour, components.minute, components.second, components.milisecond);
  }
  else {
    return '';
  }
}

function inputTimeDefaultValueFormatter(input, hour, minute, second, milisecond) {
  var formatted;

  if (hour === INPUT_TIME_COMPONENT_EMPTY) {
    formatted = '--';
  }
  else {
    formatted = ('00' + hour).slice(-2);
  }

  formatted += ':';
  if (minute === INPUT_TIME_COMPONENT_EMPTY) {
    formatted += '--';
  }
  else {
    formatted += ('00' + minute).slice(-2);
  }

  if (second !== INPUT_TIME_COMPONENT_HIDDEN) {
    formatted += ':';
    if (second === INPUT_TIME_COMPONENT_EMPTY) {
      formatted += '--';
    }
    else {
      formatted += ('00' + second).slice(-2);
    }

    if (milisecond !== INPUT_TIME_COMPONENT_HIDDEN) {
      formatted += '.';
      if (milisecond === INPUT_TIME_COMPONENT_EMPTY) {
        formatted += '---';
      }
      else {
        formatted += ('000' + milisecond).slice(-3);
      }
    }
  }

  return formatted;
}


function inputTimeDefaultFormatOrder() {
  return [
    INPUT_TIME_COMPONENT_HOUR,
    INPUT_TIME_COMPONENT_MINUTE,
    INPUT_TIME_COMPONENT_SECOND,
    INPUT_TIME_COMPONENT_MILISECOND
  ];
}

function inputTimeDefaultFormatSeparator() {
  return [':', '.'];
}
