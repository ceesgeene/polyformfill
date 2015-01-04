'use strict';

/* global HTMLInputElement, DOMException */

/**
 * @file
 * Provides implementation of HTMLInputElement DOM interface for unsupporting browsers.
 */

var inputDomOriginalTypeGetter,
  inputDomOriginalValueGetter,
  inputDomOriginalValueSetter,
  inputDomOriginalValueAsNumberGetter,
  inputDomOriginalValueAsNumberSetter,
  inputDomOriginalStepUp,
  inputDomOriginalStepDown;

function initInputDom(testInput) {
  var descriptor;

  if (HTMLInputElement && Object.isExtensible(HTMLInputElement.prototype)) {
    // FF and IE
    descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'type');
    // Chrome
    if (descriptor === undefined) {
      descriptor = Object.getOwnPropertyDescriptor(testInput, 'type');
    }
    inputDomOriginalTypeGetter = descriptor.get;

    if (descriptor.configurable) {
      Object.defineProperty(HTMLInputElement.prototype, 'type', {
        get: inputDomTypeGet
      });
    }

    descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    if (descriptor.configurable) {
      Object.defineProperty(HTMLInputElement.prototype, 'value', {
        get: inputDomValueGet,
        set: inputDomValueSet
      });

      inputDomOriginalValueGetter = descriptor.get;
      inputDomOriginalValueSetter = descriptor.set;
    }

    descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'valueAsNumber');
    if (descriptor === undefined || descriptor.configurable) {
      Object.defineProperty(HTMLInputElement.prototype, 'valueAsNumber', {
        get: inputDomValueAsNumberGet,
        set: inputDomValueAsNumberSet
      });

      if (descriptor) {
        inputDomOriginalValueAsNumberGetter = descriptor.get;
        inputDomOriginalValueAsNumberSetter = descriptor.set;
      }
    }

    Object.defineProperty(HTMLInputElement.prototype, 'valueAsDate', {
      get: inputDomValueAsDateGet,
      set: inputDomValueAsDateSet
    });

    inputDomOriginalStepUp = HTMLInputElement.prototype.stepUp;
    HTMLInputElement.prototype.stepUp = inputDomStepUp;

    inputDomOriginalStepDown = HTMLInputElement.prototype.stepDown;
    HTMLInputElement.prototype.stepDown = inputDomStepDown;
  }
}

function inputDomException(code, message) {
  return new Error(code + ': ' + message);
}

function inputDomTypeGet() {
  var attr,
    type = inputDomOriginalTypeGetter.call(this);

  if (type === 'text') {
    attr = this.getAttribute(INPUT_ATTR_TYPE);
    switch (attr) {
      case 'date':
      case 'datetime-local':
      case 'time':
        return attr;
      default:
        return type;
    }
  }
  return type;
}

function inputDomValueGet() {
  var inputType = this.getAttribute(INPUT_ATTR_TYPE);

  switch (inputType) {
    case 'date':
      return inputDateDomValueGet(this);
    case 'datetime-local':
      return inputDatetimeLocalDomValueGet(this);
    case 'time':
      return inputTimeDomValueGet(this);
    default:
      return inputDomOriginalValueGetter.call(this);
  }
}

function inputDomValueSet(value) {
  var inputType = this.getAttribute(INPUT_ATTR_TYPE);

  switch (inputType) {
    case 'date':
      return inputDateDomValueSet(this, value);
    case 'datetime-local':
      return inputDatetimeLocalDomValueSet(this, value);
    case 'time':
      return inputTimeDomValueSet(this, value);
    default:
      return inputDomOriginalValueSetter.call(this);
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
  var inputType = this.getAttribute(INPUT_ATTR_TYPE);

  switch (inputType) {
    case 'date':
    case 'datetime-local':
    case 'time':
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
  var inputType = this.getAttribute(INPUT_ATTR_TYPE);

  switch (inputType) {
    case 'date':
    case 'datetime-local':
    case 'time':
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
  var inputType = this.getAttribute(INPUT_ATTR_TYPE);

  switch (inputType) {
    case 'date':
      return inputDateDomValueAsDateGet(this);
    case 'datetime-local':
      return inputDatetimeLocalDomValueAsDateGet(this);
    case 'time':
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
  var inputType = this.getAttribute(INPUT_ATTR_TYPE);

  if (value instanceof Date) {

  }
  switch (inputType) {
    case 'date':
      return inputDateDomValueAsDateSet(this, value);
    case 'datetime-local':
      return inputDatetimeLocalDomValueAsDateSet(this, value);
    case 'time':
      return inputTimeDomValueAsDateSet(this, value);
    default:
      return inputDomOriginalValueSetter.call(this, value);
  }
}

function inputDomStepUp(n) {
  var inputType = this.getAttribute(INPUT_ATTR_TYPE);

  n = n || 1;

  switch (inputType) {
    case 'date':
      return inputDomStepUpOrDown(this, n, INPUT_DATE_STEP_DEFAULT, INPUT_DATE_STEP_SCALE_FACTOR);
    case 'datetime-local':
      return inputDomStepUpOrDown(this, n, INPUT_TIME_STEP_DEFAULT, INPUT_TIME_STEP_SCALE_FACTOR);
    case 'time':
      return inputDomStepUpOrDown(this, n, INPUT_TIME_STEP_DEFAULT, INPUT_TIME_STEP_SCALE_FACTOR);
    default:
      return inputDomOriginalStepUp.call(this, n);
  }
}

function inputDomStepDown(n) {
  var inputType = this.getAttribute(INPUT_ATTR_TYPE);

  n = n || 1;

  switch (inputType) {
    case 'date':
      return inputDomStepUpOrDown(this, -n, INPUT_DATE_STEP_DEFAULT, INPUT_DATE_STEP_SCALE_FACTOR);
    case 'datetime-local':
      return inputDomStepUpOrDown(this, -n, INPUT_TIME_STEP_DEFAULT, INPUT_TIME_STEP_SCALE_FACTOR);
    case 'time':
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
  var allowedValueStep, delta, value;

    allowedValueStep = inputDomGetAllowedValueStep(element, defaultStep, stepScaleFactor);
    if (allowedValueStep === null) {
      throw inputDomException(DOMException.INVALID_STATE_ERR);
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

  if (element.hasAttribute('step')) {
    step = element.getAttribute('step');

    if (step === 'any') {
      return null;
    }
    step = parseInt(step, 10);
    if (step < 1) {
      step = defaultStep;
    }
  }
  else {
    step = defaultStep;
  }

  return step * stepScaleFactor;
}
