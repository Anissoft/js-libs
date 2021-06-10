/**
 * CustomEvent() polyfill
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
 */
(function () {

  if (typeof window.CustomEvent === "function") return false;

  function CustomEvent(event: string, params?: CustomEventInit) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles || false, params.cancelable || false, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  (window as any).CustomEvent = CustomEvent;
})();