"use strict";

/* global HTMLInputElement */

/**
 * @file
 * Provides implementation of HTMLInputElement DOM interface for unsupporting browsers.
 */

/** @const */
var DOMEXCEPTION_INVALID_STATE_ERR = 11;

var inputDomOriginalTypeGetter,
  inputDomOriginalValueGetter,
  inputDomOriginalValueSetter,
  inputDomOriginalValueAsNumberGetter,
  inputDomOriginalValueAsNumberSetter,
  inputDomOriginalStepUp,
  inputDomOriginalStepDown,
  inputDomOriginalSetSelectionRange;

function initInputDom(testInput) {
  var descriptor, HTMLInputElementPrototype;

  if (HTMLInputElement && Object.isExtensible(HTMLInputElement.prototype)) {
    HTMLInputElementPrototype = HTMLInputElement.prototype;

    // FF and IE
    descriptor = Object.getOwnPropertyDescriptor(HTMLInputElementPrototype, INPUT_ATTR_TYPE);
    // Chrome
    if (descriptor === undefined) {
      descriptor = Object.getOwnPropertyDescriptor(testInput, INPUT_ATTR_TYPE);
    }
    inputDomOriginalTypeGetter = descriptor.get;

    if (descriptor.configurable) {
      Object.defineProperty(HTMLInputElementPrototype, INPUT_ATTR_TYPE, {
        get: inputDomTypeGet
      });
    }

    descriptor = Object.getOwnPropertyDescriptor(HTMLInputElementPrototype, INPUT_PROPERTY_VALUE);
    if (descriptor.configurable) {
      Object.defineProperty(HTMLInputElementPrototype, INPUT_PROPERTY_VALUE, {
        get: inputDomValueGet,
        set: inputDomValueSet
      });

      inputDomOriginalValueGetter = descriptor.get;
      inputDomOriginalValueSetter = descriptor.set;
    }

    descriptor = Object.getOwnPropertyDescriptor(HTMLInputElementPrototype, INPUT_PROPERTY_VALUEASNUMBER);
    if (descriptor === undefined || descriptor.configurable) {
      Object.defineProperty(HTMLInputElementPrototype, INPUT_PROPERTY_VALUEASNUMBER, {
        get: inputDomValueAsNumberGet,
        set: inputDomValueAsNumberSet
      });

      if (descriptor) {
        inputDomOriginalValueAsNumberGetter = descriptor.get;
        inputDomOriginalValueAsNumberSetter = descriptor.set;
      }
    }

    Object.defineProperty(HTMLInputElementPrototype, INPUT_PROPERTY_VALUEASDATE, {
      get: inputDomValueAsDateGet,
      set: inputDomValueAsDateSet
    });

    inputDomOriginalStepUp = HTMLInputElementPrototype.stepUp;
    HTMLInputElementPrototype.stepUp = inputDomStepUp;

    inputDomOriginalStepDown = HTMLInputElementPrototype.stepDown;
    HTMLInputElementPrototype.stepDown = inputDomStepDown;

    inputDomOriginalSetSelectionRange = HTMLInputElementPrototype.setSelectionRange;
  }
}

function inputDomException(code, message) {
  return new Error(code + ": " + message);
}

function inputDomTypeGet() {
  var attr,
    type = inputDomOriginalTypeGetter.call(this);

  if (INPUT_TYPE_TEXT === type) {
    attr = this.getAttribute(INPUT_ATTR_TYPE);
    switch (attr) {
      case INPUT_TYPE_DATE:
      case INPUT_TYPE_DATETIME_LOCAL:
      case INPUT_TYPE_TIME:
        return attr;
      default:
        return type;
    }
  }
  return type;
}

function inputDomValueGet() {
  switch (this.getAttribute(INPUT_ATTR_TYPE)) {
    case INPUT_TYPE_DATE:
      return inputDateDomValueGet(this);
    case INPUT_TYPE_DATETIME_LOCAL:
      return inputDatetimeLocalDomValueGet(this);
    case INPUT_TYPE_TIME:
      return inputTimeDomValueGet(this);
    default:
      return inputDomOriginalValueGetter.call(this);
  }
}

function inputDomValueSet(value) {
  switch (this.getAttribute(INPUT_ATTR_TYPE)) {
    case INPUT_TYPE_DATE:
      return inputDateDomValueSet(this, value);
    case INPUT_TYPE_DATETIME_LOCAL:
      return inputDatetimeLocalDomValueSet(this, value);
    case INPUT_TYPE_TIME:
      return inputTimeDomValueSet(this, value);
    default:
      return inputDomOriginalValueSetter.call(this, value);
  }
}

/**
 * Returns a number representing the form control's value, if applicable; otherwise, returns NaN.
 *
 * @returns Number|NaN
 *
 * @see {@link http://www.w3.org/TR/html/forms.html#dom-input-valueasnumber}
 */
function inputDomValueAsNumberGet() {
  switch (this.getAttribute(INPUT_ATTR_TYPE)) {
    case INPUT_TYPE_DATE:
    case INPUT_TYPE_DATETIME_LOCAL:
    case INPUT_TYPE_TIME:
      return inputDomValueAsNumberGetFromDate.call(this);
    default:
      if (inputDomOriginalValueAsNumberGetter) {
        return inputDomOriginalValueAsNumberGetter.call(this);
      }
      return NaN;
  }
}

/**
 * Returns a number representing the form control's value by converting the value to a Date object and using its time value; otherwise, returns NaN.
 *
 * @returns Number|NaN
 */
