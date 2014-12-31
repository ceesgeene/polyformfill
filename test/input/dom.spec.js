'use strict';

/* global describe, expect, it */

describe('The DOM interface of input elements', function () {

  describe('has a type property, which', function () {

    it('should return the type of the input', function () {
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

    it('should return "time" for input elements with type=time', function () {
      var input;

      input = document.createElement('input');
      input.setAttribute('type', 'time');

      expect(input.type).toBe('time');
    });

    it('should return "text" if the type is unknown', function () {
      var input;

      input = document.createElement('input');
      input.setAttribute('type', 'fake-type');

      expect(input.type).toBe('text');
    });
  });

  describe('has a valueAsDate property, which', function () {

    it('should return null for input elements not of type date or time', function () {
      var input;

      input = document.createElement('input');

      expect(input.valueAsDate).toBe(null);
    });

  });

  describe('has a valueAsNumber property, which', function () {

    it('should return NaN for input elements not of type date or time', function () {
      var input;

      input = document.createElement('input');

      expect(input.valueAsNumber).toBeNaN();
    });

  });

});
