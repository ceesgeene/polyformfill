void function (window, document) {
  'use strict';

  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    init();
  }
  else {
    document.addEventListener('DOMContentLoaded', init);
  }

  function init() {
    var input = document.getElementsByTagName('INPUT');

    for (var i = 0; i < input.length; i++) {
      console.log(
        input[i].type,
        input[i].valueAsDate,
        input[i].value
      );

      //input[i].value = 12;
    }

    document.getElementById('my-date-1-button').addEventListener('click', function () {
      document.getElementById('my-date-1').focus();
    });
  }


}(window, document);
