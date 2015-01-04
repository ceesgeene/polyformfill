'use strict';

/**
 * @file
 * Provides normalization of input[type=datetime-local] elements.
 */

function inputDatetimeLocalNormalizationOnLoadFormatInputElements(element) {
  var components = inputDatetimeLocalComponentsGet(element);
  inputDatetimeLocalComponentsSet(element, components.year, components.month, components.day, components.hour, components.minute, components.second, components.milisecond);
}

function inputDatetimeLocalNormalizationOnSubmitNormalizeInput(element) {
  inputDomOriginalValueSetter.call(element, inputDatetimeLocalGetRfc3339(element));
}
