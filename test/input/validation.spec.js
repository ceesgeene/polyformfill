"use strict";

/* global describe, expect, it */

describe("The DOM interface (validation) of input elements", function () {

  describe("has a willValidate property, which", function () {

    it("should return true if the element will be validated", function () {
      var input;

      input = document.createElement("input");

      expect(input.willValidate).toBe(true);
    });

    it("should return false if the element will not be validated", function () {
      var input;

      input = document.createElement("input");
      input.disabled = true;

      expect(input.willValidate).toBe(false);
    });

  });

  describe("has a setCustomValidity() method, which", function () {

    it("sets a custom error, so that the element would fail to validate.", function () {
      var input;

      input = document.createElement("input");

      input.setCustomValidity("Custom error message.");

      expect(input.checkValidity()).toBe(false);
    });

    it("clears the custom error, if the argument is the empty string.", function () {
      var input;

      input = document.createElement("input");

      input.setCustomValidity("Custom error message.");

      expect(input.checkValidity()).toBe(false);

      input.setCustomValidity("");

      expect(input.checkValidity()).toBe(true);
    });

  });

  describe("has a validity property, which", function () {

    it("if an instance of ValidityState", function () {
      var input;

      input = document.createElement("input");

      expect(input.validity instanceof ValidityState).toBeTruthy();
    });

    it("returns the same object each time the element's validity attribute is retrieved.", function () {
      var input, object;

      input = document.createElement("input");

      object = input.validity;

      expect(input.validity).toBe(object);
    });

    describe("has a valueMissing property, which", function () {

      it("returns true if the element has no value but is a required field.", function () {
        var input;

        input = document.createElement("input");
        input.required = true;

        expect(input.validity.valueMissing).toBe(true);
      });

      it("returns false if the element has no value and is not a required field.", function () {
        var input;

        input = document.createElement("input");

        expect(input.validity.valueMissing).toBe(false);
      });

      it("returns false if the element is a required field and has a value.", function () {
        var input;

        input = document.createElement("input");
        input.required = true;
        input.value = "Some value";

        expect(input.validity.valueMissing).toBe(false);
      });

    });

    describe("has a typeMismatch property, which", function () {

      it("returns false if the element's value is in the correct syntax.", function () {
        var input;

        input = document.createElement("input");

        expect(input.validity.typeMismatch).toBe(false);
      });

    });

    describe("has a patternMismatch property, which", function () {

      // TODO implement polyfill in IE
      /*it("returns true if the element's value doesn't match the provided pattern.", function () {
        var input;

        input = document.createElement("input");
        input.pattern = "[0-9]{4}";
        input.value = "ABCD";

        expect(input.validity.patternMismatch).toBe(true);
      });*/

      it("returns false if the element's value does match the provided pattern.", function () {
        var input;

        input = document.createElement("input");
        input.pattern = "[0-9]{4}";
        input.value = "1234";

        expect(input.validity.patternMismatch).toBe(false);
      });

    });

    describe("has a tooLong property, which", function () {

      // TODO Unable to test
      /*it("returns true if the element's value is longer than the provided maximum length.", function () {
        var input;

        input = document.createElement("input");
        input.maxLength = 4;
        input.value = "ABCDE";

        expect(input.validity.tooLong).toBe(true);
      });*/

      it("returns false if the element's value is not longer than the provided maximum length.", function () {
        var input;

        input = document.createElement("input");
        input.setAttribute("maxlength", "4");
        input.value = "1234";

        expect(input.validity.tooLong).toBe(false);
      });

      it("returns false if the element has no maximum length constraint.", function () {
        var input;

        input = document.createElement("input");
        input.value = "1234";

        expect(input.validity.tooLong).toBe(false);
      });

    });

    /*describe("has a tooShort property, which", function () {

      it("returns true if the element's value, if it is not the empty string, is shorter than the provided minimum length.", function () {
        var input;

        input = document.createElement("input");
        input.minLength = 4;
        input.value = "ABC";

        expect(input.validity.tooShort).toBe(true);
      });

      it("returns false if the element's value is not shorter than the provided minimum length.", function () {
        var input;

        input = document.createElement("input");
        input.minLength = 4;
        input.value = "1234";

        expect(input.validity.tooShort).toBe(false);
      });

      it("returns false if the element's value is the empty string.", function () {
        var input;

        input = document.createElement("input");
        input.minLength = 4;
        input.value = "";

        expect(input.validity.tooShort).toBe(false);
      });

      it("returns false if the element has no minimum length constraint.", function () {
        var input;

        input = document.createElement("input");
        input.value = "1234";

        expect(input.validity.tooShort).toBe(false);
      });

    });*/

    describe("has a rangeUnderflow property, which", function () {

      it("returns false if the min attribute does not apply for element's type.", function () {
        var input;

        input = document.createElement("input");

        expect(input.validity.rangeUnderflow).toBe(false);
      });

    });

    describe("has a rangeOverflow property, which", function () {

      it("returns false if the max attribute does not apply for element's type.", function () {
        var input;

        input = document.createElement("input");

        expect(input.validity.rangeOverflow).toBe(false);
      });

    });

    describe("has a stepMismatch property, which", function () {

      it("returns false if the step attribute does not apply for element's type.", function () {
        var input;

        input = document.createElement("input");

        expect(input.validity.stepMismatch).toBe(false);
      });

    });

    /*describe("has a badInput property, which", function () {

      it("returns true if the user has provided input in the user interface that the user agent is unable to convert to a value.", function () {
        var input;

        input = document.createElement("input");

        expect(input.validity.badInput).toBe(true);
      });

    });*/

    describe("has a customError property, which", function () {

      it("returns true if the element has a custom error.", function () {
        var input;

        input = document.createElement("input");
        input.setCustomValidity("Custom error");

        expect(input.validity.customError).toBe(true);
      });

      it("returns false if the element has no custom error.", function () {
        var input;

        input = document.createElement("input");

        expect(input.validity.customError).toBe(false);
      });

      it("returns false if any previously set custom error for the element has been reset.", function () {
        var input;

        input = document.createElement("input");
        input.setCustomValidity("Custom error");

        input.setCustomValidity("");

        expect(input.validity.customError).toBe(false);
      });

    });

    describe("has a valid property, which", function () {

    });

  });

  describe("has a checkValidity() method, which", function () {

    it("returns true if the element's value has no validity problems.", function () {
      var input;

      input = document.createElement("input");

      expect(input.checkValidity()).toBe(true);
    });

    it("returns false if the element's value has validity problems.", function () {
      var input;

      input = document.createElement("input");
      input.setAttribute("required", "required");

      expect(input.checkValidity()).toBe(false);
    });

    /*it("fires an invalid event at the element if the element's value has validity problems.", function (done) {
      var input;

      input = document.createElement("input");
      input.setAttribute("required", "required");

      input.addEventListener('invalid', function(event) {
        expect(event.target).toEqual(input);
        done();
      });

      input.checkValidity();
    });*/

  });

  describe("has a validationMessage property, which", function () {

    it("returns the error message that would be shown to the user if the element was to be checked for validity.", function () {
      var input, errorMessageStr = "Custom error message.";

      input = document.createElement("input");

      input.setCustomValidity(errorMessageStr);

      expect(input.validationMessage).toBe(errorMessageStr);
    });

    it("returns the empty string if the element's value has no validity problems.", function () {
      var input;

      input = document.createElement("input");

      expect(input.validationMessage).toBe("");
    });

  });

});
