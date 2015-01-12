"use strict";

/** @const */
var INPUT_TYPE_TEXT = "text",
  INPUT_TYPE_DATE = "date",
  INPUT_TYPE_DATETIME_LOCAL = "datetime-local",
  INPUT_TYPE_TIME = "time";

/** @const */
var INPUT_PROPERTY_VALUE = "value",
  INPUT_PROPERTY_VALUEASDATE = "valueAsDate",
  INPUT_PROPERTY_VALUEASNUMBER = "valueAsNumber";

/** @const */
var INPUT_PROPERTY_COMPONENTS = "__polyformfillInputComponents";

function initInput(testInput) {
  // @if FEATURES.DOM
  initInputDom(testInput);
  // @endif
  // @if FEATURES.VALIDATION
  initInputValidation();
  // @endif
  // @if FEATURES.ACCESSIBILITY
  initInputAccessibility(window.addEventListener);
  // @endif
  // @if FEATURES.LOCALIZATION
  //initInputLocalization();
  // @endif
  // @if FEATURES.NORMALIZATION
  initInputNormalization(window.addEventListener);
  // @endif
}

function inputComponentGetMinimum(element, selectedComponent) {
  if (element.hasAttribute("min")) {

  }

  switch (selectedComponent) {
    case INPUT_COMPONENT_YEAR:
      return INPUT_DATE_YEAR_MIN;
    case INPUT_COMPONENT_MONTH:
      return INPUT_DATE_MONTH_MIN;
    case INPUT_COMPONENT_DAY:
      return INPUT_DATE_DAY_MIN;

    case INPUT_COMPONENT_HOUR:
      return INPUT_TIME_COMPONENT_HOUR_MIN;
    case INPUT_COMPONENT_MINUTE:
      return INPUT_TIME_COMPONENT_MINUTE_MIN;
    case INPUT_COMPONENT_SECOND:
      return INPUT_TIME_COMPONENT_SECOND_MIN;
    case INPUT_COMPONENT_MILISECOND:
      return INPUT_TIME_COMPONENT_MILISECOND_MIN;
  }
}

function inputComponentGetMaximum(element, selectedComponent) {
  if (element.hasAttribute("max")) {

  }

  switch (selectedComponent) {
    case INPUT_COMPONENT_YEAR:
      return INPUT_DATE_YEAR_MAX;
    case INPUT_COMPONENT_MONTH:
      return INPUT_DATE_MONTH_MAX;
    case INPUT_COMPONENT_DAY:
      return INPUT_DATE_DAY_MAX;

    case INPUT_COMPONENT_HOUR:
      return INPUT_TIME_COMPONENT_HOUR_MAX;
    case INPUT_COMPONENT_MINUTE:
      return INPUT_TIME_COMPONENT_MINUTE_MAX;
    case INPUT_COMPONENT_SECOND:
      return INPUT_TIME_COMPONENT_SECOND_MAX;
    case INPUT_COMPONENT_MILISECOND:
      return INPUT_TIME_COMPONENT_MILISECOND_MAX;
  }
}
