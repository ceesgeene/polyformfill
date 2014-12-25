(function(window, document, undefined) {
  "use strict";
  var testInput = document.createElement("input");
  var INPUT_ATTR_TYPE = "type";
  if (!("valueAsDate" in testInput)) {
    initInputDate();
    if (typeof initDom !== "undefined") {
      initDom();
    }
    initAccessibility();
    initLocalization();
    if (typeof initNormalization !== "undefined") {
      initNormalization();
    }
  }
  var DATECOMPONENT_YEAR = 1, DATECOMPONENT_MONTH = 2, DATECOMPONENT_DAY = 4;
  var INPUT_DATE_YEAR_EMPTY = 0, INPUT_DATE_MONTH_EMPTY = -1, INPUT_DATE_DAY_EMPTY = 0;
  var INPUT_DATE_YEAR_MIN = 1;
  var INPUT_DATE_YEAR_MAX = 275760;
  var INPUT_DATE_MONTH_MIN = 0;
  var INPUT_DATE_MONTH_MAX = 11;
  var INPUT_DATE_DAY_MIN = 1;
  var INPUT_DATE_DAY_MAX = 31;
  var rfc3999FullDateRegExp = /^([0-9]{4,})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  var inputDateNativeValueGetter;
  var inputDateNativeValueSetter;
  var inputDateValueFormatter;
  var inputDateFormatOrderGetter;
  var inputDateFormatSeparatorGetter;
  function initInputDate() {
    inputDateNativeValueGetter = inputDateGetValueProperty;
    inputDateNativeValueSetter = inputDateSetValueProperty;
    inputDateValueFormatter = inputDateFuzzyRfc3339ValueFormatter;
    inputDateFormatOrderGetter = inputDateRfc3339FormatOrder;
    inputDateFormatSeparatorGetter = inputDateRfc3339FormatSeparator;
  }
  function inputDateGetValueProperty() {
    return this.value;
  }
  function inputDateSetValueProperty(value) {
    this.value = value;
    return this.value;
  }
  function inputDateSetDateComponents(input, year, month, day) {
    input.__polyformfillInputDate = {
      year: year,
      month: month,
      day: day
    };
    inputDateNativeValueSetter.call(input, inputDateValueFormatter(input, year, month, day));
  }
  function inputDateGetDateComponents(input) {
    if (input.__polyformfillInputDate === undefined) {
      inputDateInitInternalValue(input);
    }
    return input.__polyformfillInputDate;
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
    return "-";
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
      input.__polyformfillInputDate = {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth(),
        day: date.getUTCDate()
      };
    } else {
      input.__polyformfillInputDate = {
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
    var dateComponents = inputDateGetDateComponents(input), date = null;
    if (dateComponents.year !== INPUT_DATE_YEAR_EMPTY && dateComponents.month !== INPUT_DATE_MONTH_EMPTY && dateComponents.day !== INPUT_DATE_DAY_EMPTY) {
      date = new Date(0);
      date.setUTCFullYear(dateComponents.year, dateComponents.month, dateComponents.day);
    }
    return date;
  }
  function initAccessibility() {
    window.addEventListener("keydown", onKeydownHandleNavigation);
    window.addEventListener("keypress", onKeyPressHandleUserInput);
    window.addEventListener("focus", onFocusHandleInputSelection, true);
    window.addEventListener("focusin", onFocusHandleInputSelection);
    window.addEventListener("click", onFocusHandleInputSelection);
    window.addEventListener("blur", onBlurNormalizeInputSelection, true);
  }
  function onKeydownHandleNavigation(evt) {
    var el, selectionStart, selectionEnd;
    if (evt.charCode) {
      return;
    }
    if (evt.defaultPrevented) {}
    el = evt.target;
    if (el instanceof HTMLInputElement && el.getAttribute(INPUT_ATTR_TYPE) === "date") {
      selectionStart = el.selectionStart;
      selectionEnd = el.selectionEnd;
      switch (evt.key) {
       case "Backspace":
       case "U+0008":
       case "Del":
        inputDateClearDateComponent(el, selectionStart, selectionEnd);
        break;

       case "Tab":
       case "U+0009":
        inputDateNormalizeSelectedComponent(el, selectionStart, selectionEnd);
        if (evt.altKey || evt.ctrlKey || evt.metaKey) {
          return;
        }
        if (evt.shiftKey) {
          if (getSelectedDateComponentNumber(inputDateNativeValueGetter.call(el), selectionStart, selectionEnd, inputDateFormatSeparatorGetter(el)) !== 0) {
            inputDateSelectPreviousDateComponent(el, selectionStart, selectionEnd);
          } else {
            return;
          }
        } else {
          if (getSelectedDateComponentNumber(inputDateNativeValueGetter.call(el), selectionStart, selectionEnd, inputDateFormatSeparatorGetter(el)) !== 2) {
            inputDateSelectNextDateComponent(el, selectionStart, selectionEnd);
          } else {
            return;
          }
        }
        break;

       case "Left":
        inputDateNormalizeSelectedComponent(el, selectionStart, selectionEnd);
        inputDateSelectPreviousDateComponent(el, selectionStart, selectionEnd);
        break;

       case "Up":
        inputDateIncreaseDateComponent(el, selectionStart, selectionEnd, 1);
        break;

       case "Right":
        inputDateNormalizeSelectedComponent(el, selectionStart, selectionEnd);
        inputDateSelectNextDateComponent(el, selectionStart, selectionEnd);
        break;

       case "Down":
        inputDateIncreaseDateComponent(el, selectionStart, selectionEnd, -1);
        break;

       default:
        return;
      }
      evt.preventDefault();
    }
  }
  function onKeyPressHandleUserInput(evt) {
    var el;
    if (evt.altKey || evt.ctrlKey || evt.shiftKey || evt.metaKey || !evt.charCode) {
      return;
    }
    if (evt.defaultPrevented) {
      return;
    }
    el = evt.target;
    if (el instanceof HTMLInputElement && el.getAttribute(INPUT_ATTR_TYPE) === "date") {
      if (evt.charCode > 47 && evt.charCode < 58) {
        var selectionStart = el.selectionStart;
        var selectNext = false;
        var value = inputDateNativeValueGetter.call(el), dateComponents = inputDateGetDateComponents(el), dateComponentsOrder = inputDateFormatOrderGetter(el), dateComponentSeparator = inputDateFormatSeparatorGetter(el), dateComponent = getSelectedDateComponent(value, selectionStart, el.selectionEnd, dateComponentsOrder, dateComponentSeparator);
        switch (dateComponent) {
         case DATECOMPONENT_YEAR:
          dateComponents.year = parseInt((dateComponents.year + evt.key).substr(-6), 10);
          break;

         case DATECOMPONENT_MONTH:
          if (dateComponents.month > 0) {
            dateComponents.month = parseInt(evt.key, 10) - 1;
          } else {
            dateComponents.month = parseInt(dateComponents.month + 1 + evt.key, 10) - 1;
          }
          if (dateComponents.month > INPUT_DATE_MONTH_MAX) {
            dateComponents.month = INPUT_DATE_MONTH_MAX;
          }
          if (dateComponents.month > 0) {
            selectNext = true;
          }
          break;

         case DATECOMPONENT_DAY:
          if (dateComponents.day > 3) {
            dateComponents.day = parseInt(evt.key, 10);
          } else {
            dateComponents.day = parseInt(dateComponents.day + evt.key, 10);
          }
          if (dateComponents.day > INPUT_DATE_DAY_MAX) {
            dateComponents.day = INPUT_DATE_DAY_MAX;
          }
          if (dateComponents.day > 3) {
            selectNext = true;
          }
          break;

         default:
          return;
        }
        inputDateSetDateComponents(el, dateComponents.year, dateComponents.month, dateComponents.day);
        value = inputDateNativeValueGetter.call(el);
        if (selectNext) {
          var selection = getDateComponentRange(value, selectionStart, dateComponentSeparator);
          inputDateSelectNextDateComponent(el, selection[0], selection[1]);
        } else {
          el.setSelectionRange.apply(el, getDateComponentRange(value, selectionStart, dateComponentSeparator));
        }
      }
      evt.preventDefault();
    }
  }
  function onFocusHandleInputSelection(evt) {
    var dateComponentRange, el, value, selectionStart, dateComponentSeparator;
    if (evt.defaultPrevented) {
      return;
    }
    el = evt.target;
    if (el instanceof HTMLInputElement && el.getAttribute(INPUT_ATTR_TYPE) === "date") {
      value = inputDateNativeValueGetter.call(el);
      dateComponentSeparator = inputDateFormatSeparatorGetter(el);
      if (!value) {
        inputDateSetDateComponents(el, INPUT_DATE_YEAR_EMPTY, INPUT_DATE_MONTH_EMPTY, INPUT_DATE_DAY_EMPTY);
        value = inputDateNativeValueGetter.call(el);
        selectionStart = 0;
      } else {
        selectionStart = el.selectionStart;
      }
      dateComponentRange = getDateComponentRange(value, selectionStart, dateComponentSeparator);
      el.setSelectionRange.apply(el, dateComponentRange);
      evt.preventDefault();
    }
  }
  function onBlurNormalizeInputSelection(evt) {
    var el = evt.target;
    if (el instanceof HTMLInputElement && el.getAttribute(INPUT_ATTR_TYPE) === "date") {
      inputDateNormalizeSelectedComponent(el, el.selectionStart, el.selectionEnd);
    }
  }
  function getDateComponentRange(value, position, dateComponentSeparator) {
    var start, end;
    start = value.substring(0, position).lastIndexOf(dateComponentSeparator);
    start = start < 1 ? 0 : start + 1;
    end = value.indexOf(dateComponentSeparator, position);
    if (end < 1) {
      end = value.length;
    }
    return [ start, end ];
  }
  function getSelectedDateComponentNumber(value, selectionStart, selectionEnd, dateComponentSeparator) {
    selectionEnd = selectionEnd || selectionStart;
    if (selectionStart !== 0) {
      if (value.substring(selectionEnd).indexOf(dateComponentSeparator) === -1) {
        return 2;
      } else {
        return 1;
      }
    }
    return 0;
  }
  function getSelectedDateComponent(value, selectionStart, selectionEnd, dateComponentsOrder, dateComponentSeparator) {
    return dateComponentsOrder[getSelectedDateComponentNumber(value, selectionStart, selectionEnd, dateComponentSeparator)];
  }
  function inputDateClearDateComponent(input, selectionStart, selectionEnd) {
    var value = inputDateNativeValueGetter.call(input), dateComponents = inputDateGetDateComponents(input), dateComponentsOrder = inputDateFormatOrderGetter(input), dateComponentSeparator = inputDateFormatSeparatorGetter(input), dateComponent = getSelectedDateComponent(value, selectionStart, selectionEnd, dateComponentsOrder, dateComponentSeparator);
    switch (dateComponent) {
     case DATECOMPONENT_YEAR:
      dateComponents.year = INPUT_DATE_YEAR_EMPTY;
      break;

     case DATECOMPONENT_MONTH:
      dateComponents.month = INPUT_DATE_MONTH_EMPTY;
      break;

     case DATECOMPONENT_DAY:
      dateComponents.day = INPUT_DATE_DAY_EMPTY;
      break;

     default:
      return;
    }
    inputDateSetDateComponents(input, dateComponents.year, dateComponents.month, dateComponents.day);
    value = inputDateNativeValueGetter.call(input);
    input.setSelectionRange.apply(input, getDateComponentRange(value, selectionStart, dateComponentSeparator));
  }
  function inputDateNormalizeSelectedComponent(input, selectionStart, selectionEnd) {
    var value = inputDateNativeValueGetter.call(input), dateComponents = inputDateGetDateComponents(input), dateComponentsOrder = inputDateFormatOrderGetter(input), dateComponentSeparator = inputDateFormatSeparatorGetter(input), dateComponent = getSelectedDateComponent(value, selectionStart, selectionEnd, dateComponentsOrder, dateComponentSeparator);
    switch (dateComponent) {
     case DATECOMPONENT_YEAR:
      if (dateComponents.year > INPUT_DATE_YEAR_MAX) {
        dateComponents.year = INPUT_DATE_YEAR_MAX;
        inputDateSetDateComponents(input, dateComponents.year, dateComponents.month, dateComponents.day);
      }
      break;

     case DATECOMPONENT_MONTH:
      if (dateComponents.month > INPUT_DATE_MONTH_MAX) {
        dateComponents.month = INPUT_DATE_MONTH_MAX;
        inputDateSetDateComponents(input, dateComponents.year, dateComponents.month, dateComponents.day);
      }
      break;

     case DATECOMPONENT_DAY:
      if (dateComponents.day > INPUT_DATE_DAY_MAX) {
        dateComponents.day = INPUT_DATE_DAY_MAX;
        inputDateSetDateComponents(input, dateComponents.year, dateComponents.month, dateComponents.day);
      }
      break;

     default:
      return;
    }
  }
  function inputDateSelectPreviousDateComponent(input, selectionStart, selectionEnd) {
    var value = inputDateNativeValueGetter.call(input), dateComponentSeparator = inputDateFormatSeparatorGetter(input);
    if (selectionStart !== 0) {
      selectionStart = value.substring(0, selectionStart - 2).lastIndexOf(dateComponentSeparator);
      selectionStart = selectionStart < 1 ? 0 : selectionStart + 1;
      selectionEnd = input.selectionStart - 1;
      input.setSelectionRange(selectionStart, selectionEnd);
    }
  }
  function inputDateSelectNextDateComponent(input, selectionStart, selectionEnd) {
    var value = inputDateNativeValueGetter.call(input), dateComponentSeparator = inputDateFormatSeparatorGetter(input);
    if (selectionEnd === 0) {
      selectionEnd = value.indexOf(dateComponentSeparator);
    }
    if (selectionEnd !== value.length) {
      selectionStart = selectionEnd + 1;
      selectionEnd = value.indexOf(dateComponentSeparator, selectionStart);
      if (selectionEnd < 1) {
        selectionEnd = value.length;
      }
      input.setSelectionRange(selectionStart, selectionEnd);
    }
  }
  function inputDateIncreaseDateComponent(input, selectionStart, selectionEnd, amount) {
    var value = inputDateNativeValueGetter.call(input), dateComponents = inputDateGetDateComponents(input), dateComponentsOrder = inputDateFormatOrderGetter(input), dateComponentSeparator = inputDateFormatSeparatorGetter(input), dateComponent = getSelectedDateComponent(value, selectionStart, selectionEnd, dateComponentsOrder, dateComponentSeparator);
    switch (dateComponent) {
     case DATECOMPONENT_YEAR:
      dateComponents.year = dateComponents.year + amount;
      if (dateComponents.year > INPUT_DATE_YEAR_MAX) {
        dateComponents.year = INPUT_DATE_YEAR_MIN;
      } else {
        if (dateComponents.year < INPUT_DATE_YEAR_MIN) {
          dateComponents.year = INPUT_DATE_YEAR_MAX;
        }
      }
      break;

     case DATECOMPONENT_MONTH:
      dateComponents.month = dateComponents.month + amount;
      if (dateComponents.month > INPUT_DATE_MONTH_MAX) {
        dateComponents.month = INPUT_DATE_MONTH_MIN;
      } else {
        if (dateComponents.month < INPUT_DATE_MONTH_MIN) {
          dateComponents.month = INPUT_DATE_MONTH_MAX;
        }
      }
      break;

     case DATECOMPONENT_DAY:
      dateComponents.day = dateComponents.day + amount;
      if (dateComponents.day > INPUT_DATE_DAY_MAX) {
        dateComponents.day = INPUT_DATE_DAY_MIN;
      } else {
        if (dateComponents.day < INPUT_DATE_DAY_MIN) {
          dateComponents.day = INPUT_DATE_DAY_MAX;
        }
      }
      break;

     default:
      return;
    }
    inputDateSetDateComponents(input, dateComponents.year, dateComponents.month, dateComponents.day);
    value = inputDateNativeValueGetter.call(input);
    input.setSelectionRange.apply(input, getDateComponentRange(value, selectionStart, dateComponentSeparator));
  }
  var nativeTypeDescriptor, nativeValueDescriptor, nativeStepUp, nativeStepDown;
  var INPUT_DATE_STEP_SCALE_FACTOR = 864e5;
  function initDom() {
    if (HTMLInputElement && Object.isExtensible(HTMLInputElement)) {
      Object.defineProperty(HTMLInputElement.prototype, "valueAsDate", {
        get: getValueAsDate,
        set: setValueAsDate
      });
      Object.defineProperty(HTMLInputElement.prototype, "valueAsNumber", {
        get: getValueAsNumber,
        set: setValueAsNumber
      });
      nativeTypeDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, INPUT_ATTR_TYPE);
      if (nativeTypeDescriptor === undefined) {
        nativeTypeDescriptor = Object.getOwnPropertyDescriptor(testInput, INPUT_ATTR_TYPE);
      }
      if (nativeTypeDescriptor.configurable) {
        Object.defineProperty(HTMLInputElement.prototype, INPUT_ATTR_TYPE, {
          get: getType
        });
      }
      nativeValueDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
      if (nativeValueDescriptor.configurable) {
        Object.defineProperty(HTMLInputElement.prototype, "value", {
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
    if (this.getAttribute(INPUT_ATTR_TYPE) === "date") {
      return inputDateGetDate(this);
    }
    return null;
  }
  function setValueAsDate(value) {
    if (this.getAttribute(INPUT_ATTR_TYPE) === "date" && value instanceof Date) {
      inputDateSetDateComponents(this, value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());
    }
  }
  function getValueAsNumber() {
    var date;
    if (this.getAttribute(INPUT_ATTR_TYPE) === "date") {
      date = inputDateGetDate(this);
      if (date) {
        return date.getTime();
      }
    }
    return NaN;
  }
  function setValueAsNumber(value) {
    var date;
    if (this.getAttribute(INPUT_ATTR_TYPE) === "date") {
      date = new Date(0);
      date.setTime(value);
      if (date) {
        inputDateSetDateComponents(this, date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
      } else {
        inputDateSetDateComponents(this, INPUT_DATE_YEAR_EMPTY, INPUT_DATE_MONTH_EMPTY, INPUT_DATE_DAY_EMPTY);
      }
      return value;
    }
  }
  function getType() {
    var attr, type = nativeTypeDescriptor.get.call(this);
    if (type === "text") {
      attr = this.getAttribute(INPUT_ATTR_TYPE);
      if (attr === "date") {
        return attr;
      }
    }
    return type;
  }
  function getValue() {
    if (this.getAttribute(INPUT_ATTR_TYPE) === "date") {
      return inputDateGetRfc3339(this);
    } else {
      return nativeValueDescriptor.get.call(this);
    }
  }
  function setValue(value) {
    var date;
    if (this.getAttribute(INPUT_ATTR_TYPE) === "date") {
      if (value !== "") {
        date = getDateFromRfc3339FullDateString(value);
      }
      if (date) {
        inputDateSetDateComponents(this, date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
      } else {
        inputDateSetDateComponents(this, INPUT_DATE_YEAR_EMPTY, INPUT_DATE_MONTH_EMPTY, INPUT_DATE_DAY_EMPTY);
      }
    } else {
      return nativeValueDescriptor.set.call(this, value);
    }
    return value;
  }
  function stepUp(n) {
    var allowedValueStep, delta, value;
    if (this.getAttribute(INPUT_ATTR_TYPE) === "date") {
      n = n || 1;
      allowedValueStep = getAllowedValueStep(this, 1, INPUT_DATE_STEP_SCALE_FACTOR);
      if (allowedValueStep === null) {
        throw new InvalidStateError();
      }
      value = this.valueAsNumber;
      delta = allowedValueStep * n;
      value += delta;
      this.valueAsNumber = value;
    }
  }
  function stepDown(n) {
    n = n || 1;
    stepUp.call(this, -n);
  }
  function getAllowedValueStep(el, defaultStep, stepScaleFactor) {
    defaultStep = defaultStep || 1;
    var step;
    if (el.hasAttribute("step")) {
      step = el.getAttribute("step");
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
  function initLocalization() {
    inputDateValueFormatter = inputDateLocalizedValueFormatter;
    inputDateFormatOrderGetter = inputDatLocalizedFormatOrder;
    inputDateFormatSeparatorGetter = inputDateLocalizedFormatSeparator;
  }
  function inputDateLocalizedValueFormatter(input, year, month, day) {
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
  function inputDatLocalizedFormatOrder(input) {
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
  function inputDateLocalizedFormatSeparator(input) {
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
    return separator;
  }
  function initNormalization() {
    window.addEventListener("submit", onSubmitNormalizeDateInput);
    window.addEventListener("load", onLoadFormatInputDateElements);
  }
  function onLoadFormatInputDateElements(evt) {
    var elements = evt.target.getElementsByTagName("INPUT"), dateComponents;
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].getAttribute(INPUT_ATTR_TYPE) === "date") {
        dateComponents = inputDateGetDateComponents(elements[i]);
        inputDateSetDateComponents(elements[i], dateComponents.year, dateComponents.month, dateComponents.day);
      }
    }
  }
  function onSubmitNormalizeDateInput(evt) {
    var elements = evt.target.elements;
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].getAttribute(INPUT_ATTR_TYPE) === "date") {
        inputDateNativeValueSetter.call(elements[i], inputDateGetRfc3339(elements[i]));
      }
    }
    evt.preventDefault();
    return false;
  }
})(window, document);