'use strict';

/**
 *
 *
 * @see {@link http://www.w3.org/TR/html/forms.html#input-author-notes|Date, time, and number formats}
 * @see {@link http://www.w3.org/TR/html/forms.html#input-impl-notes|Implementation notes regarding localization of form controls}
 */

function initLocalization() {
  inputDateValueFormatter = inputDateLocalizedValueFormatter;
  inputDateFormatOrderGetter = inputDatLocalizedFormatOrder;
  inputDateFormatSeparatorGetter = inputDateLocalizedFormatSeparator;
}

function inputDateLocalizedValueFormatter(input, year, month, day) {
  var separator = inputDateFormatSeparatorGetter(input),
    value;

  if (year === INPUT_DATE_YEAR_EMPTY) {
    year = 'yyyy';
  }
  else {
    if (year <= 9999) {
      year = ('000' + year).slice(-4);
    }
  }

  if (month === INPUT_DATE_MONTH_EMPTY) {
    month = 'mm';
  }
  else {
    month = ('00' + (month + 1)).slice(-2);
  }

  if (day === INPUT_DATE_DAY_EMPTY) {
    day = 'dd';
  }
  else {
    day = ('00' + day).slice(-2);
  }

  var lang;

  if (input.hasAttribute('lang')) {
    lang = input.getAttribute('lang').toLowerCase();
  }

  switch (lang) {
    case 'en':
    case 'en-us':
      value = month + separator + day + separator + year;
      break;
    case 'en-gb':
    case 'de':
    case 'nl':
      value = day + separator + month + separator + year;
      break;
    default:
      value = year + separator + month + separator + day;
      break;
  }

  return value;
}

function inputDatLocalizedFormatOrder(input) {
  var lang, order;

  if (input.hasAttribute('lang')) {
    lang = input.getAttribute('lang').toLowerCase();
  }

  switch (lang) {
    case 'en':
    case 'en-us':
      order = [
        DATECOMPONENT_MONTH,
        DATECOMPONENT_DAY,
        DATECOMPONENT_YEAR
      ];
      break;
    case 'en-gb':
    case 'de':
    case 'nl':
      order = [
        DATECOMPONENT_DAY,
        DATECOMPONENT_MONTH,
        DATECOMPONENT_YEAR
      ];
      break;
    default:
      order = [
        DATECOMPONENT_YEAR,
        DATECOMPONENT_MONTH,
        DATECOMPONENT_DAY
      ];
      break;
  }

  return order;
}

function inputDateLocalizedFormatSeparator(input) {
  var lang, separator;

  if (input.hasAttribute('lang')) {
    lang = input.getAttribute('lang').toLowerCase();
  }

  switch (lang) {
    case 'en':
    case 'en-us':
    case 'en-gb':
    case 'fr':
      separator = '/';
      break;
    case 'de':
      separator = '.';
      break;
    default:
      separator = '-';
      break;
  }

  return separator;
}
