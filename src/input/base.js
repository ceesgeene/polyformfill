'use strict';

function initInput() {
  // @ifdef FEATURE_DOM
  initInputDom();
  // @endif
  // @ifdef FEATURE_ACCESSIBILITY
  //initInputTimeAccessibility();
  // @endif
  // @ifdef FEATURE_LOCALIZATION
  //initInputTimeLocalization();
  // @endif
  // @ifdef FEATURE_NORMALIZATION
  //initInputTimeNormalization();
  // @endif
}
