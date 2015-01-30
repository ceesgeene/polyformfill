"use strict";

/**
 * @file
 * Provides normalization of input elements.
 */

/**
 * Initializes the normalization feature of the polyfill script for HTML input elements.
 *
 * @param {Function} addEventListener
 */
function initInputNormalization(addEventListener) {
  addEventListener("load", inputNormalizationOnLoadFormatInputElements);

  addEventListener("submit", inputNormalizationOnSubmitNormalizeInput);
}

/**
 * Handles initial formatting of the value of HTML input elements.
 *
 * @param {Event} event
 *   An Event of type load.
 */
function inputNormalizationOnLoadFormatInputElements(event) {
  var elements = event.target.getElementsByTagName("INPUT"), i;

  for (i = 0; i < elements.length; i++) {
    switch (elements[i].getAttribute(INPUT_ATTR_TYPE)) {
      case INPUT_TYPE_DATE:
        inputDateNormalizationOnLoadFormatInputElements(elements[i]);
        break;
      case INPUT_TYPE_DATETIME_LOCAL:
        inputDatetimeLocalNormalizationOnLoadFormatInputElements(elements[i]);
        break;
      case INPUT_TYPE_TIME:
        inputTimeNormalizationOnLoadFormatInputElements(elements[i]);
        break;
      default:
        break;
    }
  }
}


/**
 * Normalizes submitted value of HTML input elements.
 *
 * @param {Event} event
 *   An Event of type submit.
 */
function inputNormalizationOnSubmitNormalizeInput(event) {
  var elements = event.target.elements, i;

  for (i = 0; i < elements.length; i++) {
    switch (elements[i].getAttribute(INPUT_ATTR_TYPE)) {
      case INPUT_TYPE_DATE:
        inputDateNormalizationOnSubmitNormalizeInput(elements[i]);
        break;
      case INPUT_TYPE_DATETIME_LOCAL:
        inputDatetimeLocalNormalizationOnSubmitNormalizeInput(elements[i]);
        break;
      case INPUT_TYPE_TIME:
        inputTimeNormalizationOnSubmitNormalizeInput(elements[i]);
        break;
      default:
        break;
    }
  }
}
