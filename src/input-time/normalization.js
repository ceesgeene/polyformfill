'use strict';

/**
 * @file
 * Provides normalization of input[type=time] elements.
 */

function inputTimeNormalizationOnLoadFormatInputElements(element) {
  var components = inputTimeComponentsGet(element);
  inputTimeComponentsSet(element, components.hour, components.minute, components.second, components.milisecond);
}

function inputTimeNormalizationOnSubmitNormalizeInput(element) {
  inputDomOriginalValueSetter.call(element, inputTimeGetRfc3339(element));
}
