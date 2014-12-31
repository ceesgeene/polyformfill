'use strict';

/* global describe, expect, it */

describe('The DOM interface of input[type=date] elements', function () {

  describe('has a type property, which', function () {

    it('should return "date" for input elements with type=date', function () {
      var input;

      input = document.createElement('input');
      input.setAttribute('type', 'date');

      expect(input.type).toBe('date');
    });

  });

  describe('has a value property, which', function () {

    it('should accept an empty string to clear the value', function () {
      var input, initialValue = '1970-01-01';

      input = document.createElement('input');
      input.setAttribute('type', 'date');
      input.setAttribute('value', initialValue);

      expect(input.value).toBe(initialValue);

      input.value = '';
      expect(input.value).toBe('');
    });

    it('should return a valid full-date as defined in RFC 3339', function () {
      var input;

      input = document.createElement('input');
      input.setAttribute('type', 'date');

      input.value = '1970-01-01';
      expect(input.value).toBe('1970-01-01');

      input.value = '0001-01-01';
      expect(input.value).toBe('0001-01-01');

      input.value = '0101-01-01';
      expect(input.value).toBe('0101-01-01');

      input.value = '12345-01-01';
      expect(input.value).toBe('12345-01-01');

      input.value = '123456-01-01';
      expect(input.value).toBe('123456-01-01');

      // Max date.
      input.value = '275760-09-13';
      expect(input.value).toBe('275760-09-13');

      input.value = '';
      expect(input.value).toBe('');
    });

    it('should not accept assignments with an invalid date', function () {
      var input;

      input = document.createElement('input');
      input.setAttribute('type', 'date');

      input.value = '1 January 1970';
      expect(input.value).toBe('');

      input.value = 0;
      expect(input.value).toBe('');

      input.value = '1';
      expect(input.value).toBe('');

      input.value = '01-01-01';
      expect(input.value).toBe('');

      input.value = '101-01-01';
      expect(input.value).toBe('');

      input.value = '275760-09-14';
      expect(input.value).toBe('');

      input.value = '1970-02-31';
      expect(input.value).toBe('');
    });

  });

  describe('has a valueAsDate property, which', function () {

    it('should return a Date object for input elements with a valid value', function () {
      var input;

      input = document.createElement('input');
      input.setAttribute('type', 'date');

      input.value = '1970-01-01';
      expect(input.valueAsDate instanceof Date).toBeTruthy();
    });

    it('should return null for input elements with an invalid value', function () {
      var input;

      input = document.createElement('input');
      input.setAttribute('type', 'date');

      input.value = '1970-02-31';
      expect(input.valueAsDate).toBe(null);
    });

  });

  describe('has a valueAsNumber property, which', function () {

    it('should return an integer for input elements with a valid value', function () {
      var input;

      input = document.createElement('input');
      input.setAttribute('type', 'date');

      input.setAttribute('value', '1970-01-01');
      expect(input.valueAsNumber).toBe(0);

      input.value = '1970-01-01';
      expect(input.valueAsNumber).toBe(0);

      input.value = '0001-01-01';
      expect(input.valueAsNumber).toBe(-62135596800000);

      // Max date.
      input.value = '275760-09-13';
      expect(input.valueAsNumber).toBe(8640000000000000);
    });

    it('should return NaN for input elements with an invalid value', function () {
      var input;

      input = document.createElement('input');
      input.setAttribute('type', 'date');

      input.value = '1 January 1970';
      expect(input.valueAsNumber).toBeNaN();

      input.value = 0;
      expect(input.valueAsNumber).toBeNaN();

      input.value = '1';
      expect(input.valueAsNumber).toBeNaN();

      input.value = '01-01-01';
      expect(input.valueAsNumber).toBeNaN();

      input.value = '101-01-01';
      expect(input.valueAsNumber).toBeNaN();

      input.value = '275760-09-14';
      expect(input.valueAsNumber).toBeNaN();
    });

  });

  describe('has a stepUp() method, which', function () {

    it('for elements without step, min and max attributes should increase the value by one day', function () {
      var input;

      input = document.createElement('input');
      input.setAttribute('type', 'date');
      input.setAttribute('value', '1970-01-01');

      input.stepUp();
      expect(input.value).toBe('1970-01-02');

      input.stepUp(8);
      expect(input.value).toBe('1970-01-10');

      input.stepUp(22);
      expect(input.value).toBe('1970-02-01');
    });

  });

  describe('has a stepDown() method, which', function () {

    it('for elements without step, min and max attributes should decrease the value by one day', function () {
      var input;

      input = document.createElement('input');
      input.setAttribute('type', 'date');
      input.setAttribute('value', '1970-01-10');

      input.stepDown();
      expect(input.value).toBe('1970-01-09');

      input.stepDown(8);
      expect(input.value).toBe('1970-01-01');

      input.stepDown(20);
      expect(input.value).toBe('1969-12-12');
    });

  });

});
