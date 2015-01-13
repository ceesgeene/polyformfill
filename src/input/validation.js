"use strict";

/**
 * @file
 * Provides a polyfill for the constraint validation feature of html for input elements.
 *
 * @see {@link http://www.w3.org/TR/html5/forms.html#constraints}
 */


function initInputValidation() {
  var HTMLInputElementPrototype;

  if (window.ValidityState === undefined && HTMLInputElement && Object.isExtensible(HTMLInputElement.prototype)) {
    HTMLInputElementPrototype = HTMLInputElement.prototype;

    Object.defineProperty(HTMLInputElementPrototype, "willValidate", {
      get: inputValidationWillValidate
    });

    HTMLInputElementPrototype.setCustomValidity = inputValidationSetCustomValidity;

    Object.defineProperty(HTMLInputElementPrototype, "validity", {
      configurable: true,
      get: inputValidationValidityGet
    });

    HTMLInputElementPrototype.checkValidity = inputValidationCheckValidity;

    Object.defineProperty(HTMLInputElementPrototype, "validationMessage", {
      get: inputValidationValidationMessageGet,
      set: inputValidationValidationMessageSet
    });

    InputValidationValidityStateConstructor.prototype = new InputValidationValidityStatePrototype;
    window.ValidityState = InputValidationValidityStateConstructor;
  }
}

function inputValidationWillValidate() {
  return !(this.disabled || this.readonly);
}

function inputValidationSetCustomValidity(error) {
  this.validationMessage = error;
}


function inputValidationValidityGet() {
  /*Object.defineProperty(this, "validity", {
   value: new InputValidationValidityStateConstructor()
   });*/
  if (this.__polyformfillInputValidityState === undefined) {
    this.__polyformfillInputValidityState = new InputValidationValidityStateConstructor(this);
  }
  return this.__polyformfillInputValidityState;
}


function inputValidationCheckValidity() {
  var invalid, event;

  if (this.required && "" === this.value) {
    invalid = true;
  }
  else if(this.validationMessage) {
    invalid = true;
  }

  if (invalid) {
    event = document.createEvent("CustomEvent");
    event.initCustomEvent("invalid", true, true, null);

    this.dispatchEvent(event);
    return false;
  }

  return true;
}

function inputValidationValidationMessageGet() {
  return this.__polyformfillValidationMessage || "";
}

function inputValidationValidationMessageSet(value) {
  this.__polyformfillValidationMessage = value;
}


function InputValidationValidityStateConstructor(element) {
  this.__polyformfillElement = element;
}

function InputValidationValidityStatePrototype() {
  Object.defineProperty(this, "valueMissing", {
    get: inputValidationValidityStateValueMissing
  });
  Object.defineProperty(this, "typeMismatch", {
    get: inputValidationValidityStateTypeMismatch
  });
  Object.defineProperty(this, "patternMismatch", {
    get: inputValidationValidityStatePatternMismatch
  });
  Object.defineProperty(this, "tooLong", {
    get: inputValidationValidityStateTooLong
  });
  Object.defineProperty(this, "tooShort", {
    get: inputValidationValidityStateTooShort
  });
  Object.defineProperty(this, "rangeUnderflow", {
    get: inputValidationValidityStateRangeUnderflow
  });
  Object.defineProperty(this, "rangeOverflow", {
    get: inputValidationValidityStateRangeOverflow
  });
  Object.defineProperty(this, "stepMismatch", {
    get: inputValidationValidityStateStepMismatch
  });
  Object.defineProperty(this, "badInput", {
    get: inputValidationValidityStateBadInput
  });
  Object.defineProperty(this, "customError", {
    get: inputValidationValidityStateCustomError
  });
  Object.defineProperty(this, "valid", {
    get: inputValidationValidityStateValid
  });
}

function inputValidationValidityStateValueMissing() {
  return (this.__polyformfillElement.required && "" === this.__polyformfillElement.value);
}

function inputValidationValidityStateTypeMismatch() {
  return false;
}

function inputValidationValidityStatePatternMismatch() {
  return false;
}

function inputValidationValidityStateTooLong() {
  return false;
}

function inputValidationValidityStateTooShort() {
  return false;
}

function inputValidationValidityStateRangeUnderflow() {
  return false;
}

function inputValidationValidityStateRangeOverflow() {
  return false;
}

function inputValidationValidityStateStepMismatch() {
  return false;
}

function inputValidationValidityStateBadInput() {
  return false;
}

function inputValidationValidityStateCustomError() {
  return !!(this.__polyformfillElement.validationMessage);
}

function inputValidationValidityStateValid() {
  return false;
}
