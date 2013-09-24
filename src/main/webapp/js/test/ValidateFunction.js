/**
 * George Frick (george.frick@gmail.com)
 * @brewcitycoder
 * May be freely distributed under the MIT license.
 */
define([  'backbone', 'underscore' ], function () {

    "use strict";
    var BackboneTestUtils = {};

    BackboneTestUtils.testSimpleValue = function (testObj) {

        var current = {
            // Defaults
            'model': null,
            'theField': "",
            'theValues': [],
            'theResult': undefined,
            'theFunction': strictEqual,
            'theDescription': 'Values should be strictly equal.'
        };

        var attr, val;
        var attrs = {};

        if (typeof testObj === 'object') {
            attrs = testObj;
        } else {
            throw "You must pass a value test object. ";
        }

        for (attr in attrs) {
            val = attrs[attr];
            if (current[attr] !== undefined && !_.isEqual(current[attr], val)) {
                current[attr] = val;
            }
        }

        var currVal, results;
        for (currVal in current.theValues) {
            current.model.set(current.theField, current.theValues[currVal]);
            results = current.model.validate();
            if (!results) {
                results = {};
            }
            if (current.theFunction.length === 3) {
                current.theFunction(results[current.theField], current.theResult,
                    current.theDescription + "-> " + current.theValues[currVal]);
            } else if (current.theFunction.length === 2) {
                current.theFunction(results[current.theField], current.theDescription
                    + "-> " + current.theValues[currVal]);
            } else {
                throw "Expecting qunit equality function, taking 2 or 3 arguments.";
            }
        }
    };

    return BackboneTestUtils;
});

