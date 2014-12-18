'use strict';

/* global describe, expect, it */

describe('The DOM interface of input[type=date] elements', function () {

  describe('input.type property', function () {
    it('should not conflict with other input types', function () {
      var input;

      input = document.createElement('input');

      expect(input.type).toBe('text');

      input.setAttribute('type', 'text');

      expect(input.type).toBe('text');

      input.setAttribute('type', 'checkbox');

      expect(input.type).toBe('checkbox');
    });

    it('should return "date" for input elements with type=date', function () {
      var input;

      input = document.createElement('input');
      input.setAttribute('type', 'date');

      expect(input.type).toBe('date');
    });
  });

  describe('input.value property', function () {
    it('should return a valid full-date as defined in RFC 3339', function () {
      var input;

      input= document.createElement('input');
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
    });
    it('should not accept assignments with an invalid date', function () {
      var input;

      input= document.createElement('input');
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
    });
  });

  describe('input.valueAsDate property', function () {
    it('should return null for input elements not of type date or time', function () {
      var input;

      input = document.createElement('input');

      expect(input.valueAsDate).toBe(null);
    });

    it('should return a Date object for input elements with type=date and a valid date value', function () {
      var input;

      input = document.createElement('input');
      input.setAttribute('type', 'date');

      input.value = '1970-01-01';
      expect(input.valueAsDate instanceof Date).toBeTruthy();
    });
  });

  describe('input.valueAsNumber property', function () {

    it('should return an integer for input elements with type=date and a valid date value', function () {
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

    it('should return NaN for input elements with type=date and an invalid date value', function () {
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

});
