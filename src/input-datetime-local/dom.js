'use strict';

function inputDatetimeLocalDomValueGet(element) {
  return inputDatetimeLocalGetRfc3339(element);
}

function inputDatetimeLocalDomValueSet(element, value) {
  var components;

  if (value !== '') {
    components = inputDatetimeLocalValidValueStringToComponents(value + '');
  }

  if (components) {
    inputDatetimeLocalComponentsSet(element, components.year, components.month, components.day, components.hour, components.minute, components.second, components.milisecond);
  }
  else {
    inputDatetimeLocalComponentsSet(element, INPUT_DATE_YEAR_EMPTY, INPUT_DATE_MONTH_EMPTY, INPUT_DATE_DAY_EMPTY, INPUT_TIME_COMPONENT_EMPTY, INPUT_TIME_COMPONENT_EMPTY, INPUT_TIME_COMPONENT_HIDDEN, INPUT_TIME_COMPONENT_HIDDEN);
  }

  return value;
}

function inputDatetimeLocalDomValueAsDateGet(element) {
  var components = inputDatetimeLocalComponentsGet(element), date = null;

  if (components.hour !== INPUT_TIME_COMPONENT_EMPTY && components.minute !== INPUT_TIME_COMPONENT_EMPTY) {
    date = inputDateGetDate(element);
    if (date) {
      date.setUTCHours(components.hour);
      date.setUTCMinutes(components.minute);
      if (components.second > INPUT_TIME_COMPONENT_EMPTY) {
        date.setUTCSeconds(components.second);
      }
      if (components.milisecond > INPUT_TIME_COMPONENT_EMPTY) {
        date.setUTCMilliseconds(components.milisecond);
      }
    }
  }

  return date;
}

function inputDatetimeLocalDomValueAsDateSet(element, value) {
  inputDatetimeLocalComponentsSet(element, value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds(), value.getUTCMilliseconds());
}
