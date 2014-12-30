'use strict';

/* global describe, expect, it */

describe('The DOM interface of input[type=time] elements', function () {

  describe('has a type property, which', function () {

    it('should return "time" for input elements with type=time', function () {
      var input;

      input = document.createElement('input');
      input.setAttribute('type', 'time');

      expect(input.type).toBe('time');
    });

  });

});
