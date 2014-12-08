
if (!('valueAsDate' in document.createElement('input')) && HTMLInputElement && Object.isExtensible(HTMLInputElement)) {
  Object.defineProperty(HTMLInputElement.prototype, 'valueAsDate', {
    get: function getValueAsDate() {
      var type = this.getAttribute('type');
      if (type == 'date' && this.value) {
        return new Date(this.value);
      }
      return null;
    }
  });

  // FF and IE
  var nativeTypeDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'type');
  // Chrome
  if (nativeTypeDescriptor == undefined) {
    nativeTypeDescriptor = Object.getOwnPropertyDescriptor(testInput, 'type');
  }

  if (nativeTypeDescriptor.configurable) {
    Object.defineProperty(HTMLInputElement.prototype, 'type', {
      get: function getType() {
        var type = nativeTypeDescriptor.get.apply(this);
        if (type == 'text') {
          var attr = this.getAttribute('type');
          if (attr == 'date' || attr == 'time') {
            return attr;
          }
        }
        return type;
      }
    });
  }


  var nativeValueDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
  if (nativeValueDescriptor.configurable) {
    Object.defineProperty(HTMLInputElement.prototype, 'value', {
      get: function getValue() {
        var value = nativeValueDescriptor.get.call(this);
        var attr = this.getAttribute('type');
        if (attr == 'date' || attr == 'time') {
          //return 'todo';
        }
        return value;
      },
      set: function setValue(value) {
        var attr = this.getAttribute('type');
        if (attr == 'date') {
          if (!/^[0-9]{4,}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(value)) {
            console.warn("The specified value '" + value + "' does not conform to the required format, 'yyyy-MM-dd'.");
            return;
          }
        }
        else if (attr == 'time') {
          if (!/^([0-1][0-9]|2[0-3]):([0-5][0-9])(:([0-5][0-9]|60))?$/.test(value)) {
            console.warn("The specified value '" + value + "' does not conform to the required format, 'HH:MM:SS");
            return;
          }
        }

        return nativeValueDescriptor.set.call(this, value);
      }
    });
  }
}