function inputDomValueAsNumberGetFromDate() {
  var date = inputDomValueAsDateGet.call(this);
  if (date) {
    return date.getTime();
  }
  return NaN;
}

/**
 * Sets the form control's value using by converting the numeric value, if applicable.
 *
 * @see {@link http://www.w3.org/TR/html/forms.html#dom-input-valueasnumber}
 */
function inputDomValueAsNumberSet(value) {
  switch (this.getAttribute(INPUT_ATTR_TYPE)) {
    case INPUT_TYPE_DATE:
    case INPUT_TYPE_DATETIME_LOCAL:
    case INPUT_TYPE_TIME:
      inputDomValueAsNumberSetFromDate.call(this, value);
      break;
    default:
      inputDomOriginalValueSetter.call(this);
      break;
  }
}

/**
 * Sets the form control's value by converting the numeric value to a Date object.
 */
function inputDomValueAsNumberSetFromDate(value) {
  var date = new Date(value);
  if (date) {
    inputDomValueAsDateSet.call(this, date);
  }
}

/**
 * Returns a Date object representing the form control's value, if applicable; otherwise, returns null.
 *
 * @see {@link http://www.w3.org/TR/html/forms.html#dom-input-valueasdate}
 */
function inputDomValueAsDateGet() {
  switch (this.getAttribute(INPUT_ATTR_TYPE)) {
    case INPUT_TYPE_DATE:
      return inputDateDomValueAsDateGet(this);
    case INPUT_TYPE_DATETIME_LOCAL:
      return inputDatetimeLocalDomValueAsDateGet(this);
    case INPUT_TYPE_TIME:
      return inputTimeDomValueAsDateGet(this);
    default:
      return null;
  }
}

/**
 * Sets the form control's value by using a Date object, if applicable.
 *
 * @see {@link http://www.w3.org/TR/html/forms.html#dom-input-valueasdate}
 */
function inputDomValueAsDateSet(value) {
  if (value instanceof Date) {

  }
  switch (this.getAttribute(INPUT_ATTR_TYPE)) {
    case INPUT_TYPE_DATE:
      return inputDateDomValueAsDateSet(this, value);
    case INPUT_TYPE_DATETIME_LOCAL:
      return inputDatetimeLocalDomValueAsDateSet(this, value);
    case INPUT_TYPE_TIME:
      return inputTimeDomValueAsDateSet(this, value);
    default:
      return inputDomOriginalValueSetter.call(this, value);
  }
}

function inputDomStepUp(n) {
  n = n || 1;

  switch (this.getAttribute(INPUT_ATTR_TYPE)) {
    case INPUT_TYPE_DATE:
      return inputDomStepUpOrDown(this, n, INPUT_DATE_STEP_DEFAULT, INPUT_DATE_STEP_SCALE_FACTOR);
    case INPUT_TYPE_DATETIME_LOCAL:
      return inputDomStepUpOrDown(this, n, INPUT_TIME_STEP_DEFAULT, INPUT_TIME_STEP_SCALE_FACTOR);
    case INPUT_TYPE_TIME:
      return inputDomStepUpOrDown(this, n, INPUT_TIME_STEP_DEFAULT, INPUT_TIME_STEP_SCALE_FACTOR);
    default:
      return inputDomOriginalStepUp.call(this, n);
  }
}

function inputDomStepDown(n) {
  n = n || 1;

  switch (this.getAttribute(INPUT_ATTR_TYPE)) {
    case INPUT_TYPE_DATE:
      return inputDomStepUpOrDown(this, -n, INPUT_DATE_STEP_DEFAULT, INPUT_DATE_STEP_SCALE_FACTOR);
    case INPUT_TYPE_DATETIME_LOCAL:
      return inputDomStepUpOrDown(this, -n, INPUT_TIME_STEP_DEFAULT, INPUT_TIME_STEP_SCALE_FACTOR);
    case INPUT_TYPE_TIME:
      return inputDomStepUpOrDown(this, -n, INPUT_TIME_STEP_DEFAULT, INPUT_TIME_STEP_SCALE_FACTOR);
    default:
      return inputDomOriginalStepUp.call(this, n);
  }
}

/**
 * Applies the step algorithm to an input element.
 *
 * @param element
 * @param n
 * @param defaultStep
 * @param stepScaleFactor
 *
 * @see {@link http://www.w3.org/TR/html/forms.html#dom-input-stepup}
 */
function inputDomStepUpOrDown(element, n, defaultStep, stepScaleFactor) {
  var allowedValueStep = inputDomGetAllowedValueStep(element, defaultStep, stepScaleFactor), delta, value;

  if (null === allowedValueStep) {
    throw inputDomException(DOMEXCEPTION_INVALID_STATE_ERR);
  }

  value = element.valueAsNumber;

  delta = allowedValueStep * n;

  value += delta;

  element.valueAsNumber = value;
}

/**
 *
 * @param element
 * @param defaultStep
 * @param stepScaleFactor
 * @returns Number
 *
 * @see {@link http://www.w3.org/TR/html/forms.html#concept-input-step}
 */
function inputDomGetAllowedValueStep(element, defaultStep, stepScaleFactor) {
  var step;

  if (element.hasAttribute("step")) {
    step = element.getAttribute("step");

    if ("any" === step) {
      return null;
    }
    step = parseInt(step, 10);
    if (1 > step) {
      step = defaultStep;
    }
  }
  else {
    step = defaultStep;
  }

  return step * stepScaleFactor;
}
