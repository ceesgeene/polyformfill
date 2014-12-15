'use strict';

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

      // Max date FF can handle. Chrome can handle one day more.
      // Also see http://ecma-international.org/ecma-262/5.1/#sec-15.9.1.1
      input.value = '275760-09-12';
      expect(input.value).toBe('275760-09-12');
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

});
