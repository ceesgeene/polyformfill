"use strict";

/**
 * @file
 * Provides normalization of input[type=datetime-local] elements.
 */

function inputDatetimeLocalNormalizationOnLoadFormatInputElements(element) {
  var components = inputDatetimeLocalComponentsGet(element);
  inputDatetimeLocalComponentsSet(element, components);
}

function inputDatetimeLocalNormalizationOnSubmitNormalizeInput(element) {
  inputDomOriginalValueSetter.call(element, inputDatetimeLocalGetRfc3339(element));
}
