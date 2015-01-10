"use strict";

/* global describe, expect, it */

describe("The DOM interface of input[type=time] elements", function () {

  describe("has a type property, which", function () {

    it("should return 'time' for input elements with type=time", function () {
      var input;

      input = document.createElement("input");
      input.setAttribute("type", "time");

      expect(input.type).toBe("time");
    });

  });

  describe("has a value property, which", function () {

    it("should accept an empty string to clear the value", function () {
      var input, initialValue = "12:34:56.789";

      input = document.createElement("input");
      input.setAttribute("type", "time");
      input.setAttribute("value", initialValue);

      expect(input.value).toBe(initialValue);

      input.value = "";
      expect(input.value).toBe("");
    });

    it("should accept assignments with a valid partial time as defined in RFC 3339", function () {
      var input;

      input = document.createElement("input");
      input.setAttribute("type", "time");

      input.value = "00:00:00.001";
      expect(input.value).toBe("00:00:00.001");

      input.value = "01:00:00.001";
      expect(input.value).toBe("01:00:00.001");

      input.value = "12:12:12.120";
      expect(input.value).toBe("12:12:12.120");

      // Can"t test 10:10:10.1 easily, since chrome will return the same value if set through .value, but padded with
      // zeros when set through user input. This polyfill always returns with padding of zeros.
      input.value = "10:10:10.100";
      expect(input.value).toBe("10:10:10.100");

      input.value = "12:12:12";
      expect(input.value).toBe("12:12:12");

      input.value = "23:12:12";
      expect(input.value).toBe("23:12:12");

      //input.value = "23:59:59.1001";
      //expect(input.value).toBe("23:59:59.100");

    });

    it("should not accept assignments with an invalid time", function () {
      var input;

      input = document.createElement("input");
      input.setAttribute("type", "time");

      input.value = "not a time string";
      expect(input.value).toBe("");

      input.value = 0;
      expect(input.value).toBe("");

      input.value = "1";
      expect(input.value).toBe("");

      input.value = "1:1";
      expect(input.value).toBe("");

      input.value = "1:01";
      expect(input.value).toBe("");

      input.value = "24:01";
      expect(input.value).toBe("");

      input.value = "23:60";
      expect(input.value).toBe("");

      input.value = "23:59:60";
      expect(input.value).toBe("");
    });

  });

  describe("has a valueAsDate property, which", function () {

    it("should return a Date object for input elements with a valid value", function () {
      var input;

      input = document.createElement("input");
      input.setAttribute("type", "time");

      input.value = "01:01:01.01";
      expect(input.valueAsDate instanceof Date).toBeTruthy();
    });

    it("should return null for input elements with an invalid value", function () {
      var input;

      input = document.createElement("input");
      input.setAttribute("type", "time");

      input.value = "24:01:01.01";
      expect(input.valueAsDate).toBe(null);
    });

  });

  describe("has a valueAsNumber property, which", function () {

    it("should return an integer for input elements with a valid value", function () {
      var input;

      input = document.createElement("input");
      input.setAttribute("type", "time");

      input.setAttribute("value", "00:00");
      expect(input.valueAsNumber).toBe(0);

      input.value = "01:01";
      expect(input.valueAsNumber).toBe(3660000);

      input.value = "03:25:45.678";
      expect(input.valueAsNumber).toBe(12345678);

      input.value = "23:59:59.999";
      expect(input.valueAsNumber).toBe(86399999);
    });

    it("should return NaN for input elements with an invalid value", function () {
      var input;

      input = document.createElement("input");
      input.setAttribute("type", "time");

      input.value = "not a time string";
      expect(input.valueAsNumber).toBeNaN();

      input.value = 0;
      expect(input.valueAsNumber).toBeNaN();

      input.value = "1";
      expect(input.valueAsNumber).toBeNaN();

      input.value = "1:1";
      expect(input.valueAsNumber).toBeNaN();

      input.value = "1:01";
      expect(input.valueAsNumber).toBeNaN();

      input.value = "24:01";
      expect(input.valueAsNumber).toBeNaN();

      input.value = "23:60";
      expect(input.valueAsNumber).toBeNaN();

      input.value = "23:59:60";
      expect(input.valueAsNumber).toBeNaN();
    });
  });

  describe("has a stepUp() method, which", function () {

    it("for elements without step, min and max attributes should increase the value by minutes", function () {
      var input;

      input = document.createElement("input");
      input.setAttribute("type", "time");
      input.setAttribute("value", "00:00:00.001");

      input.stepUp();
      expect(input.value).toBe("00:01:00.001");

      input.stepUp(8);
      expect(input.value).toBe("00:09:00.001");

      input.stepUp(51);
      expect(input.value).toBe("01:00:00.001");
    });

  });

  describe("has a stepDown() method, which", function () {

    it("for elements without step, min and max attributes should decrease the value by minutes", function () {
      var input;

      input = document.createElement("input");
      input.setAttribute("type", "time");
      input.setAttribute("value", "01:00:00.001");

      input.stepDown();
      expect(input.value).toBe("00:59:00.001");

      input.stepDown(8);
      expect(input.value).toBe("00:51:00.001");

      input.stepDown(51);
      expect(input.value).toBe("00:00:00.001");
    });

  });

});
