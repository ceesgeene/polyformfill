'use strict';

var inputDomOriginalTypeGetter,
  inputDomOriginalValueGetter,
  inputDomOriginalValueSetter,
  inputDomOriginalStepUp,
  inputDomOriginalStepDown;

function initInputDom() {
  var originalTypeDescriptor, originalValueDescriptor;

  if (HTMLInputElement && Object.isExtensible(HTMLInputElement.prototype)) {

    // FF and IE
    originalTypeDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'type');
    // Chrome
    if (originalTypeDescriptor === undefined) {
      originalTypeDescriptor = Object.getOwnPropertyDescriptor(testInput, 'type');
    }
    inputDomOriginalTypeGetter = originalTypeDescriptor.get;

    if (originalTypeDescriptor.configurable) {
      Object.defineProperty(HTMLInputElement.prototype, 'type', {
        get: inputDomTypeGet
      });
    }

    originalValueDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    if (originalValueDescriptor.configurable) {
      Object.defineProperty(HTMLInputElement.prototype, 'value', {
        get: inputDomValueGet,
        set: inputDomValueSet
      });

      inputDomOriginalValueGetter = originalValueDescriptor.get;
      inputDomOriginalValueSetter = originalValueDescriptor.set;
    }

    Object.defineProperty(HTMLInputElement.prototype, 'valueAsNumber', {
      get: inputDomValueAsNumberGet,
      set: inputDomValueAsNumberSet
    });

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
  return new Error(message);
}

function inputDomTypeGet() {
  var attr,
    type = inputDomOriginalTypeGetter.call(this);

  if (type === 'text') {
    attr = this.getAttribute(INPUT_ATTR_TYPE);
    switch (attr) {
      case 'date':
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
      return inputDateValueGet(this);
    case 'time':
      return inputTimeValueGet(this);
    default:
      return inputDomOriginalValueGetter.call(this);
  }
}

function inputDomValueSet(value) {
  var inputType = this.getAttribute(INPUT_ATTR_TYPE);

  switch (inputType) {
    case 'date':
      return inputDateValueSet(this, value);
    case 'time':
      return inputTimeValueSet(this, value);
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
    case 'time':
      return inputDomValueAsNumberGetFromDate.call(this);
    default:
      return inputDomOriginalValueSetter.call(this);
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
      return inputDateValueAsDateGet(this);
    case 'time':
      return inputTimeValueAsDateGet(this);
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
      return inputDateValueAsDateSet(this, value);
    case 'time':
      return inputTimeValueAsDateSet(this, value);
    default:
      return inputDomOriginalValueSetter.call(this, value);
  }
}

function inputDomStepUp(n) {
  var inputType = this.getAttribute(INPUT_ATTR_TYPE);

  n = n || 1;

  switch (inputType) {
    case 'date':
    case 'time':
      return inputDomStepUpOrDown(this, n, INPUT_DATE_STEP_SCALE_FACTOR);
    default:
      return inputDomOriginalStepUp.call(this, n);
  }
}

function inputDomStepDown(n) {
  var inputType = this.getAttribute(INPUT_ATTR_TYPE);

  n = n || 1;

  switch (inputType) {
    case 'date':
    case 'time':
      return inputDomStepUpOrDown(this, -n, INPUT_DATE_STEP_SCALE_FACTOR);
    default:
      return inputDomOriginalStepUp.call(this, n);
  }
}

/**
 * Applies the step algorithm to an input element.
 *
 * @param element
 * @param n
 * @param stepScaleFactor
 *
 * @see {@link http://www.w3.org/TR/html/forms.html#dom-input-stepup}
 */
function inputDomStepUpOrDown(element, n, stepScaleFactor) {
  var allowedValueStep, delta, value;

    allowedValueStep = inputDomGetAllowedValueStep(element, 1, stepScaleFactor);
    if (allowedValueStep === null) {
      throw inputDomException(DOMException.INVALID_STATE_ERR);
    }

    value = element.valueAsNumber;

    delta = allowedValueStep * n;

    value += delta;

  element.valueAsNumber = value;
}

function inputDomGetAllowedValueStep(element, defaultStep, stepScaleFactor) {
  defaultStep = defaultStep || 1;
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
