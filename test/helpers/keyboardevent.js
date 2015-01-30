/**
 * https://gist.github.com/termi/4654819
 */
(function (window, document) {
  "use strict";

  var _initKeyboardEvent_type = (function (e) {
      try {
        e.initKeyboardEvent(
          "keyup", // in DOMString typeArg
          false, // in boolean canBubbleArg
          false, // in boolean cancelableArg
          window, // in views::AbstractView viewArg
          "+", // [test]in DOMString keyIdentifierArg | webkit event.keyIdentifier | IE9 event.key
          3, // [test]in unsigned long keyLocationArg | webkit event.keyIdentifier | IE9 event.location
          true, // [test]in boolean ctrlKeyArg | webkit event.shiftKey | old webkit event.ctrlKey | IE9 event.modifiersList
          false, // [test]shift | alt
          true, // [test]shift | alt
          false, // meta
          false // altGraphKey
        );

        return ("+" === (e["keyIdentifier"] || e["key"]) && 3 == (e["keyLocation"] || e["location"])) && (
            e.ctrlKey ?
              e.altKey ? // webkit
                1
                :
                3
              :
              e.shiftKey ?
                2 // webkit
                :
                4 // IE9
          ) || 9 // FireFox|w3c
          ;
      }
      catch (__e__) {
        _initKeyboardEvent_type = 0;
      }
    })(document.createEvent("KeyboardEvent")),

     _keyboardEvent_properties_dictionary = {
      char: "",
      key: "",
      location: 0,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: false,
      repeat: false,
      locale: "",

      detail: 0,
      bubbles: false,
      cancelable: false,

      //legacy properties
      keyCode: 0,
      charCode: 0,
      which: 0
    };

  function getNormalizedProperties(properties) {
    var propertyName, normalizedProperties = {};
    for (propertyName in _keyboardEvent_properties_dictionary) {
      if (_keyboardEvent_properties_dictionary.hasOwnProperty(propertyName)) {
        normalizedProperties[propertyName] = (properties.hasOwnProperty(propertyName) && properties || _keyboardEvent_properties_dictionary)[propertyName];
      }
    }
    return normalizedProperties;
  }

  function normalizeEventProperties(event, properties) {
    var propertyName;
    for (propertyName in _keyboardEvent_properties_dictionary) {
      if (_keyboardEvent_properties_dictionary.hasOwnProperty(propertyName)) {
        if (event[propertyName] != properties[propertyName]) {
          try {
            delete event[propertyName];
            Object.defineProperty(event, propertyName, { writable: true, value: properties[propertyName] });
          }
          catch (e) {
            //Some properties is read-only
          }
        }
      }
    }
  }

  function crossBrowser_initKeyboardEvent(type, dict) {
    var event;
    if (_initKeyboardEvent_type) {
      event = document.createEvent("KeyboardEvent");
    }
    else {
      event = document.createEvent("Event");
    }
    var localDict = getNormalizedProperties(dict);

    if (!localDict["keyCode"]) {
      localDict["keyCode"] = _key && _key.charCodeAt(0) || 0;
    }
    if (!localDict["charCode"]) {
      localDict["charCode"] = _char && _char.charCodeAt(0) || 0;
    }
    if (!localDict["which"]) {
      localDict["which"] = localDict["keyCode"];
    }

    var _ctrlKey = localDict["ctrlKey"],
      _shiftKey = localDict["shiftKey"],
      _altKey = localDict["altKey"],
      _metaKey = localDict["metaKey"],
      _altGraphKey = localDict["altGraphKey"],

       _modifiersListArg = 3 < _initKeyboardEvent_type ? (
      (_ctrlKey ? "Control" : "")
      + (_shiftKey ? " Shift" : "")
      + (_altKey ? " Alt" : "")
      + (_metaKey ? " Meta" : "")
      + (_altGraphKey ? " AltGraph" : "")
      ).trim() : null,

      _key = localDict["key"] + "",
      _char = localDict["char"] + "",
      _location = localDict["location"],
      _keyCode = localDict["keyCode"],
      _charCode = localDict["charCode"],

      _bubbles = localDict["bubbles"],
      _cancelable = localDict["cancelable"],

      _repeat = localDict["repeat"],
      _locale = localDict["locale"],
      _view = window;

    if ("initKeyEvent" in event) {//FF
      //https://developer.mozilla.org/en/DOM/event.initKeyEvent
      event.initKeyEvent(type, _bubbles, _cancelable, _view, _ctrlKey, _altKey, _shiftKey, _metaKey, _keyCode, _charCode);
    }
    else if (_initKeyboardEvent_type && "initKeyboardEvent" in event) {//https://developer.mozilla.org/en/DOM/KeyboardEvent#initKeyboardEvent()
      if (1 === _initKeyboardEvent_type) { // webkit
        //http://stackoverflow.com/a/8490774/1437207
        //https://bugs.webkit.org/show_bug.cgi?id=13368
        event.initKeyboardEvent(type, _bubbles, _cancelable, _view, _key, _location, _ctrlKey, _shiftKey, _altKey, _metaKey, _altGraphKey);
      }
      else if (2 === _initKeyboardEvent_type) { // old webkit
        //http://code.google.com/p/chromium/issues/detail?id=52408
        event.initKeyboardEvent(type, _bubbles, _cancelable, _view, _ctrlKey, _altKey, _shiftKey, _metaKey, _keyCode, _charCode);
      }
      else if (3 === _initKeyboardEvent_type) { // webkit
        event.initKeyboardEvent(type, _bubbles, _cancelable, _view, _key, _location, _ctrlKey, _altKey, _shiftKey, _metaKey, _altGraphKey);
      }
      else if (4 === _initKeyboardEvent_type) { // IE9
        //http://msdn.microsoft.com/en-us/library/ie/ff975297(v=vs.85).aspx
        event.initKeyboardEvent(type, _bubbles, _cancelable, _view, _key, _location, _modifiersListArg, _repeat, _locale);
      }
      else { // FireFox|w3c
        //http://www.w3.org/TR/DOM-Level-3-Events/#events-KeyboardEvent-initKeyboardEvent
        //https://developer.mozilla.org/en/DOM/KeyboardEvent#initKeyboardEvent()
        event.initKeyboardEvent(type, _bubbles, _cancelable, _view, _char, _key, _location, _modifiersListArg, _repeat, _locale);
      }
    }
    else {
      event.initEvent(type, _bubbles, _cancelable);
    }

    normalizeEventProperties(event, localDict);

    return event;
  }

  //export
  window.crossBrowser_initKeyboardEvent = crossBrowser_initKeyboardEvent;

}(window, document));
