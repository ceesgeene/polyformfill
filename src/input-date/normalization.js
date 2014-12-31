'use strict';

/**
 * @file
 * Provides normalization of input[type=date] elements.
 */

function inputDateNormalizationOnLoadFormatInputDateElements(element) {
  var components = inputDateComponentsGet(element);
  inputDateComponentsSet(element, components.year, components.month, components.day);
}

function inputDateNormalizationOnSubmitNormalizeDateInput(element) {
  inputDomOriginalValueSetter.call(element, inputDateGetRfc3339(element));
}
