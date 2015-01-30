"use strict";

/**
 *
 *
 * @see {@link http://www.w3.org/TR/html/forms.html#input-author-notes|Date, time, and number formats}
 * @see {@link http://www.w3.org/TR/html/forms.html#input-impl-notes|Implementation notes regarding localization of form controls}
 */

function initInputDateLocalization() {
  inputDateValueFormatter = inputDateLocalizationValueFormatter;
  inputDateFormatOrderGetter = inputDateLocalizationFormatOrder;
  inputDateFormatSeparatorGetter = inputDateLocalizationFormatSeparator;
}

function inputDateLocalizationValueFormatter(components, element) {
  var year, month, day, separator = inputDateFormatSeparatorGetter(element),
    value;

  if (components.yy === INPUT_DATE_YEAR_EMPTY) {
    year = "yyyy";
  }
  else {
    if (9999 >= components.yy) {
      year = ("000" + components.yy).slice(-4);
    }
    else {
      year = components.yy;
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

  var lang;

  if (element.hasAttribute(INPUT_ATTR_LANG)) {
    lang = element.getAttribute(INPUT_ATTR_LANG).toLowerCase();
  }

  switch (lang) {
    case "en":
    case "en-us":
      value = month + separator + day + separator + year;
      break;
    case "en-gb":
    case "de":
    case "nl":
      value = day + separator + month + separator + year;
      break;
    default:
      value = year + separator + month + separator + day;
      break;
  }

  return value;
}

function inputDateLocalizationFormatOrder(input) {
  var lang, order;

  if (input.hasAttribute(INPUT_ATTR_LANG)) {
    lang = input.getAttribute(INPUT_ATTR_LANG).toLowerCase();
  }

  switch (lang) {
    case "en":
    case "en-us":
      order = [
        INPUT_COMPONENT_MONTH,
        INPUT_COMPONENT_DAY,
        INPUT_COMPONENT_YEAR
      ];
      break;
    case "en-gb":
    case "de":
    case "nl":
      order = [
        INPUT_COMPONENT_DAY,
        INPUT_COMPONENT_MONTH,
        INPUT_COMPONENT_YEAR
      ];
      break;
    default:
      order = [
        INPUT_COMPONENT_YEAR,
        INPUT_COMPONENT_MONTH,
        INPUT_COMPONENT_DAY
      ];
      break;
  }

  return order;
}

function inputDateLocalizationFormatSeparator(input) {
  var lang, separator;

  if (input.hasAttribute(INPUT_ATTR_LANG)) {
    lang = input.getAttribute(INPUT_ATTR_LANG).toLowerCase();
  }

  switch (lang) {
    case "en":
    case "en-us":
    case "en-gb":
    case "fr":
      separator = "/";
      break;
    case "de":
      separator = ".";
      break;
    default:
      separator = "-";
      break;
  }

  return [separator];
}
