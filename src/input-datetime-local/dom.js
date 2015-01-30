"use strict";

function inputDatetimeLocalDomValueGet(element) {
  return inputDatetimeLocalGetRfc3339(element);
}

function inputDatetimeLocalDomValueSet(element, value) {
  var components;

  if ("" !== value) {
    components = inputDatetimeLocalValidValueStringToComponents(value + "");
  }

  if (components) {
    inputDatetimeLocalComponentsSet(element, components);
  }
  else {
    inputDatetimeLocalComponentsSet(element, {
      yy: INPUT_DATE_YEAR_EMPTY,
      mm: INPUT_DATE_MONTH_EMPTY,
      dd: INPUT_DATE_DAY_EMPTY,
      hh: INPUT_TIME_COMPONENT_EMPTY,
      ii: INPUT_TIME_COMPONENT_EMPTY,
      ss: INPUT_TIME_COMPONENT_HIDDEN,
      ms: INPUT_TIME_COMPONENT_HIDDEN
    });
  }

  return value;
}

function inputDatetimeLocalDomValueAsDateGet(element) {
  var components = inputDatetimeLocalComponentsGet(element), date = null;

  if (components.hh !== INPUT_TIME_COMPONENT_EMPTY && components.ii !== INPUT_TIME_COMPONENT_EMPTY) {
    date = inputDateGetDate(element);
    if (date) {
      date.setUTCHours(components.hh);
      date.setUTCMinutes(components.ii);
      if (components.ss > INPUT_TIME_COMPONENT_EMPTY) {
        date.setUTCSeconds(components.ss);
      }
      if (components.ms > INPUT_TIME_COMPONENT_EMPTY) {
        date.setUTCMilliseconds(components.ms);
      }
    }
  }

  return date;
}

function inputDatetimeLocalDomValueAsDateSet(element, value) {
  inputDatetimeLocalComponentsSet(element, {
    yy: value.getUTCFullYear(),
    mm: value.getUTCMonth(),
    dd: value.getUTCDate(),
    hh: value.getUTCHours(),
    ii: value.getUTCMinutes(),
    ss: value.getUTCSeconds(),
    ms: value.getUTCMilliseconds()
  });
}
