'use strict';

/**
 * @file
 * Dom interface polyfill code for input elements of type time.
 */

/**
 *
 * @param element
 * @returns String
 */
function inputTimeDomValueGet(element) {
  return inputTimeGetRfc3339(element);
}

function inputTimeDomValueSet(element, value) {
  var components;

  if (value !== '') {
    components = inputTimeValidTimeStringToComponents(value);
  }

  if (components) {
    inputTimeComponentsSet(element, components.hour, components.minute, components.second, components.milisecond);
  }
  else {
    inputTimeComponentsSet(element, INPUT_TIME_COMPONENT_EMPTY, INPUT_TIME_COMPONENT_EMPTY, INPUT_TIME_COMPONENT_EMPTY, INPUT_TIME_COMPONENT_EMPTY);
  }

  return value;
}

function inputTimeDomValueAsDateGet(element) {
  var components = inputTimeComponentsGet(element), date = null;

  if (components.hour !== INPUT_TIME_COMPONENT_EMPTY && components.minute !== INPUT_TIME_COMPONENT_EMPTY) {
    date = new Date(0, 0, 1, components.hour, components.minute);
    if (components.second !== INPUT_TIME_COMPONENT_EMPTY) {
      date.setUTCSeconds(components.second);
    }
    if (components.milisecond !== INPUT_TIME_COMPONENT_EMPTY) {
      date.setUTCMilliseconds(components.milisecond);
    }
  }

  return date;
}

function inputTimeDomValueAsDateSet(element, value) {
  inputTimeComponentsSet(element, value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds(), value.getUTCMilliseconds());
}
