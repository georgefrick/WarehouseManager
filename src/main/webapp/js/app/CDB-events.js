/**
 * George Frick (george.frick@gmail.com)
 * @brewcitycoder
 * Event Module.
 * May be freely distributed under the MIT license.
 */
define([ 'handlebars', 'backbone'], function(){
    "use strict";

    var Events = {};

    // Give this instance a unique ID across windows.
    var thisWindowId = Math.guid();

    var globalEventHub = _.extend({}, Backbone.Events);
    Events.globalEvents = globalEventHub;

    var events = {
        SETTINGS_CHANGED: "changedSetting" /* Args: setting, value */
    };

    Events.events = events;

    /*
     * This is a system for sending events between tabs;
     * it has some extra code to make it work in IE8.
     * THE WINDOW THAT SENDS THE MESSAGE WILL NOT RECEIVE IT.
     * @SEE http://jsfiddle.net/rodneyrehm/bAhJL/
     * USAGE:
     *  Events.sendTabEvent(event); // Send an to other tabs.
     *  Where message is:
     *  var message = {
     *   event : "eventString", // such as Events.SETTINGS_CHANGED
     *   arg1 : stringArg1,
     *   arg2 : stringArg2
     *  };
     *  Also, you can't create a 'local' example of this. IE will only instantiate
     *  local storage on a real domain.
     *  You do not need html 5 doctype.
     */
    if (window.localStorage) {

        var _last_sent_key = null;
        Events.sendTabEvent = function (event) {
            var key = 'event-msg-' + (+new Date());

            event.windowId = thisWindowId;

            var serializedEvent = JSON.stringify(event);

            // event is not sent if the storage is not mutated!
            if (localStorage.getItem('rand') !== null) {
                localStorage.removeItem('rand');
            }

            // IE8 fix missing storageEvent.key
            if ("onstorage" in document) {
                localStorage.setItem('_last_storage_event_key', key);
            }

            _last_sent_key = key;
            localStorage.setItem(key, serializedEvent);
        };

        var receiveTabEvent = function (e) {
            var value = localStorage.getItem(e.originalEvent.key);
            if (value === null) {
                // ignore .removeStorage() events
                return;
            }

            var deserializedValue = JSON.parse(value);
            if( deserializedValue.event ) {
                // Avoid bug with iframes where they receive their own event, and so would pop
                // them from the queue before any other windows got to them. However, this still
                // only triggers once - the first window to see the event removes it.
                if( deserializedValue.windowId !== thisWindowId ) {
                    localStorage.removeItem(e.originalEvent.key);
                    Events.globalEvents.trigger( deserializedValue.event, deserializedValue.arg1, deserializedValue.arg2);
                }
            }
        };

        $(window).on('storage', receiveTabEvent);

        // IE8 fix missing storageEvent.key
        if ('onstorage' in document) {
            $(document).on('storage', function (e) {
                var key = localStorage.getItem('_last_storage_event_key');
                if (key !== null && _last_sent_key !== key) {
                    e.originalEvent.key = key;
                    receiveTabEvent.call(this, e);
                }
            });
        }

    } else {
        Events.sendTabEvent = function (event) {
            // Do nothing (add logging or something here)
        }
    }

    return Events;
});
