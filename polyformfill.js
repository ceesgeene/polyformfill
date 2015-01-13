!function(window, document, undefined) {
  "use strict";
  function init() {
    var testInput = document.createElement("input");
    if (!(INPUT_PROPERTY_VALUEASDATE in testInput)) {
      initInput(testInput);
      initInputDate();
      initInputDatetimeLocal();
      initInputTime();
    }
  }
  function initInputAccessibility(addEventListener) {
    addEventListener("keydown", inputAccessibilityOnKeydownHandleNavigation);
    addEventListener("keypress", inputAccessibilityOnKeyPressHandleUserInput);
    addEventListener("focus", inputAccessibilityOnFocusHandleInputSelection, true);
    addEventListener("focusin", inputAccessibilityOnFocusHandleInputSelection);
    addEventListener("click", inputAccessibilityOnFocusHandleInputSelection);
    addEventListener("blur", inputAccessibilityOnBlurHandleInputNormalization, true);
  }
  function inputAccessibilityOnKeydownHandleNavigation(event) {
    if (event.charCode) {
      return;
    }
    if (event.target instanceof HTMLInputElement) {
      switch (event.target.getAttribute(INPUT_ATTR_TYPE)) {
       case INPUT_TYPE_DATE:
        inputDateAccessibilityOnKeydownHandleNavigation(event.target, event);
        break;

       case INPUT_TYPE_DATETIME_LOCAL:
        inputDatetimeLocalAccessibilityOnKeydownHandleNavigation(event.target, event);
        break;

       case INPUT_TYPE_TIME:
        inputTimeAccessibilityOnKeydownHandleNavigation(event.target, event);
      }
    }
  }
  function inputAccessibilityOnKeyPressHandleUserInput(event) {
    if (event.defaultPrevented) {
      return;
    }
    if (event.altKey || event.ctrlKey || event.shiftKey || event.metaKey || !event.charCode) {
      return;
    }
    if (event.target instanceof HTMLInputElement) {
      switch (event.target.getAttribute(INPUT_ATTR_TYPE)) {
       case INPUT_TYPE_DATE:
        inputDateAccessibilityOnKeyPressHandleUserInput(event.target, event);
        break;

       case INPUT_TYPE_DATETIME_LOCAL:
        inputDatetimeLocalAccessibilityOnKeyPressHandleUserInput(event.target, event);
        break;

       case INPUT_TYPE_TIME:
        inputTimeAccessibilityOnKeyPressHandleUserInput(event.target, event);
      }
    }
  }
  function inputAccessibilityOnFocusHandleInputSelection(event) {
    if (event.target instanceof HTMLInputElement) {
      switch (event.target.getAttribute(INPUT_ATTR_TYPE)) {
       case INPUT_TYPE_DATE:
        inputDateAccessibilityOnFocusHandleInputSelection(event.target, event);
        break;

       case INPUT_TYPE_DATETIME_LOCAL:
        inputDatetimeLocalAccessibilityOnFocusHandleInputSelection(event.target, event);
        break;

       case INPUT_TYPE_TIME:
        inputTimeAccessibilityOnFocusHandleInputSelection(event.target, event);
      }
    }
  }
  function inputAccessibilityOnBlurHandleInputNormalization(event) {
    if (event.target instanceof HTMLInputElement) {
      switch (event.target.getAttribute(INPUT_ATTR_TYPE)) {
       case INPUT_TYPE_DATE:
        inputDateAccessibilityOnBlurHandleInputNormalization(event.target);
        break;

       case INPUT_TYPE_DATETIME_LOCAL:
        inputDatetimeLocalAccessibilityOnBlurHandleInputNormalization(event.target);
        break;

       case INPUT_TYPE_TIME:
        inputTimeAccessibilityOnBlurHandleInputNormalization(event.target);
      }
    }
  }
  function inputAccessibilityIncreaseComponent(value, amount, min, max) {
    value += amount;
    if (value > max) {
      value = min;
    } else {
      if (value < min) {
        value = max;
      }
    }
    return value;
  }
  function inputAccessibilityComplementComponent(value, addition, min, max, limit) {
    if (value > limit) {
      value = parseInt(addition, 10);
      if (0 === min) {
        value -= 1;
      }
    } else {
      if (0 === min) {
        value = parseInt("" + (value + 1) + addition, 10) - 1;
      } else {
        value = parseInt("" + value + addition, 10);
      }
    }
    if (value > max) {
      value = max;
    }
    return value;
  }
  function inputAccessibilityPreviousSeparator(value, position, componentSeparators) {
    var test, i, previous = 0, componentSeparatorsCount = componentSeparators.length;
    for (i = 0; i < componentSeparatorsCount; i++) {
      test = value.lastIndexOf(componentSeparators[i], position - 1) + 1;
      if (test > previous) {
        previous = test;
      }
    }
    return previous;
  }
  function inputAccessibilityNextSeparator(value, position, componentSeparators) {
    var test, i, next = value.length, componentSeparatorsCount = componentSeparators.length;
    for (i = 0; i < componentSeparatorsCount; i++) {
      test = value.indexOf(componentSeparators[i], position);
      if (test < next && test !== -1) {
        next = test;
      }
    }
    return next;
  }
  function inputAccessibilityGetComponentRange(value, position, componentSeparators) {
    var start = inputAccessibilityPreviousSeparator(value, position, componentSeparators), end = inputAccessibilityNextSeparator(value, position, componentSeparators);
    return [ start, end ];
  }
  function inputAccessibilityGetPreviousComponentRange(value, position, componentSeparators) {
    var start, end;
    end = inputAccessibilityPreviousSeparator(value, position, componentSeparators);
    if (0 === end) {
      start = end;
      end = inputAccessibilityNextSeparator(value, position, componentSeparators);
    } else {
      end -= 1;
      start = inputAccessibilityPreviousSeparator(value, end, componentSeparators);
    }
    return [ start, end ];
  }
  function inputAccessibilityGetNextComponentRange(value, position, componentSeparators) {
    var start, end;
    start = inputAccessibilityNextSeparator(value, position, componentSeparators);
    if (start === value.length) {
      end = start;
      start = inputAccessibilityPreviousSeparator(value, position, componentSeparators);
    } else {
      start += 1;
      end = inputAccessibilityNextSeparator(value, start, componentSeparators);
    }
    return [ start, end ];
  }
  function inputAccessibilityGetSelectedComponentNumber(value, position, componentSeparators) {
    var number = 0;
    while (0 < position) {
      position = inputAccessibilityPreviousSeparator(value, position, componentSeparators) - 1;
      if (0 < position) {
        number++;
      }
    }
    return number;
  }
  function inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator) {
    return componentOrder[inputAccessibilityGetSelectedComponentNumber(value, selectionStart, componentSeparator)];
  }
  function initInput(testInput) {
    initInputDom(testInput);
    initInputValidation();
    initInputAccessibility(window.addEventListener);
    initInputNormalization(window.addEventListener);
  }
  function inputComponentGetMinimum(element, selectedComponent) {
    if (element.hasAttribute("min")) {}
    switch (selectedComponent) {
     case INPUT_COMPONENT_YEAR:
      return INPUT_DATE_YEAR_MIN;

     case INPUT_COMPONENT_MONTH:
      return INPUT_DATE_MONTH_MIN;

     case INPUT_COMPONENT_DAY:
      return INPUT_DATE_DAY_MIN;

     case INPUT_COMPONENT_HOUR:
      return INPUT_TIME_COMPONENT_HOUR_MIN;

     case INPUT_COMPONENT_MINUTE:
      return INPUT_TIME_COMPONENT_MINUTE_MIN;

     case INPUT_COMPONENT_SECOND:
      return INPUT_TIME_COMPONENT_SECOND_MIN;

     case INPUT_COMPONENT_MILISECOND:
      return INPUT_TIME_COMPONENT_MILISECOND_MIN;
    }
  }
  function inputComponentGetMaximum(element, selectedComponent) {
    if (element.hasAttribute("max")) {}
    switch (selectedComponent) {
     case INPUT_COMPONENT_YEAR:
      return INPUT_DATE_YEAR_MAX;

     case INPUT_COMPONENT_MONTH:
      return INPUT_DATE_MONTH_MAX;

     case INPUT_COMPONENT_DAY:
      return INPUT_DATE_DAY_MAX;

     case INPUT_COMPONENT_HOUR:
      return INPUT_TIME_COMPONENT_HOUR_MAX;

     case INPUT_COMPONENT_MINUTE:
      return INPUT_TIME_COMPONENT_MINUTE_MAX;

     case INPUT_COMPONENT_SECOND:
      return INPUT_TIME_COMPONENT_SECOND_MAX;

     case INPUT_COMPONENT_MILISECOND:
      return INPUT_TIME_COMPONENT_MILISECOND_MAX;
    }
  }
  function initInputDom(testInput) {
    var descriptor, HTMLInputElementPrototype;
    if (HTMLInputElement && Object.isExtensible(HTMLInputElement.prototype)) {
      HTMLInputElementPrototype = HTMLInputElement.prototype;
      descriptor = Object.getOwnPropertyDescriptor(HTMLInputElementPrototype, INPUT_ATTR_TYPE);
      if (descriptor === undefined) {
        descriptor = Object.getOwnPropertyDescriptor(testInput, INPUT_ATTR_TYPE);
      }
      inputDomOriginalTypeGetter = descriptor.get;
      if (descriptor.configurable) {
        Object.defineProperty(HTMLInputElementPrototype, INPUT_ATTR_TYPE, {
          get: inputDomTypeGet
        });
      }
      descriptor = Object.getOwnPropertyDescriptor(HTMLInputElementPrototype, "required");
      if (descriptor === undefined) {
        Object.defineProperty(HTMLInputElementPrototype, "required", {
          get: inputDomRequiredGet,
          set: inputDomRequiredSet
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
    var attr, type = inputDomOriginalTypeGetter.call(this);
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
  function inputDomRequiredGet() {
    return this.hasAttribute("required");
  }
  function inputDomRequiredSet(value) {
    if (value) {
      this.setAttribute("required", "");
    } else {
      this.removeAttribute("required");
    }
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
      return 0/0;
    }
  }
  function inputDomValueAsNumberGetFromDate() {
    var date = inputDomValueAsDateGet.call(this);
    if (date) {
      return date.getTime();
    }
    return 0/0;
  }
  function inputDomValueAsNumberSet(value) {
    switch (this.getAttribute(INPUT_ATTR_TYPE)) {
     case INPUT_TYPE_DATE:
     case INPUT_TYPE_DATETIME_LOCAL:
     case INPUT_TYPE_TIME:
      inputDomValueAsNumberSetFromDate.call(this, value);
      break;

     default:
      inputDomOriginalValueSetter.call(this);
    }
  }
  function inputDomValueAsNumberSetFromDate(value) {
    var date = new Date(value);
    if (date) {
      inputDomValueAsDateSet.call(this, date);
    }
  }
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
  function inputDomValueAsDateSet(value) {
    if (value instanceof Date) {}
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
  function inputDomStepUpOrDown(element, n, defaultStep, stepScaleFactor) {
    var delta, value, allowedValueStep = inputDomGetAllowedValueStep(element, defaultStep, stepScaleFactor);
    if (null === allowedValueStep) {
      throw inputDomException(DOMEXCEPTION_INVALID_STATE_ERR);
    }
    value = element.valueAsNumber;
    delta = allowedValueStep * n;
    value += delta;
    element.valueAsNumber = value;
  }
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
    } else {
      step = defaultStep;
    }
    return step * stepScaleFactor;
  }
  function initInputNormalization(addEventListener) {
    addEventListener("load", inputNormalizationOnLoadFormatInputElements);
    addEventListener("submit", inputNormalizationOnSubmitNormalizeInput);
  }
  function inputNormalizationOnLoadFormatInputElements(event) {
    var i, elements = event.target.getElementsByTagName("INPUT");
    for (i = 0; i < elements.length; i++) {
      switch (elements[i].getAttribute(INPUT_ATTR_TYPE)) {
       case INPUT_TYPE_DATE:
        inputDateNormalizationOnLoadFormatInputElements(elements[i]);
        break;

       case INPUT_TYPE_DATETIME_LOCAL:
        inputDatetimeLocalNormalizationOnLoadFormatInputElements(elements[i]);
        break;

       case INPUT_TYPE_TIME:
        inputTimeNormalizationOnLoadFormatInputElements(elements[i]);
      }
    }
  }
  function inputNormalizationOnSubmitNormalizeInput(event) {
    var i, elements = event.target.elements;
    for (i = 0; i < elements.length; i++) {
      switch (elements[i].getAttribute(INPUT_ATTR_TYPE)) {
       case INPUT_TYPE_DATE:
        inputDateNormalizationOnSubmitNormalizeInput(elements[i]);
        break;

       case INPUT_TYPE_DATETIME_LOCAL:
        inputDatetimeLocalNormalizationOnSubmitNormalizeInput(elements[i]);
        break;

       case INPUT_TYPE_TIME:
        inputTimeNormalizationOnSubmitNormalizeInput(elements[i]);
      }
    }
  }
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
      InputValidationValidityStateConstructor.prototype = new InputValidationValidityStatePrototype();
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
    if (this.__polyformfillInputValidityState === undefined) {
      this.__polyformfillInputValidityState = new InputValidationValidityStateConstructor(this);
    }
    return this.__polyformfillInputValidityState;
  }
  function inputValidationCheckValidity() {
    var invalid, event;
    if (this.required && "" === this.value) {
      invalid = true;
    } else {
      if (this.validationMessage) {
        invalid = true;
      }
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
    return this.__polyformfillElement.required && "" === this.__polyformfillElement.value;
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
    return !!this.__polyformfillElement.validationMessage;
  }
  function inputValidationValidityStateValid() {
    return false;
  }
  function inputDateAccessibilityOnKeydownHandleNavigation(element, event) {
    var selectionStart = element.selectionStart;
    switch (event.key) {
     case "Backspace":
     case "U+0008":
     case "Del":
      inputDateAccessibilityClearComponent(element, selectionStart);
      break;

     case "Tab":
     case "U+0009":
      inputDateAccessibilityOnTabKeydownHandleNavigation(element, event, selectionStart);
      return;

     case "Left":
      inputDateAccessibilityNormalizeSelectedComponent(element, selectionStart);
      inputDateAccessibilitySelectPreviousComponent(element, selectionStart);
      break;

     case "Up":
      inputDateAccessibilityIncreaseComponent(element, selectionStart, 1);
      break;

     case "Right":
      inputDateAccessibilityNormalizeSelectedComponent(element, selectionStart);
      inputDateAccessibilitySelectNextComponent(element, selectionStart);
      break;

     case "Down":
      inputDateAccessibilityIncreaseComponent(element, selectionStart, -1);
      break;

     default:
      return;
    }
    event.preventDefault();
  }
  function inputDateAccessibilityOnTabKeydownHandleNavigation(element, event, selectionStart) {
    inputDateAccessibilityNormalizeSelectedComponent(element, selectionStart);
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    if (event.shiftKey) {
      if (0 !== inputAccessibilityGetSelectedComponentNumber(inputDomOriginalValueGetter.call(element), selectionStart, inputDateFormatSeparatorGetter(element))) {
        inputDateAccessibilitySelectPreviousComponent(element, selectionStart);
      } else {
        return;
      }
    } else {
      if (2 !== inputAccessibilityGetSelectedComponentNumber(inputDomOriginalValueGetter.call(element), selectionStart, inputDateFormatSeparatorGetter(element))) {
        inputDateAccessibilitySelectNextComponent(element, selectionStart);
      } else {
        return;
      }
    }
    event.preventDefault();
  }
  function inputDateAccessibilityOnKeyPressHandleUserInput(element, event) {
    var selectionStart, value, components, componentOrder, componentSeparator, selectedComponent, componentMin, componentMax, componentLimit;
    if (47 < event.charCode && 58 > event.charCode) {
      selectionStart = element.selectionStart;
      value = inputDomOriginalValueGetter.call(element);
      components = inputDateComponentsGet(element);
      componentOrder = inputDateFormatOrderGetter(element);
      componentSeparator = inputDateFormatSeparatorGetter(element);
      selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);
      componentMin = inputComponentGetMinimum(element, selectedComponent);
      componentMax = inputComponentGetMaximum(element, selectedComponent);
      componentLimit = componentMax / 10;
      components[selectedComponent] = inputAccessibilityComplementComponent(components[selectedComponent], event.key, componentMin, componentMax, componentLimit);
      value = inputDateComponentsSet(element, components);
      if (components[selectedComponent] > componentLimit) {
        inputDateAccessibilitySelectNextComponent(element, selectionStart);
      } else {
        inputDomOriginalSetSelectionRange.apply(element, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
      }
    }
    event.preventDefault();
  }
  function inputDateAccessibilityOnFocusHandleInputSelection(element, event) {
    var componentRange, value, selectionStart, componentSeparator;
    value = inputDomOriginalValueGetter.call(element);
    componentSeparator = inputDateFormatSeparatorGetter(element);
    if (!value) {
      value = inputDateComponentsSet(element, {
        yy: INPUT_DATE_YEAR_EMPTY,
        mm: INPUT_DATE_MONTH_EMPTY,
        dd: INPUT_DATE_DAY_EMPTY
      });
      selectionStart = 0;
    } else {
      selectionStart = element.selectionStart;
    }
    componentRange = inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator);
    inputDomOriginalSetSelectionRange.apply(element, componentRange);
    event.preventDefault();
  }
  function inputDateAccessibilityOnBlurHandleInputNormalization(element) {
    inputDateAccessibilityNormalizeSelectedComponent(element, element.selectionStart);
  }
  function inputDateAccessibilityClearComponent(element, selectionStart) {
    var value = inputDomOriginalValueGetter.call(element), components = inputDateComponentsGet(element), componentOrder = inputDateFormatOrderGetter(element), componentSeparator = inputDateFormatSeparatorGetter(element), selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);
    switch (selectedComponent) {
     case INPUT_COMPONENT_YEAR:
      components.yy = INPUT_DATE_YEAR_EMPTY;
      break;

     case INPUT_COMPONENT_MONTH:
      components.mm = INPUT_DATE_MONTH_EMPTY;
      break;

     case INPUT_COMPONENT_DAY:
      components.dd = INPUT_DATE_DAY_EMPTY;
      break;

     default:
      return;
    }
    value = inputDateComponentsSet(element, components);
    inputDomOriginalSetSelectionRange.apply(element, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
  }
  function inputDateAccessibilityNormalizeSelectedComponent(element, selectionStart) {
    var value = inputDomOriginalValueGetter.call(element), components = inputDateComponentsGet(element), componentOrder = inputDateFormatOrderGetter(element), componentSeparator = inputDateFormatSeparatorGetter(element), selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator), componentMax = inputComponentGetMaximum(element, selectedComponent);
    if (components[selectedComponent] > componentMax) {
      components[selectedComponent] = componentMax;
    }
    inputDateComponentsSet(element, components);
  }
  function inputDateAccessibilitySelectPreviousComponent(element, selectionStart) {
    var value = inputDomOriginalValueGetter.call(element), componentSeparator = inputDateFormatSeparatorGetter(element), selection = inputAccessibilityGetPreviousComponentRange(value, selectionStart, componentSeparator);
    inputDomOriginalSetSelectionRange.apply(element, selection);
  }
  function inputDateAccessibilitySelectNextComponent(element, selectionStart) {
    var value = inputDomOriginalValueGetter.call(element), componentSeparator = inputDateFormatSeparatorGetter(element), selection = inputAccessibilityGetNextComponentRange(value, selectionStart, componentSeparator);
    inputDomOriginalSetSelectionRange.apply(element, selection);
  }
  function inputDateAccessibilityIncreaseComponent(element, selectionStart, amount) {
    var value = inputDomOriginalValueGetter.call(element), components = inputDateComponentsGet(element), componentOrder = inputDateFormatOrderGetter(element), componentSeparator = inputDateFormatSeparatorGetter(element), selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator), componentMin = inputComponentGetMinimum(element, selectedComponent), componentMax = inputComponentGetMaximum(element, selectedComponent);
    components[selectedComponent] = inputAccessibilityIncreaseComponent(components[selectedComponent], amount, componentMin, componentMax);
    value = inputDateComponentsSet(element, components);
    inputDomOriginalSetSelectionRange.apply(element, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
  }
  function initInputDate() {
    inputDateValueFormatter = inputDateFuzzyRfc3339ValueFormatter;
    inputDateFormatOrderGetter = inputDateRfc3339FormatOrder;
    inputDateFormatSeparatorGetter = inputDateRfc3339FormatSeparator;
    initInputDateLocalization();
  }
  function inputDateComponentsGet(input) {
    if (input[INPUT_PROPERTY_COMPONENTS] === undefined) {
      input[INPUT_PROPERTY_COMPONENTS] = inputDateComponentsFromValue(input.getAttribute(INPUT_PROPERTY_VALUE));
    }
    return input[INPUT_PROPERTY_COMPONENTS];
  }
  function inputDateComponentsSet(element, components) {
    var formattedValue;
    element[INPUT_PROPERTY_COMPONENTS] = {
      yy: components[INPUT_COMPONENT_YEAR],
      mm: components[INPUT_COMPONENT_MONTH],
      dd: components[INPUT_COMPONENT_DAY]
    };
    formattedValue = inputDateValueFormatter(element[INPUT_PROPERTY_COMPONENTS], element);
    inputDomOriginalValueSetter.call(element, formattedValue);
    return formattedValue;
  }
  function inputDateFuzzyRfc3339ValueFormatter(components) {
    var year, month, day;
    if (components.yy === INPUT_DATE_YEAR_EMPTY) {
      year = "yyyy";
    } else {
      if (9999 >= components.yy) {
        year = ("000" + components.yy).slice(-4);
      }
    }
    if (components.mm === INPUT_DATE_MONTH_EMPTY) {
      month = "mm";
    } else {
      month = ("00" + (components.mm + 1)).slice(-2);
    }
    if (components.dd === INPUT_DATE_DAY_EMPTY) {
      day = "dd";
    } else {
      day = ("00" + components.dd).slice(-2);
    }
    return year + "-" + month + "-" + day;
  }
  function inputDateRfc3339FormatOrder() {
    return [ INPUT_COMPONENT_YEAR, INPUT_COMPONENT_MONTH, INPUT_COMPONENT_DAY ];
  }
  function inputDateRfc3339FormatSeparator() {
    return [ "-" ];
  }
  function getDateFromRfc3339FullDateString(str) {
    var date, components;
    if (str && rfc3999FullDateRegExp.test(str)) {
      components = str.split("-");
      if (2757600914 > components.join("")) {
        date = new Date(0);
        date.setUTCFullYear(components[0], components[1] - 1, components[2]);
        if (date.getUTCMonth() != components[1] - 1 || date.getUTCDate() != components[2]) {
          return null;
        }
        return date;
      }
    }
    return null;
  }
  function inputDateComponentsFromValue(value) {
    var date;
    if ("" !== value) {
      date = getDateFromRfc3339FullDateString(value);
    }
    if (date) {
      return {
        yy: date.getUTCFullYear(),
        mm: date.getUTCMonth(),
        dd: date.getUTCDate()
      };
    } else {
      return {
        yy: INPUT_DATE_YEAR_EMPTY,
        mm: INPUT_DATE_MONTH_EMPTY,
        dd: INPUT_DATE_DAY_EMPTY
      };
    }
  }
  function inputDateGetRfc3339(input) {
    var value, date = inputDateGetDate(input);
    if (date) {
      value = date.toISOString().replace("+0", "").replace("+", "");
      value = value.substr(0, value.indexOf("T"));
    } else {
      value = "";
    }
    return value;
  }
  function inputDateGetDate(input) {
    var components = inputDateComponentsGet(input), date = null;
    if (components.yy !== INPUT_DATE_YEAR_EMPTY && components.mm !== INPUT_DATE_MONTH_EMPTY && components.dd !== INPUT_DATE_DAY_EMPTY) {
      date = new Date(0);
      date.setUTCFullYear(components.yy, components.mm, components.dd);
    }
    return date;
  }
  function inputDateDomValueGet(element) {
    return inputDateGetRfc3339(element);
  }
  function inputDateDomValueSet(element, value) {
    var date;
    if ("" !== value) {
      date = getDateFromRfc3339FullDateString(value);
    }
    if (date) {
      inputDateComponentsSet(element, {
        yy: date.getUTCFullYear(),
        mm: date.getUTCMonth(),
        dd: date.getUTCDate()
      });
    } else {
      inputDateComponentsSet(element, {
        yy: INPUT_DATE_YEAR_EMPTY,
        mm: INPUT_DATE_MONTH_EMPTY,
        dd: INPUT_DATE_DAY_EMPTY
      });
    }
    return value;
  }
  function inputDateDomValueAsDateGet(element) {
    return inputDateGetDate(element);
  }
  function inputDateDomValueAsDateSet(element, value) {
    inputDateComponentsSet(element, {
      yy: value.getUTCFullYear(),
      mm: value.getUTCMonth(),
      dd: value.getUTCDate()
    });
  }
  function initInputDateLocalization() {
    inputDateValueFormatter = inputDateLocalizationValueFormatter;
    inputDateFormatOrderGetter = inputDateLocalizationFormatOrder;
    inputDateFormatSeparatorGetter = inputDateLocalizationFormatSeparator;
  }
  function inputDateLocalizationValueFormatter(components, element) {
    var year, month, day, value, lang, separator = inputDateFormatSeparatorGetter(element);
    if (components.yy === INPUT_DATE_YEAR_EMPTY) {
      year = "yyyy";
    } else {
      if (9999 >= components.yy) {
        year = ("000" + components.yy).slice(-4);
      } else {
        year = components.yy;
      }
    }
    if (components.mm === INPUT_DATE_MONTH_EMPTY) {
      month = "mm";
    } else {
      month = ("00" + (components.mm + 1)).slice(-2);
    }
    if (components.dd === INPUT_DATE_DAY_EMPTY) {
      day = "dd";
    } else {
      day = ("00" + components.dd).slice(-2);
    }
    if (element.hasAttribute(INPUT_ATTR_LANG)) {
      lang = element.getAttribute(INPUT_ATTR_LANG).toLowerCase();
    }
    switch (lang) {
     case "en":
     case "en-us":
      value = month + separator + day + separator + year;
      break;

     case "en-gb":
     case "de":
     case "nl":
      value = day + separator + month + separator + year;
      break;

     default:
      value = year + separator + month + separator + day;
    }
    return value;
  }
  function inputDateLocalizationFormatOrder(input) {
    var lang, order;
    if (input.hasAttribute(INPUT_ATTR_LANG)) {
      lang = input.getAttribute(INPUT_ATTR_LANG).toLowerCase();
    }
    switch (lang) {
     case "en":
     case "en-us":
      order = [ INPUT_COMPONENT_MONTH, INPUT_COMPONENT_DAY, INPUT_COMPONENT_YEAR ];
      break;

     case "en-gb":
     case "de":
     case "nl":
      order = [ INPUT_COMPONENT_DAY, INPUT_COMPONENT_MONTH, INPUT_COMPONENT_YEAR ];
      break;

     default:
      order = [ INPUT_COMPONENT_YEAR, INPUT_COMPONENT_MONTH, INPUT_COMPONENT_DAY ];
    }
    return order;
  }
  function inputDateLocalizationFormatSeparator(input) {
    var lang, separator;
    if (input.hasAttribute(INPUT_ATTR_LANG)) {
      lang = input.getAttribute(INPUT_ATTR_LANG).toLowerCase();
    }
    switch (lang) {
     case "en":
     case "en-us":
     case "en-gb":
     case "fr":
      separator = "/";
      break;

     case "de":
      separator = ".";
      break;

     default:
      separator = "-";
    }
    return [ separator ];
  }
  function inputDateNormalizationOnLoadFormatInputElements(element) {
    var components = inputDateComponentsGet(element);
    inputDateComponentsSet(element, components);
  }
  function inputDateNormalizationOnSubmitNormalizeInput(element) {
    inputDomOriginalValueSetter.call(element, inputDateGetRfc3339(element));
  }
  function inputDatetimeLocalAccessibilityOnKeydownHandleNavigation(element, event) {
    var selectionStart = element.selectionStart;
    switch (event.key) {
     case "Backspace":
     case "U+0008":
     case "Del":
      inputDatetimeLocalClearComponent(element, selectionStart);
      break;

     case "Tab":
     case "U+0009":
      inputDatetimeLocalAccessibilityOnTabKeydownHandleNavigation(element, event, selectionStart);
      return;

     case "Left":
      inputDatetimeLocalAccessibilitySelectPreviousComponent(element, selectionStart);
      break;

     case "Up":
      inputDatetimeLocalAccessibilityIncreaseComponent(element, selectionStart, 1);
      break;

     case "Right":
      inputDatetimeLocalAccessibilitySelectNextComponent(element, selectionStart);
      break;

     case "Down":
      inputDatetimeLocalAccessibilityIncreaseComponent(element, selectionStart, -1);
      break;

     default:
      return;
    }
    event.preventDefault();
  }
  function inputDatetimeLocalAccessibilityOnTabKeydownHandleNavigation(element, event, selectionStart) {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    } else {
      if (event.shiftKey) {
        if (0 === selectionStart) {
          inputDatetimeLocalAccessibilityNormalizeSelectedComponent(element, selectionStart);
          return;
        }
      } else {
        if (element.selectionEnd === inputDomOriginalValueGetter.call(element).length) {
          inputDatetimeLocalAccessibilityNormalizeSelectedComponent(element, selectionStart);
          return;
        }
      }
    }
    if (event.shiftKey) {
      inputDatetimeLocalAccessibilitySelectPreviousComponent(element, selectionStart);
    } else {
      inputDatetimeLocalAccessibilitySelectNextComponent(element, selectionStart);
    }
    event.preventDefault();
  }
  function inputDatetimeLocalAccessibilityOnKeyPressHandleUserInput(element, event) {
    var selectionStart, value, components, componentOrder, componentSeparator, selectedComponent, componentMin, componentMax, componentLimit;
    if (47 < event.charCode && 58 > event.charCode) {
      selectionStart = element.selectionStart;
      value = inputDomOriginalValueGetter.call(element);
      components = inputDateComponentsGet(element);
      componentOrder = inputDateFormatOrderGetter(element);
      componentSeparator = inputDateFormatSeparatorGetter(element);
      selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);
      componentMin = inputComponentGetMinimum(element, selectedComponent);
      componentMax = inputComponentGetMaximum(element, selectedComponent);
      componentLimit = componentMax / 10;
      components[selectedComponent] = inputAccessibilityComplementComponent(components[selectedComponent], event.key, componentMin, componentMax, componentLimit);
      value = inputDatetimeLocalComponentsSet(element, components);
      if (components[selectedComponent] > componentLimit) {
        inputDatetimeLocalAccessibilitySelectNextComponent(element, selectionStart);
      } else {
        inputDomOriginalSetSelectionRange.apply(element, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
      }
    }
    event.preventDefault();
  }
  function inputDatetimeLocalAccessibilityOnFocusHandleInputSelection(element, event) {
    var componentRange, value, selectionStart, componentSeparator;
    value = inputDomOriginalValueGetter.call(element);
    componentSeparator = inputDatetimeLocalFormatSeparatorGetter(element);
    if (!value) {
      value = inputDatetimeLocalComponentsSet(element, {
        yy: INPUT_DATE_YEAR_EMPTY,
        mm: INPUT_DATE_MONTH_EMPTY,
        dd: INPUT_DATE_DAY_EMPTY,
        hh: INPUT_TIME_COMPONENT_EMPTY,
        ii: INPUT_TIME_COMPONENT_EMPTY,
        ss: INPUT_TIME_COMPONENT_HIDDEN,
        ms: INPUT_TIME_COMPONENT_HIDDEN
      });
      selectionStart = 0;
    } else {
      selectionStart = element.selectionStart;
    }
    componentRange = inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator);
    inputDomOriginalSetSelectionRange.apply(element, componentRange);
    event.preventDefault();
  }
  function inputDatetimeLocalAccessibilityOnBlurHandleInputNormalization(element) {
    inputDatetimeLocalAccessibilityNormalizeSelectedComponent(element, element.selectionStart);
  }
  function inputDatetimeLocalClearComponent(element, selectionStart) {
    var value = inputDomOriginalValueGetter.call(element), components = inputDatetimeLocalComponentsGet(element), componentOrder = inputDatetimeLocalFormatOrderGetter(element), componentSeparator = inputDatetimeLocalFormatSeparatorGetter(element), selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);
    switch (selectedComponent) {
     case INPUT_COMPONENT_YEAR:
      components.yy = INPUT_DATE_YEAR_EMPTY;
      break;

     case INPUT_COMPONENT_MONTH:
      components.mm = INPUT_DATE_MONTH_EMPTY;
      break;

     case INPUT_COMPONENT_DAY:
      components.dd = INPUT_DATE_DAY_EMPTY;
      break;

     case INPUT_COMPONENT_HOUR:
      components.hh = INPUT_TIME_COMPONENT_EMPTY;
      break;

     case INPUT_COMPONENT_MINUTE:
      components.ii = INPUT_TIME_COMPONENT_EMPTY;
      break;

     case INPUT_COMPONENT_SECOND:
      components.ss = INPUT_TIME_COMPONENT_EMPTY;
      break;

     case INPUT_COMPONENT_MILISECOND:
      components.ms = INPUT_TIME_COMPONENT_EMPTY;
      break;

     default:
      return;
    }
    value = inputDatetimeLocalComponentsSet(element, components);
    inputDomOriginalSetSelectionRange.apply(element, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
  }
  function inputDatetimeLocalAccessibilityNormalizeSelectedComponent(element, selectionStart) {
    var value = inputDomOriginalValueGetter.call(element), components = inputDatetimeLocalComponentsGet(element), componentOrder = inputDatetimeLocalFormatOrderGetter(element), componentSeparator = inputDatetimeLocalFormatSeparatorGetter(element), selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator), componentMax = inputComponentGetMaximum(element, selectedComponent);
    if (components[selectedComponent] > componentMax) {
      components[selectedComponent] = componentMax;
    }
    inputDatetimeLocalComponentsSet(element, components);
  }
  function inputDatetimeLocalAccessibilitySelectPreviousComponent(element, selectionStart) {
    inputDatetimeLocalAccessibilityNormalizeSelectedComponent(element, selectionStart);
    var value = inputDomOriginalValueGetter.call(element), componentSeparator = inputDatetimeLocalFormatSeparatorGetter(element), selection = inputAccessibilityGetPreviousComponentRange(value, selectionStart, componentSeparator);
    inputDomOriginalSetSelectionRange.apply(element, selection);
  }
  function inputDatetimeLocalAccessibilitySelectNextComponent(element, selectionStart) {
    inputDatetimeLocalAccessibilityNormalizeSelectedComponent(element, selectionStart);
    var value = inputDomOriginalValueGetter.call(element), componentSeparator = inputDatetimeLocalFormatSeparatorGetter(element), selection = inputAccessibilityGetNextComponentRange(value, selectionStart, componentSeparator);
    inputDomOriginalSetSelectionRange.apply(element, selection);
  }
  function inputDatetimeLocalAccessibilityIncreaseComponent(element, selectionStart, amount) {
    var value = inputDomOriginalValueGetter.call(element), components = inputDatetimeLocalComponentsGet(element), componentOrder = inputDatetimeLocalFormatOrderGetter(element), componentSeparator = inputDatetimeLocalFormatSeparatorGetter(element), selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator), componentMin = inputComponentGetMinimum(element, selectedComponent), componentMax = inputComponentGetMaximum(element, selectedComponent);
    components[selectedComponent] = inputAccessibilityIncreaseComponent(components[selectedComponent], amount, componentMin, componentMax);
    value = inputDatetimeLocalComponentsSet(element, components);
    inputDomOriginalSetSelectionRange.apply(element, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
  }
  function initInputDatetimeLocal() {
    inputDatetimeLocalValueFormatter = inputDatetimeLocalDefaultValueFormatter;
    inputDatetimeLocalFormatOrderGetter = inputDatetimeLocalDefaultFormatOrder;
    inputDatetimeLocalFormatSeparatorGetter = inputDatetimeLocalDefaultFormatSeparator;
  }
  function inputDatetimeLocalComponentsGet(input) {
    if (input[INPUT_PROPERTY_COMPONENTS] === undefined) {
      input[INPUT_PROPERTY_COMPONENTS] = inputDatetimeLocalComponentsFromValue(input.getAttribute(INPUT_PROPERTY_VALUE));
    }
    return input[INPUT_PROPERTY_COMPONENTS];
  }
  function inputDatetimeLocalComponentsSet(element, components) {
    var formattedValue;
    element[INPUT_PROPERTY_COMPONENTS] = {
      yy: components[INPUT_COMPONENT_YEAR],
      mm: components[INPUT_COMPONENT_MONTH],
      dd: components[INPUT_COMPONENT_DAY],
      hh: components[INPUT_COMPONENT_HOUR],
      ii: components[INPUT_COMPONENT_MINUTE],
      ss: components[INPUT_COMPONENT_SECOND],
      ms: components[INPUT_COMPONENT_MILISECOND]
    };
    formattedValue = inputDatetimeLocalValueFormatter(element[INPUT_PROPERTY_COMPONENTS], element);
    inputDomOriginalValueSetter.call(element, formattedValue);
    return formattedValue;
  }
  function inputDatetimeLocalComponentsFromValue(value) {
    var components;
    if (value) {
      components = inputDatetimeLocalValidValueStringToComponents(value);
    }
    if (components) {
      return components;
    } else {
      return {
        yy: INPUT_DATE_YEAR_EMPTY,
        mm: INPUT_DATE_MONTH_EMPTY,
        dd: INPUT_DATE_DAY_EMPTY,
        hh: INPUT_TIME_COMPONENT_EMPTY,
        ii: INPUT_TIME_COMPONENT_EMPTY,
        ss: INPUT_TIME_COMPONENT_HIDDEN,
        ms: INPUT_TIME_COMPONENT_HIDDEN
      };
    }
  }
  function inputDatetimeLocalValidValueStringToComponents(str) {
    var date, time;
    str = str.split("T");
    if (2 === str.length) {
      date = getDateFromRfc3339FullDateString(str[0]);
      if (null === date) {
        return null;
      }
      time = inputTimeValidTimeStringToComponents(str[1]);
      if (null === time) {
        return null;
      }
      return {
        yy: date.getUTCFullYear(),
        mm: date.getUTCMonth(),
        dd: date.getUTCDate(),
        hh: time.hh,
        ii: time.ii,
        ss: time.ss,
        ms: time.ms
      };
    }
    return null;
  }
  function inputDatetimeLocalGetRfc3339(element) {
    var components = inputDatetimeLocalComponentsGet(element);
    if (components.hh > INPUT_TIME_COMPONENT_EMPTY && components.ii > INPUT_TIME_COMPONENT_EMPTY) {
      if (components.ss === INPUT_TIME_COMPONENT_EMPTY) {
        components.ss = INPUT_TIME_COMPONENT_HIDDEN;
      }
      if (components.ms === INPUT_TIME_COMPONENT_EMPTY) {
        components.ms = INPUT_TIME_COMPONENT_HIDDEN;
      }
      return inputDateFuzzyRfc3339ValueFormatter(components) + "T" + inputTimeDefaultValueFormatter(components);
    } else {
      return "";
    }
  }
  function inputDatetimeLocalDefaultValueFormatter(components) {
    return inputDateFuzzyRfc3339ValueFormatter(components) + " " + inputTimeDefaultValueFormatter(components);
  }
  function inputDatetimeLocalDefaultFormatOrder() {
    return [ INPUT_COMPONENT_YEAR, INPUT_COMPONENT_MONTH, INPUT_COMPONENT_DAY, INPUT_COMPONENT_HOUR, INPUT_COMPONENT_MINUTE, INPUT_COMPONENT_SECOND, INPUT_COMPONENT_MILISECOND ];
  }
  function inputDatetimeLocalDefaultFormatSeparator() {
    return [ "-", " ", ":", "." ];
  }
  function inputDatetimeLocalDomValueGet(element) {
    return inputDatetimeLocalGetRfc3339(element);
  }
  function inputDatetimeLocalDomValueSet(element, value) {
    var components;
    if ("" !== value) {
      components = inputDatetimeLocalValidValueStringToComponents(value + "");
    }
    if (components) {
      inputDatetimeLocalComponentsSet(element, components);
    } else {
      inputDatetimeLocalComponentsSet(element, {
        yy: INPUT_DATE_YEAR_EMPTY,
        mm: INPUT_DATE_MONTH_EMPTY,
        dd: INPUT_DATE_DAY_EMPTY,
        hh: INPUT_TIME_COMPONENT_EMPTY,
        ii: INPUT_TIME_COMPONENT_EMPTY,
        ss: INPUT_TIME_COMPONENT_HIDDEN,
        ms: INPUT_TIME_COMPONENT_HIDDEN
      });
    }
    return value;
  }
  function inputDatetimeLocalDomValueAsDateGet(element) {
    var components = inputDatetimeLocalComponentsGet(element), date = null;
    if (components.hh !== INPUT_TIME_COMPONENT_EMPTY && components.ii !== INPUT_TIME_COMPONENT_EMPTY) {
      date = inputDateGetDate(element);
      if (date) {
        date.setUTCHours(components.hh);
        date.setUTCMinutes(components.ii);
        if (components.ss > INPUT_TIME_COMPONENT_EMPTY) {
          date.setUTCSeconds(components.ss);
        }
        if (components.ms > INPUT_TIME_COMPONENT_EMPTY) {
          date.setUTCMilliseconds(components.ms);
        }
      }
    }
    return date;
  }
  function inputDatetimeLocalDomValueAsDateSet(element, value) {
    inputDatetimeLocalComponentsSet(element, {
      yy: value.getUTCFullYear(),
      mm: value.getUTCMonth(),
      dd: value.getUTCDate(),
      hh: value.getUTCHours(),
      ii: value.getUTCMinutes(),
      ss: value.getUTCSeconds(),
      ms: value.getUTCMilliseconds()
    });
  }
  function inputDatetimeLocalNormalizationOnLoadFormatInputElements(element) {
    var components = inputDatetimeLocalComponentsGet(element);
    inputDatetimeLocalComponentsSet(element, components);
  }
  function inputDatetimeLocalNormalizationOnSubmitNormalizeInput(element) {
    inputDomOriginalValueSetter.call(element, inputDatetimeLocalGetRfc3339(element));
  }
  function inputTimeAccessibilityOnKeydownHandleNavigation(element, event) {
    var selectionStart = element.selectionStart;
    switch (event.key) {
     case "Backspace":
     case "U+0008":
     case "Del":
      inputTimeAccessibilityClearComponent(element, selectionStart);
      break;

     case "Tab":
     case "U+0009":
      inputTimeAccessibilityOnTabKeydownHandleNavigation(element, event, selectionStart);
      return;

     case "Left":
      inputTimeAccessibilitySelectPreviousComponent(element, selectionStart);
      break;

     case "Up":
      inputTimeAccessibilityIncreaseComponent(element, selectionStart, 1);
      break;

     case "Right":
      inputTimeAccessibilitySelectNextComponent(element, selectionStart);
      break;

     case "Down":
      inputTimeAccessibilityIncreaseComponent(element, selectionStart, -1);
      break;

     default:
      return;
    }
    event.preventDefault();
  }
  function inputTimeAccessibilityOnTabKeydownHandleNavigation(element, event, selectionStart) {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    } else {
      if (event.shiftKey) {
        if (0 === selectionStart) {
          inputTimeAccessibilityNormalizeSelectedComponent(element, selectionStart);
          return;
        }
      } else {
        if (element.selectionEnd === inputDomOriginalValueGetter.call(element).length) {
          inputTimeAccessibilityNormalizeSelectedComponent(element, selectionStart);
          return;
        }
      }
    }
    if (event.shiftKey) {
      inputTimeAccessibilitySelectPreviousComponent(element, selectionStart);
    } else {
      inputTimeAccessibilitySelectNextComponent(element, selectionStart);
    }
    event.preventDefault();
  }
  function inputTimeAccessibilityOnKeyPressHandleUserInput(element, event) {
    var selectionStart, value, components, componentOrder, componentSeparator, selectedComponent, componentMin, componentMax, componentLimit;
    if (47 < event.charCode && 58 > event.charCode) {
      selectionStart = element.selectionStart;
      value = inputDomOriginalValueGetter.call(element);
      components = inputTimeComponentsGet(element);
      componentOrder = inputTimeFormatOrderGetter(element);
      componentSeparator = inputTimeFormatSeparatorGetter(element);
      selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);
      componentMin = inputComponentGetMinimum(element, selectedComponent);
      componentMax = inputComponentGetMaximum(element, selectedComponent);
      componentLimit = componentMax / 10;
      components[selectedComponent] = inputAccessibilityComplementComponent(components[selectedComponent], event.key, componentMin, componentMax, componentLimit);
      value = inputTimeComponentsSet(element, components);
      if (components[selectedComponent] > componentLimit) {
        inputTimeAccessibilitySelectNextComponent(element, selectionStart);
      } else {
        inputDomOriginalSetSelectionRange.apply(element, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
      }
    }
    event.preventDefault();
  }
  function inputTimeAccessibilityOnFocusHandleInputSelection(element, event) {
    var value, selectionStart, componentSeparator;
    value = inputDomOriginalValueGetter.call(element);
    componentSeparator = inputTimeFormatSeparatorGetter(element);
    if (!value) {
      value = inputTimeComponentsSet(element, {
        hh: INPUT_TIME_COMPONENT_EMPTY,
        ii: INPUT_TIME_COMPONENT_EMPTY,
        ss: INPUT_TIME_COMPONENT_HIDDEN,
        ms: INPUT_TIME_COMPONENT_HIDDEN
      });
      selectionStart = 0;
    } else {
      selectionStart = element.selectionStart;
    }
    inputDomOriginalSetSelectionRange.apply(element, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
    event.preventDefault();
  }
  function inputTimeAccessibilityOnBlurHandleInputNormalization(element) {
    inputTimeAccessibilityNormalizeSelectedComponent(element, element.selectionStart);
  }
  function inputTimeAccessibilityClearComponent(element, selectionStart) {
    var value = inputDomOriginalValueGetter.call(element), components = inputTimeComponentsGet(element), componentOrder = inputTimeFormatOrderGetter(element), componentSeparator = inputTimeFormatSeparatorGetter(element), selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);
    components[selectedComponent] = INPUT_TIME_COMPONENT_EMPTY;
    value = inputTimeComponentsSet(element, components);
    inputDomOriginalSetSelectionRange.apply(element, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
  }
  function inputTimeAccessibilityNormalizeSelectedComponent(element, selectionStart) {
    var value = inputDomOriginalValueGetter.call(element), components = inputTimeComponentsGet(element), componentOrder = inputTimeFormatOrderGetter(element), componentSeparator = inputTimeFormatSeparatorGetter(element), selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator), componentMax = inputComponentGetMaximum(element, selectedComponent);
    if (components[selectedComponent] > componentMax) {
      components[selectedComponent] = componentMax;
    }
    inputTimeComponentsSet(element, components);
  }
  function inputTimeAccessibilitySelectPreviousComponent(element, selectionStart) {
    inputTimeAccessibilityNormalizeSelectedComponent(element, selectionStart);
    var value = inputDomOriginalValueGetter.call(element), componentSeparator = inputTimeFormatSeparatorGetter(element);
    inputDomOriginalSetSelectionRange.apply(element, inputAccessibilityGetPreviousComponentRange(value, selectionStart, componentSeparator));
  }
  function inputTimeAccessibilitySelectNextComponent(element, selectionStart) {
    inputTimeAccessibilityNormalizeSelectedComponent(element, selectionStart);
    var value = inputDomOriginalValueGetter.call(element), componentSeparator = inputTimeFormatSeparatorGetter(element);
    inputDomOriginalSetSelectionRange.apply(element, inputAccessibilityGetNextComponentRange(value, selectionStart, componentSeparator));
  }
  function inputTimeAccessibilityIncreaseComponent(element, selectionStart, amount) {
    var value = inputDomOriginalValueGetter.call(element), components = inputTimeComponentsGet(element), componentOrder = inputTimeFormatOrderGetter(element), componentSeparator = inputTimeFormatSeparatorGetter(element), selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator), componentMin = inputComponentGetMinimum(element, selectedComponent), componentMax = inputComponentGetMaximum(element, selectedComponent);
    components[selectedComponent] = inputAccessibilityIncreaseComponent(components[selectedComponent], amount, componentMin, componentMax);
    value = inputTimeComponentsSet(element, components);
    inputDomOriginalSetSelectionRange.apply(element, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
  }
  function initInputTime() {
    inputTimeValueFormatter = inputTimeDefaultValueFormatter;
    inputTimeFormatOrderGetter = inputTimeDefaultFormatOrder;
    inputTimeFormatSeparatorGetter = inputTimeDefaultFormatSeparator;
  }
  function inputTimeComponentsGet(input) {
    if (input[INPUT_PROPERTY_COMPONENTS] === undefined) {
      input[INPUT_PROPERTY_COMPONENTS] = inputTimeComponentsFromValue(input.getAttribute(INPUT_PROPERTY_VALUE));
    }
    return input[INPUT_PROPERTY_COMPONENTS];
  }
  function inputTimeComponentsSet(element, components) {
    var formattedValue;
    element[INPUT_PROPERTY_COMPONENTS] = {
      hh: components[INPUT_COMPONENT_HOUR],
      ii: components[INPUT_COMPONENT_MINUTE],
      ss: components[INPUT_COMPONENT_SECOND],
      ms: components[INPUT_COMPONENT_MILISECOND]
    };
    formattedValue = inputTimeValueFormatter(element[INPUT_PROPERTY_COMPONENTS], element);
    inputDomOriginalValueSetter.call(element, formattedValue);
    return formattedValue;
  }
  function inputTimeComponentsFromValue(value) {
    var components;
    if ("" !== value) {
      components = inputTimeValidTimeStringToComponents(value);
    }
    if (components) {
      return components;
    } else {
      return {
        hh: INPUT_TIME_COMPONENT_EMPTY,
        ii: INPUT_TIME_COMPONENT_EMPTY,
        ss: INPUT_TIME_COMPONENT_HIDDEN,
        ms: INPUT_TIME_COMPONENT_HIDDEN
      };
    }
  }
  function inputTimeValidTimeStringToComponents(str) {
    var components;
    if (str && inputTimeValidTimeStringRegExp.test(str)) {
      components = str.split(/[:.]/);
      if (components[2] === undefined) {
        components[2] = INPUT_TIME_COMPONENT_HIDDEN;
      }
      if (components[3] === undefined) {
        components[3] = INPUT_TIME_COMPONENT_HIDDEN;
      } else {
        components[3] = (components[3] + "000").slice(0, 3);
      }
      return {
        hh: parseInt(components[0], 10),
        ii: parseInt(components[1], 10),
        ss: parseInt(components[2], 10),
        ms: parseInt(components[3], 10)
      };
    }
    return null;
  }
  function inputTimeGetRfc3339(element) {
    var components = inputTimeComponentsGet(element);
    if (components.hh > INPUT_TIME_COMPONENT_EMPTY && components.ii > INPUT_TIME_COMPONENT_EMPTY) {
      if (components.ss === INPUT_TIME_COMPONENT_EMPTY) {
        components.ss = INPUT_TIME_COMPONENT_HIDDEN;
      }
      if (components.ms === INPUT_TIME_COMPONENT_EMPTY) {
        components.ms = INPUT_TIME_COMPONENT_HIDDEN;
      }
      return inputTimeDefaultValueFormatter(components);
    } else {
      return "";
    }
  }
  function inputTimeDefaultValueFormatter(components) {
    var formatted;
    if (components.hh === INPUT_TIME_COMPONENT_EMPTY) {
      formatted = "--";
    } else {
      formatted = ("00" + components.hh).slice(-2);
    }
    formatted += ":";
    if (components.ii === INPUT_TIME_COMPONENT_EMPTY) {
      formatted += "--";
    } else {
      formatted += ("00" + components.ii).slice(-2);
    }
    if (components.ss !== INPUT_TIME_COMPONENT_HIDDEN) {
      formatted += ":";
      if (components.ss === INPUT_TIME_COMPONENT_EMPTY) {
        formatted += "--";
      } else {
        formatted += ("00" + components.ss).slice(-2);
      }
      if (components.ms !== INPUT_TIME_COMPONENT_HIDDEN) {
        formatted += ".";
        if (components.ms === INPUT_TIME_COMPONENT_EMPTY) {
          formatted += "---";
        } else {
          formatted += ("000" + components.ms).slice(-3);
        }
      }
    }
    return formatted;
  }
  function inputTimeDefaultFormatOrder() {
    return [ INPUT_COMPONENT_HOUR, INPUT_COMPONENT_MINUTE, INPUT_COMPONENT_SECOND, INPUT_COMPONENT_MILISECOND ];
  }
  function inputTimeDefaultFormatSeparator() {
    return [ ":", "." ];
  }
  function inputTimeDomValueGet(element) {
    return inputTimeGetRfc3339(element);
  }
  function inputTimeDomValueSet(element, value) {
    var components;
    if ("" !== value) {
      components = inputTimeValidTimeStringToComponents(value);
    }
    if (components) {
      inputTimeComponentsSet(element, components);
    } else {
      inputTimeComponentsSet(element, {
        hh: INPUT_TIME_COMPONENT_EMPTY,
        ii: INPUT_TIME_COMPONENT_EMPTY,
        ss: INPUT_TIME_COMPONENT_EMPTY,
        ms: INPUT_TIME_COMPONENT_EMPTY
      });
    }
    return value;
  }
  function inputTimeDomValueAsDateGet(element) {
    var components = inputTimeComponentsGet(element), date = null;
    if (components.hh !== INPUT_TIME_COMPONENT_EMPTY && components.ii !== INPUT_TIME_COMPONENT_EMPTY) {
      date = new Date(0);
      date.setUTCHours(components.hh);
      date.setUTCMinutes(components.ii);
      if (components.ss > INPUT_TIME_COMPONENT_EMPTY) {
        date.setUTCSeconds(components.ss);
      }
      if (components.ms > INPUT_TIME_COMPONENT_EMPTY) {
        date.setUTCMilliseconds(components.ms);
      }
    }
    return date;
  }
  function inputTimeDomValueAsDateSet(element, value) {
    inputTimeComponentsSet(element, {
      hh: value.getUTCHours(),
      ii: value.getUTCMinutes(),
      ss: value.getUTCSeconds(),
      ms: value.getUTCMilliseconds()
    });
  }
  function inputTimeNormalizationOnLoadFormatInputElements(element) {
    var components = inputTimeComponentsGet(element);
    inputTimeComponentsSet(element, components);
  }
  function inputTimeNormalizationOnSubmitNormalizeInput(element) {
    inputDomOriginalValueSetter.call(element, inputTimeGetRfc3339(element));
  }
  var inputDomOriginalTypeGetter, inputDomOriginalValueGetter, inputDomOriginalValueSetter, inputDomOriginalValueAsNumberGetter, inputDomOriginalValueAsNumberSetter, inputDomOriginalStepUp, inputDomOriginalStepDown, inputDomOriginalSetSelectionRange, inputDateValueFormatter, inputDateFormatOrderGetter, inputDateFormatSeparatorGetter, inputDatetimeLocalValueFormatter, inputDatetimeLocalFormatOrderGetter, inputDatetimeLocalFormatSeparatorGetter, inputTimeValueFormatter, inputTimeFormatOrderGetter, inputTimeFormatSeparatorGetter, INPUT_ATTR_TYPE = "type", INPUT_ATTR_LANG = "lang", INPUT_TYPE_TEXT = "text", INPUT_TYPE_DATE = "date", INPUT_TYPE_DATETIME_LOCAL = "datetime-local", INPUT_TYPE_TIME = "time", INPUT_PROPERTY_VALUE = "value", INPUT_PROPERTY_VALUEASDATE = "valueAsDate", INPUT_PROPERTY_VALUEASNUMBER = "valueAsNumber", INPUT_PROPERTY_COMPONENTS = "__polyformfillInputComponents", DOMEXCEPTION_INVALID_STATE_ERR = 11, INPUT_COMPONENT_YEAR = "yy", INPUT_COMPONENT_MONTH = "mm", INPUT_COMPONENT_DAY = "dd", INPUT_DATE_YEAR_EMPTY = 0, INPUT_DATE_MONTH_EMPTY = -1, INPUT_DATE_DAY_EMPTY = 0, INPUT_DATE_YEAR_MIN = 1, INPUT_DATE_YEAR_MAX = 275760, INPUT_DATE_MONTH_MIN = 0, INPUT_DATE_MONTH_MAX = 11, INPUT_DATE_DAY_MIN = 1, INPUT_DATE_DAY_MAX = 31, rfc3999FullDateRegExp = /^([0-9]{4,})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/, INPUT_DATE_STEP_DEFAULT = 1, INPUT_DATE_STEP_SCALE_FACTOR = 864e5, INPUT_COMPONENT_HOUR = "hh", INPUT_COMPONENT_MINUTE = "ii", INPUT_COMPONENT_SECOND = "ss", INPUT_COMPONENT_MILISECOND = "ms", INPUT_TIME_COMPONENT_EMPTY = -1, INPUT_TIME_COMPONENT_HIDDEN = -2, INPUT_TIME_COMPONENT_HOUR_MIN = 0, INPUT_TIME_COMPONENT_HOUR_MAX = 23, INPUT_TIME_COMPONENT_MINUTE_MIN = 0, INPUT_TIME_COMPONENT_MINUTE_MAX = 59, INPUT_TIME_COMPONENT_SECOND_MIN = 0, INPUT_TIME_COMPONENT_SECOND_MAX = 59, INPUT_TIME_COMPONENT_MILISECOND_MIN = 0, INPUT_TIME_COMPONENT_MILISECOND_MAX = 999, inputTimeValidTimeStringRegExp = /^(([0-1][0-9])|(2[0-3])):[0-5][0-9](:[0-5][0-9](\.[0-9]{1,3})?)?$/, INPUT_TIME_STEP_DEFAULT = 60, INPUT_TIME_STEP_SCALE_FACTOR = 1e3;
  init();
}(window, document);