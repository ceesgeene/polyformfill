'use strict';

/**
 * @file
 * Provides normalization of input[type=date] elements.
 */

function initNormalization() {
  window.addEventListener('submit', onSubmitNormalizeDateInput);

  window.addEventListener('load', onLoadFormatInputDateElements);
}

function onLoadFormatInputDateElements(evt) {
  var elements = evt.target.getElementsByTagName('INPUT'), dateComponents;

  for (var i = 0; i < elements.length; i++) {
    if (elements[i].getAttribute(INPUT_ATTR_TYPE) === 'date') {
      dateComponents = inputDateGetDateComponents(elements[i]);
      inputDateSetDateComponents(elements[i], dateComponents.year, dateComponents.month, dateComponents.day);
    }
  }
}

function onSubmitNormalizeDateInput(evt) {
  var elements = evt.target.elements;
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].getAttribute(INPUT_ATTR_TYPE) === 'date') {
      inputDateNativeValueSetter.call(elements[i], inputDateGetRfc3339(elements[i]));
    }
  }
  evt.preventDefault();
  return false;
}
