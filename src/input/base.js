'use strict';

function initInput(testInput) {
  // @if FEATURES.DOM
  initInputDom(testInput);
  // @endif
  // @if FEATURES.ACCESSIBILITY
  initInputAccessibility();
  // @endif
  // @if FEATURES.LOCALIZATION
  //initInputLocalization();
  // @endif
  // @if FEATURES.NORMALIZATION
  initInputNormalization();
  // @endif
}
