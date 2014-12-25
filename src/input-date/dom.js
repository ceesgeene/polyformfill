'use strict';

var nativeTypeDescriptor,
  nativeValueDescriptor,
  nativeStepUp,
  nativeStepDown;

/** @const */
var INPUT_DATE_STEP_SCALE_FACTOR = 86400000;

function initDom() {
  if (HTMLInputElement && Object.isExtensible(HTMLInputElement)) {
    Object.defineProperty(HTMLInputElement.prototype, 'valueAsDate', {
      get: getValueAsDate,
      set: setValueAsDate
    });

    Object.defineProperty(HTMLInputElement.prototype, 'valueAsNumber', {
      get: getValueAsNumber,
      set: setValueAsNumber
    });

    // FF and IE
    nativeTypeDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, INPUT_ATTR_TYPE);
    // Chrome
    if (nativeTypeDescriptor === undefined) {
      nativeTypeDescriptor = Object.getOwnPropertyDescriptor(testInput, INPUT_ATTR_TYPE);
    }

    if (nativeTypeDescriptor.configurable) {
      Object.defineProperty(HTMLInputElement.prototype, INPUT_ATTR_TYPE, {
        get: getType
      });
    }

    nativeValueDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    if (nativeValueDescriptor.configurable) {
      Object.defineProperty(HTMLInputElement.prototype, 'value', {
        get: getValue,
        set: setValue
      });
    }

    inputDateNativeValueGetter = nativeValueDescriptor.get;
    inputDateNativeValueSetter = nativeValueDescriptor.set;

    nativeStepUp = HTMLInputElement.prototype.stepUp;
    HTMLInputElement.prototype.stepUp = stepUp;

    nativeStepDown = HTMLInputElement.prototype.stepDown;
    HTMLInputElement.prototype.stepDown = stepDown;
  }
}

function getValueAsDate() {
  if (this.getAttribute(INPUT_ATTR_TYPE) === 'date') {
    return inputDateGetDate(this);
  }
  return null;
}

function setValueAsDate(value) {
  if (this.getAttribute(INPUT_ATTR_TYPE) === 'date' && value instanceof Date) {
    inputDateSetDateComponents(this, value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());
  }
}

function getValueAsNumber() {
  var date;
  if (this.getAttribute(INPUT_ATTR_TYPE) === 'date') {
    date = inputDateGetDate(this);
    if (date) {
      return date.getTime();
    }
  }
  return NaN;
}

function setValueAsNumber(value) {
  var date;
  if (this.getAttribute(INPUT_ATTR_TYPE) === 'date') {
    date = new Date(0);
    date.setTime(value);
    if (date) {
      inputDateSetDateComponents(this, date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    }
    else {
      inputDateSetDateComponents(this, INPUT_DATE_YEAR_EMPTY, INPUT_DATE_MONTH_EMPTY, INPUT_DATE_DAY_EMPTY);
    }
    return value;
  }
}

function getType() {
  var attr,
    type = nativeTypeDescriptor.get.call(this);

  if (type === 'text') {
    attr = this.getAttribute(INPUT_ATTR_TYPE);
    if (attr === 'date') {
      return attr;
    }
  }
  return type;
}

function getValue() {
  if (this.getAttribute(INPUT_ATTR_TYPE) === 'date') {
    return inputDateGetRfc3339(this);
  }
  else {
    return nativeValueDescriptor.get.call(this);
  }
}

function setValue(value) {
  var date;

  if (this.getAttribute(INPUT_ATTR_TYPE) === 'date') {
    if (value !== '') {
      date = getDateFromRfc3339FullDateString(value);
    }

    if (date) {
      inputDateSetDateComponents(this, date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    }
    else {
      //console.warn("The specified value '" + value + "' does not conform to the required format, 'yyyy-MM-dd'.");
      inputDateSetDateComponents(this, INPUT_DATE_YEAR_EMPTY, INPUT_DATE_MONTH_EMPTY, INPUT_DATE_DAY_EMPTY);
    }
  }
  else {
    return nativeValueDescriptor.set.call(this, value);
  }

  return value;
}

/**
 *
 * @param n
 *
 * @link http://www.w3.org/TR/html/forms.html#dom-input-stepup
 */
function stepUp(n) {
  var attr = this.getAttribute(INPUT_ATTR_TYPE);

  if (attr === 'date') {
    n = n || 1;

  }
}

function stepDown(n) {
  var attr = this.getAttribute(INPUT_ATTR_TYPE);

  if (attr === 'date') {
    n = n || 1;

  }
}
