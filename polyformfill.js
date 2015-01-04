(function(window, document, undefined) {
  "use strict";
  var INPUT_ATTR_TYPE = "type";
  function init() {
    var testInput = document.createElement("input");
    if (!("valueAsDate" in testInput)) {
      initInput(testInput);
      initInputDate();
      initInputDatetimeLocal();
      initInputTime();
    }
  }
  init();
  function initInput(testInput) {
    initInputDom(testInput);
    initInputAccessibility();
    initInputNormalization();
  }
  var DATECOMPONENT_YEAR = 1, DATECOMPONENT_MONTH = 2, DATECOMPONENT_DAY = 4;
  var INPUT_DATE_YEAR_EMPTY = 0, INPUT_DATE_MONTH_EMPTY = -1, INPUT_DATE_DAY_EMPTY = 0;
  var INPUT_DATE_YEAR_MIN = 1, INPUT_DATE_YEAR_MAX = 275760;
  var INPUT_DATE_MONTH_MIN = 0, INPUT_DATE_MONTH_MAX = 11;
  var INPUT_DATE_DAY_MIN = 1, INPUT_DATE_DAY_MAX = 31;
  var rfc3999FullDateRegExp = /^([0-9]{4,})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  var inputDateValueFormatter;
  var inputDateFormatOrderGetter;
  var inputDateFormatSeparatorGetter;
  function initInputDate() {
    inputDateValueFormatter = inputDateFuzzyRfc3339ValueFormatter;
    inputDateFormatOrderGetter = inputDateRfc3339FormatOrder;
    inputDateFormatSeparatorGetter = inputDateRfc3339FormatSeparator;
    initInputDateLocalization();
  }
  function inputDateComponentsSet(input, year, month, day) {
    var formattedValue;
    input.__polyformfillInputComponents = {
      year: year,
      month: month,
      day: day
    };
    formattedValue = inputDateValueFormatter(input, year, month, day);
    inputDomOriginalValueSetter.call(input, formattedValue);
    return formattedValue;
  }
  function inputDateComponentsGet(input) {
    if (input.__polyformfillInputComponents === undefined) {
      inputDateInitInternalValue(input);
    }
    return input.__polyformfillInputComponents;
  }
  function inputDateFuzzyRfc3339ValueFormatter(input, year, month, day) {
    if (year === INPUT_DATE_YEAR_EMPTY) {
      year = "yyyy";
    } else {
      if (year <= 9999) {
        year = ("000" + year).slice(-4);
      }
    }
    if (month === INPUT_DATE_MONTH_EMPTY) {
      month = "mm";
    } else {
      month = ("00" + (month + 1)).slice(-2);
    }
    if (day === INPUT_DATE_DAY_EMPTY) {
      day = "dd";
    } else {
      day = ("00" + day).slice(-2);
    }
    return year + "-" + month + "-" + day;
  }
  function inputDateRfc3339FormatOrder() {
    return [ DATECOMPONENT_YEAR, DATECOMPONENT_MONTH, DATECOMPONENT_DAY ];
  }
  function inputDateRfc3339FormatSeparator() {
    return [ "-" ];
  }
  function getDateFromRfc3339FullDateString(str) {
    var date, dateComponents;
    if (str && rfc3999FullDateRegExp.test(str)) {
      dateComponents = str.split("-");
      if (dateComponents.join("") < 2757600914) {
        date = new Date(0);
        date.setUTCFullYear(dateComponents[0], dateComponents[1] - 1, dateComponents[2]);
        if (date.getUTCMonth() != dateComponents[1] - 1 || date.getUTCDate() != dateComponents[2]) {
          return null;
        }
        return date;
      }
    }
    return null;
  }
  function inputDateInitInternalValue(input) {
    var value = input.getAttribute("value"), date;
    if (value !== "") {
      date = getDateFromRfc3339FullDateString(value);
    }
    if (date) {
      input.__polyformfillInputComponents = {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth(),
        day: date.getUTCDate()
      };
    } else {
      input.__polyformfillInputComponents = {
        year: INPUT_DATE_YEAR_EMPTY,
        month: INPUT_DATE_MONTH_EMPTY,
        day: INPUT_DATE_DAY_EMPTY
      };
    }
  }
  function inputDateGetRfc3339(input) {
    var date = inputDateGetDate(input), value;
    if (date) {
      value = date.toISOString().replace("+0", "").replace("+", "");
      value = value.substr(0, value.indexOf("T"));
    } else {
      value = "";
    }
    return value;
  }
  function inputDateGetDate(input) {
    var dateComponents = inputDateComponentsGet(input), date = null;
    if (dateComponents.year !== INPUT_DATE_YEAR_EMPTY && dateComponents.month !== INPUT_DATE_MONTH_EMPTY && dateComponents.day !== INPUT_DATE_DAY_EMPTY) {
      date = new Date(0);
      date.setUTCFullYear(dateComponents.year, dateComponents.month, dateComponents.day);
    }
    return date;
  }
  var inputDatetimeLocalValueFormatter;
  var inputDatetimeLocalFormatOrderGetter;
  var inputDatetimeLocalFormatSeparatorGetter;
  function initInputDatetimeLocal() {
    inputDatetimeLocalValueFormatter = inputDatetimeLocalDefaultValueFormatter;
    inputDatetimeLocalFormatOrderGetter = inputDatetimeLocalDefaultFormatOrder;
    inputDatetimeLocalFormatSeparatorGetter = inputDatetimeLocalDefaultFormatSeparator;
  }
  function inputDatetimeLocalComponentsGet(input) {
    if (input.__polyformfillInputComponents === undefined) {
      inputDatetimeLocalInitInternalValue(input);
    }
    return input.__polyformfillInputComponents;
  }
  function inputDatetimeLocalComponentsSet(input, year, month, day, hour, minute, second, milisecond) {
    var formattedValue;
    input.__polyformfillInputComponents = {
      year: year,
      month: month,
      day: day,
      hour: hour,
      minute: minute,
      second: second,
      milisecond: milisecond
    };
    formattedValue = inputDatetimeLocalValueFormatter(input, year, month, day, hour, minute, second, milisecond);
    inputDomOriginalValueSetter.call(input, formattedValue);
    return formattedValue;
  }
  function inputDatetimeLocalInitInternalValue(input) {
    var value = input.getAttribute("value"), components;
    if (value) {
      components = inputDatetimeLocalValidValueStringToComponents(value);
    }
    if (components) {
      input.__polyformfillInputComponents = components;
    } else {
      input.__polyformfillInputComponents = {
        year: INPUT_DATE_YEAR_EMPTY,
        month: INPUT_DATE_MONTH_EMPTY,
        day: INPUT_DATE_DAY_EMPTY,
        hour: INPUT_TIME_COMPONENT_EMPTY,
        minute: INPUT_TIME_COMPONENT_EMPTY,
        second: INPUT_TIME_COMPONENT_HIDDEN,
        milisecond: INPUT_TIME_COMPONENT_HIDDEN
      };
    }
  }
  function inputDatetimeLocalValidValueStringToComponents(str) {
    var date, time;
    str = str.split("T");
    if (str.length === 2) {
      date = getDateFromRfc3339FullDateString(str[0]);
      if (date === null) {
        return null;
      }
      time = inputTimeValidTimeStringToComponents(str[1]);
      if (time === null) {
        return null;
      }
      return {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth(),
        day: date.getUTCDate(),
        hour: time.hour,
        minute: time.minute,
        second: time.second,
        milisecond: time.milisecond
      };
    }
    return null;
  }
  function inputDatetimeLocalGetRfc3339(element) {
    var components = inputDatetimeLocalComponentsGet(element);
    if (components.hour > INPUT_TIME_COMPONENT_EMPTY && components.minute > INPUT_TIME_COMPONENT_EMPTY) {
      if (components.second === INPUT_TIME_COMPONENT_EMPTY) {
        components.second = INPUT_TIME_COMPONENT_HIDDEN;
      }
      if (components.milisecond === INPUT_TIME_COMPONENT_EMPTY) {
        components.milisecond = INPUT_TIME_COMPONENT_HIDDEN;
      }
      return inputDateFuzzyRfc3339ValueFormatter(element, components.year, components.month, components.day) + "T" + inputTimeDefaultValueFormatter(element, components.hour, components.minute, components.second, components.milisecond);
    } else {
      return "";
    }
  }
  function inputDatetimeLocalDefaultValueFormatter(input, year, month, day, hour, minute, second, milisecond) {
    return inputDateFuzzyRfc3339ValueFormatter(input, year, month, day) + " " + inputTimeDefaultValueFormatter(input, hour, minute, second, milisecond);
  }
  function inputDatetimeLocalDefaultFormatOrder() {
    return [ DATECOMPONENT_YEAR, DATECOMPONENT_MONTH, DATECOMPONENT_DAY, INPUT_TIME_COMPONENT_HOUR, INPUT_TIME_COMPONENT_MINUTE, INPUT_TIME_COMPONENT_SECOND, INPUT_TIME_COMPONENT_MILISECOND ];
  }
  function inputDatetimeLocalDefaultFormatSeparator() {
    return [ "-", " ", ":", "." ];
  }
  var INPUT_TIME_COMPONENT_HOUR = 8, INPUT_TIME_COMPONENT_MINUTE = 16, INPUT_TIME_COMPONENT_SECOND = 32, INPUT_TIME_COMPONENT_MILISECOND = 64;
  var INPUT_TIME_COMPONENT_EMPTY = -1;
  var INPUT_TIME_COMPONENT_HIDDEN = -2;
  var INPUT_TIME_COMPONENT_HOUR_MIN = 0;
  var INPUT_TIME_COMPONENT_HOUR_MAX = 23;
  var INPUT_TIME_COMPONENT_MINUTE_MIN = 0;
  var INPUT_TIME_COMPONENT_MINUTE_MAX = 59;
  var INPUT_TIME_COMPONENT_SECOND_MIN = 0;
  var INPUT_TIME_COMPONENT_SECOND_MAX = 59;
  var INPUT_TIME_COMPONENT_MILISECOND_MIN = 0;
  var INPUT_TIME_COMPONENT_MILISECOND_MAX = 999;
  var inputTimeValidTimeStringRegExp = /^(([0-1][0-9])|(2[0-3])):[0-5][0-9](:[0-5][0-9](\.[0-9]{1,3})?)?$/;
  var inputTimeValueFormatter;
  var inputTimeFormatOrderGetter;
  var inputTimeFormatSeparatorGetter;
  function initInputTime() {
    inputTimeValueFormatter = inputTimeDefaultValueFormatter;
    inputTimeFormatOrderGetter = inputTimeDefaultFormatOrder;
    inputTimeFormatSeparatorGetter = inputTimeDefaultFormatSeparator;
  }
  function inputTimeComponentsGet(input) {
    if (input.__polyformfillInputComponents === undefined) {
      inputTimeInitInternalValue(input);
    }
    return input.__polyformfillInputComponents;
  }
  function inputTimeComponentsSet(input, hour, minute, second, milisecond) {
    var formattedValue;
    input.__polyformfillInputComponents = {
      hour: hour,
      minute: minute,
      second: second,
      milisecond: milisecond
    };
    formattedValue = inputTimeValueFormatter(input, hour, minute, second, milisecond);
    inputDomOriginalValueSetter.call(input, formattedValue);
    return formattedValue;
  }
  function inputTimeInitInternalValue(input) {
    var value = input.getAttribute("value"), components;
    if (value !== "") {
      components = inputTimeValidTimeStringToComponents(value);
    }
    if (components) {
      input.__polyformfillInputComponents = components;
    } else {
      input.__polyformfillInputComponents = {
        hour: INPUT_TIME_COMPONENT_EMPTY,
        minute: INPUT_TIME_COMPONENT_EMPTY,
        second: INPUT_TIME_COMPONENT_HIDDEN,
        milisecond: INPUT_TIME_COMPONENT_HIDDEN
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
        hour: parseInt(components[0], 10),
        minute: parseInt(components[1], 10),
        second: parseInt(components[2], 10),
        milisecond: parseInt(components[3], 10)
      };
    }
    return null;
  }
  function inputTimeGetRfc3339(element) {
    var components = inputTimeComponentsGet(element);
    if (components.hour > INPUT_TIME_COMPONENT_EMPTY && components.minute > INPUT_TIME_COMPONENT_EMPTY) {
      if (components.second === INPUT_TIME_COMPONENT_EMPTY) {
        components.second = INPUT_TIME_COMPONENT_HIDDEN;
      }
      if (components.milisecond === INPUT_TIME_COMPONENT_EMPTY) {
        components.milisecond = INPUT_TIME_COMPONENT_HIDDEN;
      }
      return inputTimeDefaultValueFormatter(element, components.hour, components.minute, components.second, components.milisecond);
    } else {
      return "";
    }
  }
  function inputTimeDefaultValueFormatter(input, hour, minute, second, milisecond) {
    var formatted;
    if (hour === INPUT_TIME_COMPONENT_EMPTY) {
      formatted = "--";
    } else {
      formatted = ("00" + hour).slice(-2);
    }
    formatted += ":";
    if (minute === INPUT_TIME_COMPONENT_EMPTY) {
      formatted += "--";
    } else {
      formatted += ("00" + minute).slice(-2);
    }
    if (second !== INPUT_TIME_COMPONENT_HIDDEN) {
      formatted += ":";
      if (second === INPUT_TIME_COMPONENT_EMPTY) {
        formatted += "--";
      } else {
        formatted += ("00" + second).slice(-2);
      }
      if (milisecond !== INPUT_TIME_COMPONENT_HIDDEN) {
        formatted += ".";
        if (milisecond === INPUT_TIME_COMPONENT_EMPTY) {
          formatted += "---";
        } else {
          formatted += ("000" + milisecond).slice(-3);
        }
      }
    }
    return formatted;
  }
  function inputTimeDefaultFormatOrder() {
    return [ INPUT_TIME_COMPONENT_HOUR, INPUT_TIME_COMPONENT_MINUTE, INPUT_TIME_COMPONENT_SECOND, INPUT_TIME_COMPONENT_MILISECOND ];
  }
  function inputTimeDefaultFormatSeparator() {
    return [ ":", "." ];
  }
  function initInputAccessibility() {
    window.addEventListener("keydown", inputAccessibilityOnKeydownHandleNavigation);
    window.addEventListener("keypress", inputAccessibilityOnKeyPressHandleUserInput);
    window.addEventListener("focus", inputAccessibilityOnFocusHandleInputSelection, true);
    window.addEventListener("focusin", inputAccessibilityOnFocusHandleInputSelection);
    window.addEventListener("click", inputAccessibilityOnFocusHandleInputSelection);
    window.addEventListener("blur", inputAccessibilityOnBlurHandleInputNormalization, true);
  }
  function inputAccessibilityOnKeydownHandleNavigation(event) {
    if (event.defaultPrevented) {
      return;
    }
    if (event.charCode) {
      return;
    }
    if (event.target instanceof HTMLInputElement) {
      switch (event.target.getAttribute(INPUT_ATTR_TYPE)) {
       case "date":
        inputDateAccessibilityOnKeydownHandleNavigation(event.target, event);
        break;

       case "datetime-local":
        inputDatetimeLocalAccessibilityOnKeydownHandleNavigation(event.target, event);
        break;

       case "time":
        inputTimeAccessibilityOnKeydownHandleNavigation(event.target, event);
        break;

       default:
        break;
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
       case "date":
        inputDateAccessibilityOnKeyPressHandleUserInput(event.target, event);
        break;

       case "datetime-local":
        inputDatetimeLocalAccessibilityOnKeyPressHandleUserInput(event.target, event);
        break;

       case "time":
        inputTimeAccessibilityOnKeyPressHandleUserInput(event.target, event);
        break;

       default:
        break;
      }
    }
  }
  function inputAccessibilityOnFocusHandleInputSelection(event) {
    if (event.target instanceof HTMLInputElement) {
      switch (event.target.getAttribute(INPUT_ATTR_TYPE)) {
       case "date":
        inputDateAccessibilityOnFocusHandleInputSelection(event.target, event);
        break;

       case "datetime-local":
        inputDatetimeLocalAccessibilityOnFocusHandleInputSelection(event.target, event);
        break;

       case "time":
        inputTimeAccessibilityOnFocusHandleInputSelection(event.target, event);
        break;

       default:
        break;
      }
    }
  }
  function inputAccessibilityOnBlurHandleInputNormalization(event) {
    if (event.target instanceof HTMLInputElement) {
      switch (event.target.getAttribute(INPUT_ATTR_TYPE)) {
       case "date":
        inputDateAccessibilityOnBlurHandleInputNormalization(event.target);
        break;

       case "datetime-local":
        inputDatetimeLocalAccessibilityOnBlurHandleInputNormalization(event.target);
        break;

       case "time":
        inputTimeAccessibilityOnBlurHandleInputNormalization(event.target);
        break;

       default:
        break;
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
      if (min === 0) {
        value -= 1;
      }
    } else {
      if (min === 0) {
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
    var previous = 0, test, i, componentSeparatorsCount = componentSeparators.length;
    for (i = 0; i < componentSeparatorsCount; i++) {
      test = value.lastIndexOf(componentSeparators[i], position - 1) + 1;
      if (test > previous) {
        previous = test;
      }
    }
    return previous;
  }
  function inputAccessibilityNextSeparator(value, position, componentSeparators) {
    var next = value.length, test, i, componentSeparatorsCount = componentSeparators.length;
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
    if (end === 0) {
      start = end;
      end = inputAccessibilityNextSeparator(value, position, componentSeparators);
    } else {
      end = end - 1;
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
      start = start + 1;
      end = inputAccessibilityNextSeparator(value, start, componentSeparators);
    }
    return [ start, end ];
  }
  function inputAccessibilityGetSelectedComponentNumber(value, position, componentSeparators) {
    var number = 0;
    while (position > 0) {
      position = inputAccessibilityPreviousSeparator(value, position, componentSeparators) - 1;
      if (position > 0) {
        number++;
      }
    }
    return number;
  }
  function inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator) {
    return componentOrder[inputAccessibilityGetSelectedComponentNumber(value, selectionStart, componentSeparator)];
  }
  var inputDomOriginalTypeGetter, inputDomOriginalValueGetter, inputDomOriginalValueSetter, inputDomOriginalValueAsNumberGetter, inputDomOriginalValueAsNumberSetter, inputDomOriginalStepUp, inputDomOriginalStepDown;
  function initInputDom(testInput) {
    var descriptor;
    if (HTMLInputElement && Object.isExtensible(HTMLInputElement.prototype)) {
      descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "type");
      if (descriptor === undefined) {
        descriptor = Object.getOwnPropertyDescriptor(testInput, "type");
      }
      inputDomOriginalTypeGetter = descriptor.get;
      if (descriptor.configurable) {
        Object.defineProperty(HTMLInputElement.prototype, "type", {
          get: inputDomTypeGet
        });
      }
      descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
      if (descriptor.configurable) {
        Object.defineProperty(HTMLInputElement.prototype, "value", {
          get: inputDomValueGet,
          set: inputDomValueSet
        });
        inputDomOriginalValueGetter = descriptor.get;
        inputDomOriginalValueSetter = descriptor.set;
      }
      descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "valueAsNumber");
      if (descriptor === undefined || descriptor.configurable) {
        Object.defineProperty(HTMLInputElement.prototype, "valueAsNumber", {
          get: inputDomValueAsNumberGet,
          set: inputDomValueAsNumberSet
        });
        if (descriptor) {
          inputDomOriginalValueAsNumberGetter = descriptor.get;
          inputDomOriginalValueAsNumberSetter = descriptor.set;
        }
      }
      Object.defineProperty(HTMLInputElement.prototype, "valueAsDate", {
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
    return new Error(code + ": " + message);
  }
  function inputDomTypeGet() {
    var attr, type = inputDomOriginalTypeGetter.call(this);
    if (type === "text") {
      attr = this.getAttribute(INPUT_ATTR_TYPE);
      switch (attr) {
       case "date":
       case "datetime-local":
       case "time":
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
     case "date":
      return inputDateDomValueGet(this);

     case "datetime-local":
      return inputDatetimeLocalDomValueGet(this);

     case "time":
      return inputTimeDomValueGet(this);

     default:
      return inputDomOriginalValueGetter.call(this);
    }
  }
  function inputDomValueSet(value) {
    var inputType = this.getAttribute(INPUT_ATTR_TYPE);
    switch (inputType) {
     case "date":
      return inputDateDomValueSet(this, value);

     case "datetime-local":
      return inputDatetimeLocalDomValueSet(this, value);

     case "time":
      return inputTimeDomValueSet(this, value);

     default:
      return inputDomOriginalValueSetter.call(this);
    }
  }
  function inputDomValueAsNumberGet() {
    var inputType = this.getAttribute(INPUT_ATTR_TYPE);
    switch (inputType) {
     case "date":
     case "datetime-local":
     case "time":
      return inputDomValueAsNumberGetFromDate.call(this);

     default:
      if (inputDomOriginalValueAsNumberGetter) {
        return inputDomOriginalValueAsNumberGetter.call(this);
      }
      return NaN;
    }
  }
  function inputDomValueAsNumberGetFromDate() {
    var date = inputDomValueAsDateGet.call(this);
    if (date) {
      return date.getTime();
    }
    return NaN;
  }
  function inputDomValueAsNumberSet(value) {
    var inputType = this.getAttribute(INPUT_ATTR_TYPE);
    switch (inputType) {
     case "date":
     case "datetime-local":
     case "time":
      inputDomValueAsNumberSetFromDate.call(this, value);
      break;

     default:
      inputDomOriginalValueSetter.call(this);
      break;
    }
  }
  function inputDomValueAsNumberSetFromDate(value) {
    var date = new Date(value);
    if (date) {
      inputDomValueAsDateSet.call(this, date);
    }
  }
  function inputDomValueAsDateGet() {
    var inputType = this.getAttribute(INPUT_ATTR_TYPE);
    switch (inputType) {
     case "date":
      return inputDateDomValueAsDateGet(this);

     case "datetime-local":
      return inputDatetimeLocalDomValueAsDateGet(this);

     case "time":
      return inputTimeDomValueAsDateGet(this);

     default:
      return null;
    }
  }
  function inputDomValueAsDateSet(value) {
    var inputType = this.getAttribute(INPUT_ATTR_TYPE);
    if (value instanceof Date) {}
    switch (inputType) {
     case "date":
      return inputDateDomValueAsDateSet(this, value);

     case "datetime-local":
      return inputDatetimeLocalDomValueAsDateSet(this, value);

     case "time":
      return inputTimeDomValueAsDateSet(this, value);

     default:
      return inputDomOriginalValueSetter.call(this, value);
    }
  }
  function inputDomStepUp(n) {
    var inputType = this.getAttribute(INPUT_ATTR_TYPE);
    n = n || 1;
    switch (inputType) {
     case "date":
      return inputDomStepUpOrDown(this, n, INPUT_DATE_STEP_DEFAULT, INPUT_DATE_STEP_SCALE_FACTOR);

     case "datetime-local":
      return inputDomStepUpOrDown(this, n, INPUT_TIME_STEP_DEFAULT, INPUT_TIME_STEP_SCALE_FACTOR);

     case "time":
      return inputDomStepUpOrDown(this, n, INPUT_TIME_STEP_DEFAULT, INPUT_TIME_STEP_SCALE_FACTOR);

     default:
      return inputDomOriginalStepUp.call(this, n);
    }
  }
  function inputDomStepDown(n) {
    var inputType = this.getAttribute(INPUT_ATTR_TYPE);
    n = n || 1;
    switch (inputType) {
     case "date":
      return inputDomStepUpOrDown(this, -n, INPUT_DATE_STEP_DEFAULT, INPUT_DATE_STEP_SCALE_FACTOR);

     case "datetime-local":
      return inputDomStepUpOrDown(this, -n, INPUT_TIME_STEP_DEFAULT, INPUT_TIME_STEP_SCALE_FACTOR);

     case "time":
      return inputDomStepUpOrDown(this, -n, INPUT_TIME_STEP_DEFAULT, INPUT_TIME_STEP_SCALE_FACTOR);

     default:
      return inputDomOriginalStepUp.call(this, n);
    }
  }
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
  function inputDomGetAllowedValueStep(element, defaultStep, stepScaleFactor) {
    var step;
    if (element.hasAttribute("step")) {
      step = element.getAttribute("step");
      if (step === "any") {
        return null;
      }
      step = parseInt(step, 10);
      if (step < 1) {
        step = defaultStep;
      }
    } else {
      step = defaultStep;
    }
    return step * stepScaleFactor;
  }
  function initInputNormalization() {
    window.addEventListener("submit", inputNormalizationOnSubmitNormalizeInput);
    window.addEventListener("load", inputNormalizationOnLoadFormatInputElements);
  }
  function inputNormalizationOnLoadFormatInputElements(event) {
    var elements = event.target.getElementsByTagName("INPUT"), i;
    for (i = 0; i < elements.length; i++) {
      switch (elements[i].getAttribute(INPUT_ATTR_TYPE)) {
       case "date":
        inputDateNormalizationOnLoadFormatInputElements(elements[i]);
        break;

       case "datetime-local":
        inputDatetimeLocalNormalizationOnLoadFormatInputElements(elements[i]);
        break;

       case "time":
        inputTimeNormalizationOnLoadFormatInputElements(elements[i]);
        break;

       default:
        break;
      }
    }
  }
  function inputNormalizationOnSubmitNormalizeInput(event) {
    var elements = event.target.elements, i;
    for (i = 0; i < elements.length; i++) {
      switch (elements[i].getAttribute(INPUT_ATTR_TYPE)) {
       case "date":
        inputDateNormalizationOnSubmitNormalizeInput(elements[i]);
        break;

       case "datetime-local":
        inputDatetimeLocalNormalizationOnSubmitNormalizeInput(elements[i]);
        break;

       case "time":
        inputTimeNormalizationOnSubmitNormalizeInput(elements[i]);
        break;

       default:
        break;
      }
    }
  }
  function inputDateAccessibilityOnKeydownHandleNavigation(element, event) {
    var selectionStart = element.selectionStart;
    switch (event.key) {
     case "Backspace":
     case "U+0008":
     case "Del":
      inputDateClearDateComponent(element, selectionStart);
      break;

     case "Tab":
     case "U+0009":
      inputDateAccessibilityOnTabKeydownHandleNavigation(element, event, selectionStart);
      return;

     case "Left":
      inputDateAccessibilityNormalizeSelectedComponent(element, selectionStart);
      inputDateAccessibilitySelectPreviousDateComponent(element, selectionStart);
      break;

     case "Up":
      inputDateAccessibilityIncreaseDateComponent(element, selectionStart, 1);
      break;

     case "Right":
      inputDateAccessibilityNormalizeSelectedComponent(element, selectionStart);
      inputDateAccessibilitySelectNextDateComponent(element, selectionStart);
      break;

     case "Down":
      inputDateAccessibilityIncreaseDateComponent(element, selectionStart, -1);
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
      if (inputAccessibilityGetSelectedComponentNumber(inputDomOriginalValueGetter.call(element), selectionStart, inputDateFormatSeparatorGetter(element)) !== 0) {
        inputDateAccessibilitySelectPreviousDateComponent(element, selectionStart);
      } else {
        return;
      }
    } else {
      if (inputAccessibilityGetSelectedComponentNumber(inputDomOriginalValueGetter.call(element), selectionStart, inputDateFormatSeparatorGetter(element)) !== 2) {
        inputDateAccessibilitySelectNextDateComponent(element, selectionStart);
      } else {
        return;
      }
    }
    event.preventDefault();
  }
  function inputDateAccessibilityOnKeyPressHandleUserInput(element, event) {
    if (event.charCode > 47 && event.charCode < 58) {
      var selectionStart = element.selectionStart;
      var selectNext = false;
      var value = inputDomOriginalValueGetter.call(element), components = inputDateComponentsGet(element), componentOrder = inputDateFormatOrderGetter(element), componentSeparator = inputDateFormatSeparatorGetter(element), selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);
      switch (selectedComponent) {
       case DATECOMPONENT_YEAR:
        components.year = parseInt((components.year + event.key).substr(-6), 10);
        break;

       case DATECOMPONENT_MONTH:
        components.month = inputAccessibilityComplementComponent(components.month, event.key, INPUT_DATE_MONTH_MIN, INPUT_DATE_MONTH_MAX, 0);
        if (components.month > 0) {
          selectNext = true;
        }
        break;

       case DATECOMPONENT_DAY:
        components.day = inputAccessibilityComplementComponent(components.day, event.key, INPUT_DATE_DAY_MIN, INPUT_DATE_DAY_MAX, 3);
        if (components.day > 3) {
          selectNext = true;
        }
        break;

       default:
        return;
      }
      value = inputDateComponentsSet(element, components.year, components.month, components.day);
      var selection = inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator);
      if (selectNext) {
        inputDateAccessibilitySelectNextDateComponent(element, selection[0], selection[1]);
      } else {
        element.setSelectionRange.apply(element, selection);
      }
    }
    event.preventDefault();
  }
  function inputDateAccessibilityOnFocusHandleInputSelection(element, event) {
    var componentRange, value, selectionStart, componentSeparator;
    value = inputDomOriginalValueGetter.call(element);
    componentSeparator = inputDateFormatSeparatorGetter(element);
    if (!value) {
      value = inputDateComponentsSet(element, INPUT_DATE_YEAR_EMPTY, INPUT_DATE_MONTH_EMPTY, INPUT_DATE_DAY_EMPTY);
      selectionStart = 0;
    } else {
      selectionStart = element.selectionStart;
    }
    componentRange = inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator);
    element.setSelectionRange.apply(element, componentRange);
    event.preventDefault();
  }
  function inputDateAccessibilityOnBlurHandleInputNormalization(element) {
    inputDateAccessibilityNormalizeSelectedComponent(element, element.selectionStart);
  }
  function inputDateClearDateComponent(input, selectionStart) {
    var value = inputDomOriginalValueGetter.call(input), components = inputDateComponentsGet(input), componentOrder = inputDateFormatOrderGetter(input), componentSeparator = inputDateFormatSeparatorGetter(input), selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);
    switch (selectedComponent) {
     case DATECOMPONENT_YEAR:
      components.year = INPUT_DATE_YEAR_EMPTY;
      break;

     case DATECOMPONENT_MONTH:
      components.month = INPUT_DATE_MONTH_EMPTY;
      break;

     case DATECOMPONENT_DAY:
      components.day = INPUT_DATE_DAY_EMPTY;
      break;

     default:
      return;
    }
    value = inputDateComponentsSet(input, components.year, components.month, components.day);
    input.setSelectionRange.apply(input, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
  }
  function inputDateAccessibilityNormalizeSelectedComponent(input, selectionStart) {
    var value = inputDomOriginalValueGetter.call(input), components = inputDateComponentsGet(input), componentOrder = inputDateFormatOrderGetter(input), componentSeparator = inputDateFormatSeparatorGetter(input), selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);
    switch (selectedComponent) {
     case DATECOMPONENT_YEAR:
      if (components.year > INPUT_DATE_YEAR_MAX) {
        components.year = INPUT_DATE_YEAR_MAX;
      }
      break;

     case DATECOMPONENT_MONTH:
      if (components.month > INPUT_DATE_MONTH_MAX) {
        components.month = INPUT_DATE_MONTH_MAX;
      }
      break;

     case DATECOMPONENT_DAY:
      if (components.day > INPUT_DATE_DAY_MAX) {
        components.day = INPUT_DATE_DAY_MAX;
      }
      break;

     default:
      return;
    }
    inputDateComponentsSet(input, components.year, components.month, components.day);
  }
  function inputDateAccessibilitySelectPreviousDateComponent(input, selectionStart) {
    var value = inputDomOriginalValueGetter.call(input), componentSeparator = inputDateFormatSeparatorGetter(input), selection = inputAccessibilityGetPreviousComponentRange(value, selectionStart, componentSeparator);
    input.setSelectionRange(selection[0], selection[1]);
  }
  function inputDateAccessibilitySelectNextDateComponent(input, selectionStart) {
    var value = inputDomOriginalValueGetter.call(input), componentSeparator = inputDateFormatSeparatorGetter(input), selection = inputAccessibilityGetNextComponentRange(value, selectionStart, componentSeparator);
    input.setSelectionRange(selection[0], selection[1]);
  }
  function inputDateAccessibilityIncreaseDateComponent(input, selectionStart, amount) {
    var value = inputDomOriginalValueGetter.call(input), components = inputDateComponentsGet(input), componentOrder = inputDateFormatOrderGetter(input), componentSeparator = inputDateFormatSeparatorGetter(input), selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);
    switch (selectedComponent) {
     case DATECOMPONENT_YEAR:
      components.year = inputAccessibilityIncreaseComponent(components.year, amount, INPUT_DATE_YEAR_MIN, INPUT_DATE_YEAR_MAX);
      break;

     case DATECOMPONENT_MONTH:
      components.month = inputAccessibilityIncreaseComponent(components.month, amount, INPUT_DATE_MONTH_MIN, INPUT_DATE_MONTH_MAX);
      break;

     case DATECOMPONENT_DAY:
      components.day = inputAccessibilityIncreaseComponent(components.day, amount, INPUT_DATE_DAY_MIN, INPUT_DATE_DAY_MAX);
      break;

     default:
      return;
    }
    value = inputDateComponentsSet(input, components.year, components.month, components.day);
    input.setSelectionRange.apply(input, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
  }
  var INPUT_DATE_STEP_DEFAULT = 1;
  var INPUT_DATE_STEP_SCALE_FACTOR = 864e5;
  function inputDateDomValueGet(element) {
    return inputDateGetRfc3339(element);
  }
  function inputDateDomValueSet(element, value) {
    var date;
    if (value !== "") {
      date = getDateFromRfc3339FullDateString(value);
    }
    if (date) {
      inputDateComponentsSet(element, date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    } else {
      inputDateComponentsSet(element, INPUT_DATE_YEAR_EMPTY, INPUT_DATE_MONTH_EMPTY, INPUT_DATE_DAY_EMPTY);
    }
    return value;
  }
  function inputDateDomValueAsDateGet(element) {
    return inputDateGetDate(element);
  }
  function inputDateDomValueAsDateSet(element, value) {
    inputDateComponentsSet(element, value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());
  }
  function initInputDateLocalization() {
    inputDateValueFormatter = inputDateLocalizationValueFormatter;
    inputDateFormatOrderGetter = inputDateLocalizationFormatOrder;
    inputDateFormatSeparatorGetter = inputDateLocalizationFormatSeparator;
  }
  function inputDateLocalizationValueFormatter(input, year, month, day) {
    var separator = inputDateFormatSeparatorGetter(input), value;
    if (year === INPUT_DATE_YEAR_EMPTY) {
      year = "yyyy";
    } else {
      if (year <= 9999) {
        year = ("000" + year).slice(-4);
      }
    }
    if (month === INPUT_DATE_MONTH_EMPTY) {
      month = "mm";
    } else {
      month = ("00" + (month + 1)).slice(-2);
    }
    if (day === INPUT_DATE_DAY_EMPTY) {
      day = "dd";
    } else {
      day = ("00" + day).slice(-2);
    }
    var lang;
    if (input.hasAttribute("lang")) {
      lang = input.getAttribute("lang").toLowerCase();
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
      break;
    }
    return value;
  }
  function inputDateLocalizationFormatOrder(input) {
    var lang, order;
    if (input.hasAttribute("lang")) {
      lang = input.getAttribute("lang").toLowerCase();
    }
    switch (lang) {
     case "en":
     case "en-us":
      order = [ DATECOMPONENT_MONTH, DATECOMPONENT_DAY, DATECOMPONENT_YEAR ];
      break;

     case "en-gb":
     case "de":
     case "nl":
      order = [ DATECOMPONENT_DAY, DATECOMPONENT_MONTH, DATECOMPONENT_YEAR ];
      break;

     default:
      order = [ DATECOMPONENT_YEAR, DATECOMPONENT_MONTH, DATECOMPONENT_DAY ];
      break;
    }
    return order;
  }
  function inputDateLocalizationFormatSeparator(input) {
    var lang, separator;
    if (input.hasAttribute("lang")) {
      lang = input.getAttribute("lang").toLowerCase();
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
      break;
    }
    return [ separator ];
  }
  function inputDateNormalizationOnLoadFormatInputElements(element) {
    var components = inputDateComponentsGet(element);
    inputDateComponentsSet(element, components.year, components.month, components.day);
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
        if (selectionStart === 0) {
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
    if (event.charCode > 47 && event.charCode < 58) {
      var selectionStart = element.selectionStart, selectNext = false, value = inputDomOriginalValueGetter.call(element), components = inputDatetimeLocalComponentsGet(element), componentOrder = inputDatetimeLocalFormatOrderGetter(element), componentSeparator = inputDatetimeLocalFormatSeparatorGetter(element), selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);
      switch (selectedComponent) {
       case INPUT_TIME_COMPONENT_HOUR:
        components.hour = inputAccessibilityComplementComponent(components.hour, event.key, INPUT_TIME_COMPONENT_HOUR_MIN, INPUT_TIME_COMPONENT_HOUR_MAX, 2);
        if (components.hour > 2) {
          selectNext = true;
        }
        break;

       case INPUT_TIME_COMPONENT_MINUTE:
        components.minute = inputAccessibilityComplementComponent(components.minute, event.key, INPUT_TIME_COMPONENT_MINUTE_MIN, INPUT_TIME_COMPONENT_MINUTE_MAX, 5);
        if (components.minute > 5) {
          selectNext = true;
        }
        break;

       case INPUT_TIME_COMPONENT_SECOND:
        components.second = inputAccessibilityComplementComponent(components.second, event.key, INPUT_TIME_COMPONENT_SECOND_MIN, INPUT_TIME_COMPONENT_SECOND_MAX, 5);
        if (components.second > 5) {
          selectNext = true;
        }
        break;

       case INPUT_TIME_COMPONENT_MILISECOND:
        components.milisecond = inputAccessibilityComplementComponent(components.second, event.key, INPUT_TIME_COMPONENT_MILISECOND_MIN, INPUT_TIME_COMPONENT_MILISECOND_MAX, 99);
        if (components.milisecond > 99) {
          selectNext = true;
        }
        break;

       default:
        return;
      }
      value = inputDatetimeLocalComponentsSet(element, components.hour, components.minute, components.second, components.milisecond);
      var selection = inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator);
      if (selectNext) {
        inputDatetimeLocalAccessibilitySelectNextComponent(element, selection[0]);
      } else {
        element.setSelectionRange.apply(element, selection);
      }
    }
    event.preventDefault();
  }
  function inputDatetimeLocalAccessibilityOnFocusHandleInputSelection(element, event) {
    var componentRange, value, selectionStart, componentSeparator;
    value = inputDomOriginalValueGetter.call(element);
    componentSeparator = inputDatetimeLocalFormatSeparatorGetter(element);
    if (!value) {
      value = inputDatetimeLocalComponentsSet(element, INPUT_DATE_YEAR_EMPTY, INPUT_DATE_MONTH_EMPTY, INPUT_DATE_DAY_EMPTY, INPUT_TIME_COMPONENT_EMPTY, INPUT_TIME_COMPONENT_EMPTY, INPUT_TIME_COMPONENT_HIDDEN, INPUT_TIME_COMPONENT_HIDDEN);
      selectionStart = 0;
    } else {
      selectionStart = element.selectionStart;
    }
    componentRange = inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator);
    element.setSelectionRange.apply(element, componentRange);
    event.preventDefault();
  }
  function inputDatetimeLocalAccessibilityOnBlurHandleInputNormalization(element) {
    inputDatetimeLocalAccessibilityNormalizeSelectedComponent(element, element.selectionStart);
  }
  function inputDatetimeLocalClearComponent(input, selectionStart) {
    var value = inputDomOriginalValueGetter.call(input), components = inputDatetimeLocalComponentsGet(input), componentOrder = inputDatetimeLocalFormatOrderGetter(input), componentSeparator = inputDatetimeLocalFormatSeparatorGetter(input), selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);
    switch (selectedComponent) {
     case DATECOMPONENT_YEAR:
      components.year = INPUT_DATE_YEAR_EMPTY;
      break;

     case DATECOMPONENT_MONTH:
      components.month = INPUT_DATE_MONTH_EMPTY;
      break;

     case DATECOMPONENT_DAY:
      components.day = INPUT_DATE_DAY_EMPTY;
      break;

     case INPUT_TIME_COMPONENT_HOUR:
      components.hour = INPUT_TIME_COMPONENT_EMPTY;
      break;

     case INPUT_TIME_COMPONENT_MINUTE:
      components.minute = INPUT_TIME_COMPONENT_EMPTY;
      break;

     case INPUT_TIME_COMPONENT_SECOND:
      components.second = INPUT_TIME_COMPONENT_EMPTY;
      break;

     case INPUT_TIME_COMPONENT_MILISECOND:
      components.milisecond = INPUT_TIME_COMPONENT_EMPTY;
      break;

     default:
      return;
    }
    value = inputDatetimeLocalComponentsSet(input, components.year, components.month, components.day, components.hour, components.minute, components.second, components.milisecond);
    input.setSelectionRange.apply(input, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
  }
  function inputDatetimeLocalAccessibilityNormalizeSelectedComponent(input, selectionStart) {
    var value = inputDomOriginalValueGetter.call(input), components = inputDatetimeLocalComponentsGet(input), componentOrder = inputDatetimeLocalFormatOrderGetter(input), componentSeparator = inputDatetimeLocalFormatSeparatorGetter(input), selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);
    switch (selectedComponent) {
     case DATECOMPONENT_YEAR:
      if (components.year > INPUT_DATE_YEAR_MAX) {
        components.year = INPUT_DATE_YEAR_MAX;
      }
      break;

     case DATECOMPONENT_MONTH:
      if (components.month > INPUT_DATE_MONTH_MAX) {
        components.month = INPUT_DATE_MONTH_MAX;
      }
      break;

     case DATECOMPONENT_DAY:
      if (components.day > INPUT_DATE_DAY_MAX) {
        components.day = INPUT_DATE_DAY_MAX;
      }
      break;

     case INPUT_TIME_COMPONENT_HOUR:
      if (components.hour > INPUT_TIME_COMPONENT_HOUR_MAX) {
        components.hour = INPUT_TIME_COMPONENT_HOUR_MAX;
      }
      break;

     case INPUT_TIME_COMPONENT_MINUTE:
      if (components.minute > INPUT_TIME_COMPONENT_MINUTE_MAX) {
        components.minute = INPUT_TIME_COMPONENT_MINUTE_MAX;
      }
      break;

     case INPUT_TIME_COMPONENT_SECOND:
      if (components.second > INPUT_TIME_COMPONENT_SECOND_MAX) {
        components.second = INPUT_TIME_COMPONENT_SECOND_MAX;
      }
      break;

     case INPUT_TIME_COMPONENT_MILISECOND:
      if (components.milisecond > INPUT_TIME_COMPONENT_MILISECOND_MAX) {
        components.milisecond = INPUT_TIME_COMPONENT_MILISECOND_MAX;
      }
      break;

     default:
      return;
    }
    inputDatetimeLocalComponentsSet(input, components.year, components.month, components.day, components.hour, components.minute, components.second, components.milisecond);
  }
  function inputDatetimeLocalAccessibilitySelectPreviousComponent(element, selectionStart) {
    inputDatetimeLocalAccessibilityNormalizeSelectedComponent(element, selectionStart);
    var value = inputDomOriginalValueGetter.call(element), componentSeparator = inputDatetimeLocalFormatSeparatorGetter(element), selection = inputAccessibilityGetPreviousComponentRange(value, selectionStart, componentSeparator);
    element.setSelectionRange(selection[0], selection[1]);
  }
  function inputDatetimeLocalAccessibilitySelectNextComponent(element, selectionStart) {
    inputDatetimeLocalAccessibilityNormalizeSelectedComponent(element, selectionStart);
    var value = inputDomOriginalValueGetter.call(element), componentSeparator = inputDatetimeLocalFormatSeparatorGetter(element), selection = inputAccessibilityGetNextComponentRange(value, selectionStart, componentSeparator);
    element.setSelectionRange(selection[0], selection[1]);
  }
  function inputDatetimeLocalAccessibilityIncreaseComponent(input, selectionStart, amount) {
    var value = inputDomOriginalValueGetter.call(input), components = inputDatetimeLocalComponentsGet(input), componentOrder = inputDatetimeLocalFormatOrderGetter(input), componentSeparator = inputDatetimeLocalFormatSeparatorGetter(input), selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);
    switch (selectedComponent) {
     case DATECOMPONENT_YEAR:
      components.year = inputAccessibilityIncreaseComponent(components.year, amount, INPUT_DATE_YEAR_MIN, INPUT_DATE_YEAR_MAX);
      break;

     case DATECOMPONENT_MONTH:
      components.month = inputAccessibilityIncreaseComponent(components.month, amount, INPUT_DATE_MONTH_MIN, INPUT_DATE_MONTH_MAX);
      break;

     case DATECOMPONENT_DAY:
      components.day = inputAccessibilityIncreaseComponent(components.day, amount, INPUT_DATE_DAY_MIN, INPUT_DATE_DAY_MAX);
      break;

     case INPUT_TIME_COMPONENT_HOUR:
      components.hour = inputAccessibilityIncreaseComponent(components.hour, amount, INPUT_TIME_COMPONENT_HOUR_MIN, INPUT_TIME_COMPONENT_HOUR_MAX);
      break;

     case INPUT_TIME_COMPONENT_MINUTE:
      components.minute = inputAccessibilityIncreaseComponent(components.minute, amount, INPUT_TIME_COMPONENT_MINUTE_MIN, INPUT_TIME_COMPONENT_MINUTE_MAX);
      break;

     case INPUT_TIME_COMPONENT_SECOND:
      components.second = inputAccessibilityIncreaseComponent(components.second, amount, INPUT_TIME_COMPONENT_SECOND_MIN, INPUT_TIME_COMPONENT_SECOND_MAX);
      break;

     case INPUT_TIME_COMPONENT_MILISECOND:
      components.milisecond = inputAccessibilityIncreaseComponent(components.milisecond, amount, INPUT_TIME_COMPONENT_MILISECOND_MIN, INPUT_TIME_COMPONENT_MILISECOND_MAX);
      break;

     default:
      return;
    }
    value = inputDatetimeLocalComponentsSet(input, components.year, components.month, components.day, components.hour, components.minute, components.second, components.milisecond);
    input.setSelectionRange.apply(input, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
  }
  function inputDatetimeLocalDomValueGet(element) {
    return inputDatetimeLocalGetRfc3339(element);
  }
  function inputDatetimeLocalDomValueSet(element, value) {
    var components;
    if (value !== "") {
      components = inputDatetimeLocalValidValueStringToComponents(value + "");
    }
    if (components) {
      inputDatetimeLocalComponentsSet(element, components.year, components.month, components.day, components.hour, components.minute, components.second, components.milisecond);
    } else {
      inputDatetimeLocalComponentsSet(element, INPUT_DATE_YEAR_EMPTY, INPUT_DATE_MONTH_EMPTY, INPUT_DATE_DAY_EMPTY, INPUT_TIME_COMPONENT_EMPTY, INPUT_TIME_COMPONENT_EMPTY, INPUT_TIME_COMPONENT_HIDDEN, INPUT_TIME_COMPONENT_HIDDEN);
    }
    return value;
  }
  function inputDatetimeLocalDomValueAsDateGet(element) {
    var components = inputDatetimeLocalComponentsGet(element), date = null;
    if (components.hour !== INPUT_TIME_COMPONENT_EMPTY && components.minute !== INPUT_TIME_COMPONENT_EMPTY) {
      date = inputDateGetDate(element);
      if (date) {
        date.setUTCHours(components.hour);
        date.setUTCMinutes(components.minute);
        if (components.second > INPUT_TIME_COMPONENT_EMPTY) {
          date.setUTCSeconds(components.second);
        }
        if (components.milisecond > INPUT_TIME_COMPONENT_EMPTY) {
          date.setUTCMilliseconds(components.milisecond);
        }
      }
    }
    return date;
  }
  function inputDatetimeLocalDomValueAsDateSet(element, value) {
    inputDatetimeLocalComponentsSet(element, value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds(), value.getUTCMilliseconds());
  }
  function inputDatetimeLocalNormalizationOnLoadFormatInputElements(element) {
    var components = inputDatetimeLocalComponentsGet(element);
    inputDatetimeLocalComponentsSet(element, components.year, components.month, components.day, components.hour, components.minute, components.second, components.milisecond);
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
      inputTimeClearComponent(element, selectionStart);
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
        if (selectionStart === 0) {
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
    if (event.charCode > 47 && event.charCode < 58) {
      var selectionStart = element.selectionStart, selectNext = false, value = inputDomOriginalValueGetter.call(element), components = inputTimeComponentsGet(element), componentOrder = inputTimeFormatOrderGetter(element), componentSeparator = inputTimeFormatSeparatorGetter(element), selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);
      switch (selectedComponent) {
       case INPUT_TIME_COMPONENT_HOUR:
        components.hour = inputAccessibilityComplementComponent(components.hour, event.key, INPUT_TIME_COMPONENT_HOUR_MIN, INPUT_TIME_COMPONENT_HOUR_MAX, 2);
        if (components.hour > 2) {
          selectNext = true;
        }
        break;

       case INPUT_TIME_COMPONENT_MINUTE:
        components.minute = inputAccessibilityComplementComponent(components.minute, event.key, INPUT_TIME_COMPONENT_MINUTE_MIN, INPUT_TIME_COMPONENT_MINUTE_MAX, 5);
        if (components.minute > 5) {
          selectNext = true;
        }
        break;

       case INPUT_TIME_COMPONENT_SECOND:
        components.second = inputAccessibilityComplementComponent(components.second, event.key, INPUT_TIME_COMPONENT_SECOND_MIN, INPUT_TIME_COMPONENT_SECOND_MAX, 5);
        if (components.second > 5) {
          selectNext = true;
        }
        break;

       case INPUT_TIME_COMPONENT_MILISECOND:
        components.milisecond = inputAccessibilityComplementComponent(components.second, event.key, INPUT_TIME_COMPONENT_MILISECOND_MIN, INPUT_TIME_COMPONENT_MILISECOND_MAX, 99);
        if (components.milisecond > 99) {
          selectNext = true;
        }
        break;

       default:
        return;
      }
      value = inputTimeComponentsSet(element, components.hour, components.minute, components.second, components.milisecond);
      var selection = inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator);
      if (selectNext) {
        inputTimeAccessibilitySelectNextComponent(element, selection[0]);
      } else {
        element.setSelectionRange.apply(element, selection);
      }
    }
    event.preventDefault();
  }
  function inputTimeAccessibilityOnFocusHandleInputSelection(element, event) {
    var componentRange, value, selectionStart, componentSeparator;
    value = inputDomOriginalValueGetter.call(element);
    componentSeparator = inputTimeFormatSeparatorGetter(element);
    if (!value) {
      value = inputTimeComponentsSet(element, INPUT_TIME_COMPONENT_EMPTY, INPUT_TIME_COMPONENT_EMPTY, INPUT_TIME_COMPONENT_HIDDEN, INPUT_TIME_COMPONENT_HIDDEN);
      selectionStart = 0;
    } else {
      selectionStart = element.selectionStart;
    }
    componentRange = inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator);
    element.setSelectionRange.apply(element, componentRange);
    event.preventDefault();
  }
  function inputTimeAccessibilityOnBlurHandleInputNormalization(element) {
    inputTimeAccessibilityNormalizeSelectedComponent(element, element.selectionStart);
  }
  function inputTimeClearComponent(input, selectionStart) {
    var value = inputDomOriginalValueGetter.call(input), components = inputTimeComponentsGet(input), componentOrder = inputTimeFormatOrderGetter(input), componentSeparator = inputTimeFormatSeparatorGetter(input), selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);
    switch (selectedComponent) {
     case INPUT_TIME_COMPONENT_HOUR:
      components.hour = INPUT_TIME_COMPONENT_EMPTY;
      break;

     case INPUT_TIME_COMPONENT_MINUTE:
      components.minute = INPUT_TIME_COMPONENT_EMPTY;
      break;

     case INPUT_TIME_COMPONENT_SECOND:
      components.second = INPUT_TIME_COMPONENT_EMPTY;
      break;

     case INPUT_TIME_COMPONENT_MILISECOND:
      components.milisecond = INPUT_TIME_COMPONENT_EMPTY;
      break;

     default:
      return;
    }
    value = inputTimeComponentsSet(input, components.hour, components.minute, components.second, components.milisecond);
    input.setSelectionRange.apply(input, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
  }
  function inputTimeAccessibilityNormalizeSelectedComponent(input, selectionStart) {
    var value = inputDomOriginalValueGetter.call(input), components = inputTimeComponentsGet(input), componentOrder = inputTimeFormatOrderGetter(input), componentSeparator = inputTimeFormatSeparatorGetter(input), selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);
    switch (selectedComponent) {
     case INPUT_TIME_COMPONENT_HOUR:
      if (components.hour > INPUT_TIME_COMPONENT_HOUR_MAX) {
        components.hour = INPUT_TIME_COMPONENT_HOUR_MAX;
      }
      break;

     case INPUT_TIME_COMPONENT_MINUTE:
      if (components.minute > INPUT_TIME_COMPONENT_MINUTE_MAX) {
        components.minute = INPUT_TIME_COMPONENT_MINUTE_MAX;
      }
      break;

     case INPUT_TIME_COMPONENT_SECOND:
      if (components.second > INPUT_TIME_COMPONENT_SECOND_MAX) {
        components.second = INPUT_TIME_COMPONENT_SECOND_MAX;
      }
      break;

     case INPUT_TIME_COMPONENT_MILISECOND:
      if (components.milisecond > INPUT_TIME_COMPONENT_MILISECOND_MAX) {
        components.milisecond = INPUT_TIME_COMPONENT_MILISECOND_MAX;
      }
      break;

     default:
      return;
    }
    inputTimeComponentsSet(input, components.hour, components.minute, components.second, components.milisecond);
  }
  function inputTimeAccessibilitySelectPreviousComponent(element, selectionStart) {
    inputTimeAccessibilityNormalizeSelectedComponent(element, selectionStart);
    var value = inputDomOriginalValueGetter.call(element), componentSeparator = inputTimeFormatSeparatorGetter(element), selection = inputAccessibilityGetPreviousComponentRange(value, selectionStart, componentSeparator);
    element.setSelectionRange(selection[0], selection[1]);
  }
  function inputTimeAccessibilitySelectNextComponent(element, selectionStart) {
    inputTimeAccessibilityNormalizeSelectedComponent(element, selectionStart);
    var value = inputDomOriginalValueGetter.call(element), componentSeparator = inputTimeFormatSeparatorGetter(element), selection = inputAccessibilityGetNextComponentRange(value, selectionStart, componentSeparator);
    element.setSelectionRange(selection[0], selection[1]);
  }
  function inputTimeAccessibilityIncreaseComponent(input, selectionStart, amount) {
    var value = inputDomOriginalValueGetter.call(input), components = inputTimeComponentsGet(input), componentOrder = inputTimeFormatOrderGetter(input), componentSeparator = inputTimeFormatSeparatorGetter(input), selectedComponent = inputAccessibilityGetSelectedComponent(value, selectionStart, componentOrder, componentSeparator);
    switch (selectedComponent) {
     case INPUT_TIME_COMPONENT_HOUR:
      components.hour = inputAccessibilityIncreaseComponent(components.hour, amount, INPUT_TIME_COMPONENT_HOUR_MIN, INPUT_TIME_COMPONENT_HOUR_MAX);
      break;

     case INPUT_TIME_COMPONENT_MINUTE:
      components.minute = inputAccessibilityIncreaseComponent(components.minute, amount, INPUT_TIME_COMPONENT_MINUTE_MIN, INPUT_TIME_COMPONENT_MINUTE_MAX);
      break;

     case INPUT_TIME_COMPONENT_SECOND:
      components.second = inputAccessibilityIncreaseComponent(components.second, amount, INPUT_TIME_COMPONENT_SECOND_MIN, INPUT_TIME_COMPONENT_SECOND_MAX);
      break;

     case INPUT_TIME_COMPONENT_MILISECOND:
      components.milisecond = inputAccessibilityIncreaseComponent(components.milisecond, amount, INPUT_TIME_COMPONENT_MILISECOND_MIN, INPUT_TIME_COMPONENT_MILISECOND_MAX);
      break;

     default:
      return;
    }
    value = inputTimeComponentsSet(input, components.hour, components.minute, components.second, components.milisecond);
    input.setSelectionRange.apply(input, inputAccessibilityGetComponentRange(value, selectionStart, componentSeparator));
  }
  var INPUT_TIME_STEP_DEFAULT = 60;
  var INPUT_TIME_STEP_SCALE_FACTOR = 1e3;
  function inputTimeDomValueGet(element) {
    return inputTimeGetRfc3339(element);
  }
  function inputTimeDomValueSet(element, value) {
    var components;
    if (value !== "") {
      components = inputTimeValidTimeStringToComponents(value);
    }
    if (components) {
      inputTimeComponentsSet(element, components.hour, components.minute, components.second, components.milisecond);
    } else {
      inputTimeComponentsSet(element, INPUT_TIME_COMPONENT_EMPTY, INPUT_TIME_COMPONENT_EMPTY, INPUT_TIME_COMPONENT_EMPTY, INPUT_TIME_COMPONENT_EMPTY);
    }
    return value;
  }
  function inputTimeDomValueAsDateGet(element) {
    var components = inputTimeComponentsGet(element), date = null;
    if (components.hour !== INPUT_TIME_COMPONENT_EMPTY && components.minute !== INPUT_TIME_COMPONENT_EMPTY) {
      date = new Date(0);
      date.setUTCHours(components.hour);
      date.setUTCMinutes(components.minute);
      if (components.second > INPUT_TIME_COMPONENT_EMPTY) {
        date.setUTCSeconds(components.second);
      }
      if (components.milisecond > INPUT_TIME_COMPONENT_EMPTY) {
        date.setUTCMilliseconds(components.milisecond);
      }
    }
    return date;
  }
  function inputTimeDomValueAsDateSet(element, value) {
    inputTimeComponentsSet(element, value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds(), value.getUTCMilliseconds());
  }
  function inputTimeNormalizationOnLoadFormatInputElements(element) {
    var components = inputTimeComponentsGet(element);
    inputTimeComponentsSet(element, components.hour, components.minute, components.second, components.milisecond);
  }
  function inputTimeNormalizationOnSubmitNormalizeInput(element) {
    inputDomOriginalValueSetter.call(element, inputTimeGetRfc3339(element));
  }
})(window, document);