(function (window, document) {
  "use strict";

  if ("interactive" === document.readyState || "complete" === document.readyState) {
    init();
  }
  else {
    document.addEventListener("DOMContentLoaded", init);
  }

  function init() {
    var input = document.getElementsByTagName("INPUT");

    for (var i = 0; i < input.length; i++) {
      console.log(
        input[i].type,
        input[i].valueAsDate,
        input[i].value
      );
    }

    document.getElementById("example-date-1-button").addEventListener("click", updateExampleDate1);

    document.getElementById("example-date-4").addEventListener("input", function() {
      document.getElementById("example-date-4-output").value = this.value;
    });
    document.getElementById("example-date-4-output").value = document.getElementById("example-date-4").value;


  }

  function updateExampleDate1() {
    var input = document.getElementById("example-date-1");

    input.focus();

    input.dispatchEvent(window.crossBrowser_initKeyboardEvent("keydown", { key: "Right", bubbles: true }));
    input.dispatchEvent(window.crossBrowser_initKeyboardEvent("keydown", { key: "Up", bubbles: true }));
  }


  /*window.addEventListener("blur", function(e) {
    console.log(e);
  });
  window.addEventListener("focus", function(e) {
    console.log(e);
  });
  window.addEventListener("focusin", function(e) {
    console.log(e);
  });
  window.addEventListener("keydown", function(e) {
    console.log(e);
  });
  window.addEventListener("keypress", function(e) {
    console.log(e);
  });*/

}(window, document));
