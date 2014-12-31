'use strict';

/**
 * @file
 * Provides normalization of input elements.
 */

function initInputNormalization() {
  window.addEventListener('submit', inputNormalizationOnSubmitNormalizeInput);

  window.addEventListener('load', inputNormalizationOnLoadFormatInputElements);
}

function inputNormalizationOnLoadFormatInputElements(event) {
  var elements = event.target.getElementsByTagName('INPUT'), i;

  for (i = 0; i < elements.length; i++) {
    switch (elements[i].getAttribute(INPUT_ATTR_TYPE)) {
      case 'date':
        inputDateNormalizationOnLoadFormatInputDateElements(elements[i]);
        break;
      case 'time':
        inputTimeNormalizationOnLoadFormatInputElements(elements[i]);
        break;
      default:
        break;
    }
  }
}

function inputNormalizationOnSubmitNormalizeInput(event) {
  var elements = event.target.elements, i;

  for (i = 0; i < elements.length; i++) {
    switch (elements[i].getAttribute(INPUT_ATTR_TYPE)) {
      case 'date':
        inputDateNormalizationOnSubmitNormalizeDateInput(elements[i]);
        break;
      case 'time':
        inputTimeNormalizationOnSubmitNormalizeInput(elements[i]);
        break;
      default:
        break;
    }
  }
}
