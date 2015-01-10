"use strict";

/**
 * @file
 * Provides normalization of input[type=date] elements.
 */

function inputDateNormalizationOnLoadFormatInputElements(element) {
  var components = inputDateComponentsGet(element);
  inputDateComponentsSet(element, components);
}

function inputDateNormalizationOnSubmitNormalizeInput(element) {
  inputDomOriginalValueSetter.call(element, inputDateGetRfc3339(element));
}
