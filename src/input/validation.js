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

    defineAccessorProperty(HTMLInputElementPrototype, "willValidate", inputValidationWillValidate);

    HTMLInputElementPrototype.setCustomValidity = inputValidationSetCustomValidity;

    defineAccessorProperty(HTMLInputElementPrototype, "validity", inputValidationValidityGet);

    HTMLInputElementPrototype.checkValidity = inputValidationCheckValidity;

    defineAccessorProperty(HTMLInputElementPrototype, "validationMessage", inputValidationValidationMessageGet,inputValidationValidationMessageSet);

    InputValidationValidityState.prototype = new InputValidationValidityStatePrototype;
    window.ValidityState = InputValidationValidityState;
  }
}

function inputValidationWillValidate() {
  return !(this.disabled || this.readOnly);
}

function inputValidationSetCustomValidity(error) {
  this.validationMessage = error;
}


function inputValidationValidityGet() {
  if (this.__polyformfillInputValidity === undefined) {
    this.__polyformfillInputValidity = new InputValidationValidityState(this);
  }
  return this.__polyformfillInputValidity;
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


function InputValidationValidityState(element) {
  this.__polyformfillElement = element;
}

function InputValidationValidityStatePrototype() {
  defineAccessorProperty(this, "valueMissing", inputValidationValidityStateValueMissing);
  defineAccessorProperty(this, "typeMismatch", inputValidationValidityStateTypeMismatch);
  defineAccessorProperty(this, "patternMismatch", inputValidationValidityStatePatternMismatch);
  defineAccessorProperty(this, "tooLong", inputValidationValidityStateTooLong);
  defineAccessorProperty(this, "tooShort", inputValidationValidityStateTooShort);
  defineAccessorProperty(this, "rangeUnderflow", inputValidationValidityStateRangeUnderflow);
  defineAccessorProperty(this, "rangeOverflow", inputValidationValidityStateRangeOverflow);
  defineAccessorProperty(this, "stepMismatch", inputValidationValidityStateStepMismatch);
  defineAccessorProperty(this, "badInput", inputValidationValidityStateBadInput);
  defineAccessorProperty(this, "customError", inputValidationValidityStateCustomError);
  defineAccessorProperty(this, "valid", inputValidationValidityStateValid);
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
