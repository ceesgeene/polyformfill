describe('HTMLInputInterface', function () {
  describe('input.type property', function () {
    it('should return "text" for input elements without specified type', function () {
      var input;

      input = document.createElement('input');

      expect(input.type).toBe('text');
    });

    it('should return "date" for input elements with type=date', function () {
      var input;

      input = document.createElement('input');
      input.setAttribute('type', 'date');

      expect(input.type).toBe('date');
    });
  });

  describe('input.value property', function () {
    it('should not accept assignments with an invalid date', function () {
      var input;

      input= document.createElement('input');
      input.setAttribute('type', 'date');
      input.value = '1';

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
