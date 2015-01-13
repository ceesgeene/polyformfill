"use strict";

/* global describe, expect, it */

describe("The DOM interface of input elements", function () {

  describe("has a type property, which", function () {

    it("should return the type of the input", function () {
      var input;

      input = document.createElement("input");

      expect(input.type).toBe("text");

      input.setAttribute("type", "text");

      expect(input.type).toBe("text");

      input.setAttribute("type", "checkbox");

      expect(input.type).toBe("checkbox");
    });

    it("should return 'date' for input elements with type=date", function () {
      var input;

      input = document.createElement("input");
      input.setAttribute("type", "date");

      expect(input.type).toBe("date");
    });

    it("should return 'time' for input elements with type=time", function () {
      var input;

      input = document.createElement("input");
      input.setAttribute("type", "time");

      expect(input.type).toBe("time");
    });

    it("should return 'text' if the type is unknown", function () {
      var input;

      input = document.createElement("input");
      input.setAttribute("type", "fake-type");

      expect(input.type).toBe("text");
    });
  });

  describe("has a maxLength property, which", function () {

    it("contains the limit on the number of characters a user can input", function () {
      var input;

      input = document.createElement("input");
      input.setAttribute("maxlength", "5");

      expect(input.maxLength).toBe(5);
    });

    it("accepts positive integer values to limit the number of characters a user can input", function () {
      var input;

      input = document.createElement("input");

      input.maxLength = 5;

      expect(input.maxLength).toBe(5);
      expect(input.getAttribute("maxlength")).toBe("5");
    });

  });

  describe("has a readOnly property, which", function () {

    it("contains false if the input element has no readonly attribute", function () {
      var input;

      input = document.createElement("input");

      expect(input.readOnly).toBe(false);
    });

    it("contains true if the input element has a readonly attribute", function () {
      var input;

      input = document.createElement("input");
      input.setAttribute("readonly", "");

      expect(input.readOnly).toBe(true);
    });

    it("accepts truthy values to enable the readony mode for the input element", function () {
      var input;

      input = document.createElement("input");

      input.readOnly = "123";

      expect(input.readOnly).toBe(true);
      expect(input.getAttribute("readonly")).toBe("");
    });

    it("accepts falsy values to disable the readony mode for the input element", function () {
      var input;

      input = document.createElement("input");
      input.setAttribute("readonly", "readonly");

      expect(input.readOnly).toBe(true);

      input.readOnly = 0;

      expect(input.readOnly).toBe(false);
      expect(input.getAttribute("readonly")).toBeNull();
      expect(input.hasAttribute("readonly")).toBe(false);
    });

  });

  describe("has a required property, which", function () {

    it("should return true for required input elements", function () {
      var input;

      input = document.createElement("input");
      input.setAttribute("required", "");

      expect(input.required).toBe(true);
    });

    it("should return false for non-required input elements", function () {
      var input;

      input = document.createElement("input");

      expect(input.required).toBe(false);
    });

    it("accepts values that equal true, making non-required input elements required", function () {
      var input;

      input = document.createElement("input");

      expect(input.required).toBe(false);

      input.required = "value that equals true";

      expect(input.required).toBe(true);
      expect(input.getAttribute("required")).toBe("");
    });

    it("accepts values that equal false, making required input elements non-required", function () {
      var input;

      input = document.createElement("input");
      input.setAttribute("required", "required");

      expect(input.required).toBe(true);

      input.required = 0;

      expect(input.required).toBe(false);
      expect(input.getAttribute("required")).toBeNull();
      expect(input.hasAttribute("required")).toBe(false);
    });

  });

  describe("has a valueAsDate property, which", function () {

    it("should return null for input elements not of type date or time", function () {
      var input;

      input = document.createElement("input");

      expect(input.valueAsDate).toBe(null);
    });

  });

  describe("has a valueAsNumber property, which", function () {

    it("should return NaN for input elements not of type date or time", function () {
      var input;

      input = document.createElement("input");

      expect(input.valueAsNumber).toBeNaN();
    });

  });

});
