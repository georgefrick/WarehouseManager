/**
 * George Frick  (george.frick@gmail.com)
 * @brewcitycoder
 * A backbone test module to illustrate some closure problems when using Backbone or any framework.
 * There are comments at the end of both tests.
 * This test module is written to expect 2 tests to fail; as it isn't a 'production' test module.
 * The view is copied and pasted; because each test is meant to be read like an article; so I don't want the
 * reader to have to jump around.
 * May be freely distributed under the MIT license.
 */
define([  'backbone', 'underscore' ], function () {

    "use strict";

    var testSuite = function () {

        module("Memory.Leak", {
            setup: function () { },
            teardown: function () {
                window.errors = null;
            }
        });

        test("TestLeak", function () {
            // 0. We'll need the fixture, and a button that doesn't go away.
            var button = "<input type='button' name='b1' id='b1'>b1</input>";
            var fixture =  $("#qunit-fixture");

            // 1. Make something that will get passed into view, but stick around.
            var globalEventHub = _.extend({}, Backbone.Events);
            var TEST_EVENT = "changeval"; // ARGS: new val.

            // 2. Separate the view into static and view bound.
            //    The test-container will be rendered to by the view.
            //    But intentionally let the view see something outside itself.
            fixture.append("<div id='test-container'></div>"+button);
            fixture = $("#test-container");

            // 3. Make a view. No model for simplicity.
            var testView1 = Backbone.View.extend({
                el: '#qunit-fixture',
                events: {
                    "click #b1" : 'onClick'
                },
                initialize: function (options) {
                    this.value = options.value;
                    this.options.eventHub.bind(TEST_EVENT, this.changeVal, this);
                    _.bindAll(this,"changeVal");
                    _.bindAll(this,"onClick");
                },
                changeVal: function(val) {
                    this.value = val;
                    this.render();
                },
                getValue: function () {
                    return this.value;
                },
                onClick: function(evt) {
                    this.options.eventHub.trigger(TEST_EVENT,99);
                    return false;
                },
                render: function () {
                    $("#test-container").html("<h1>" + this.getValue() + "</h1>");
                    return this;
                }
            });

            // 4. Create an instance.
            var view1 =  new testView1({
                eventHub: globalEventHub,
                value: 1
            });

            // 5. Append to dom (this view is self appending)
            ok(view1);
            fixture.empty();
            ok(view1.render());

            // 6. Make sure it looks right.
            strictEqual(fixture.html(), "<h1>1</h1>");

            // 7. Send an event.
            globalEventHub.trigger(TEST_EVENT, 5);

            // 8. Make sure it looks right.
            strictEqual(fixture.html(), "<h1>5</h1>");

            // 9. Undefine the var.
            view1 = undefined;

            // 10. Empty the dom.
            fixture.empty();
            strictEqual(fixture.html(), "");

            // 11. The view is gone. But send an event anyway.
            globalEventHub.trigger(TEST_EVENT, 9);
            notStrictEqual(fixture.html(), ""); // *********** FAIL ***********

            // 12. Even better, drop the event hub.
            globalEventHub = undefined;
            fixture.empty();
            strictEqual(fixture.html(), "");
            $("#b1").click();
            notStrictEqual(fixture.html(), ""); // *********** FAIL ***********

            /**
             * Had to break a lot of rules to get here:
             * 1. Self Appending. The view places itself in the dom.
             * -- This shows "attachment" loss. No access to object, but it can affect the DOM.
             * 2. Binding out of scope. We let the view bind to something outside itself.
             * -- This shows "binding" loss. No access to object, but it is attached to the DOM by an event listener.
             * 3. Shared Global Variable. We let the view contain an instance of a global variable.
             * -- This shows 'survival' loss. No access to object, but it is 'in closure' to a shared variable.
             *
             * However, these are all actions we may need to take at some point in building an application.
             * Objects have to be properly destroyed.
             *
             * See Test 2.
             */
        });

        test("TestLeak-Fix.2", function () {
            Backbone.View.prototype.close = function() {
                this.$el.empty();
                this.unbind();
                if( globalEventHub ) {
                    globalEventHub.off(null,null,this);
                }
            };

            // 0. We'll need the fixture, and a button that doesn't go away.
            var button = "<input type='button' name='b1' id='b1'>b1</input>";
            var fixture =  $("#qunit-fixture");

            // 1. Make something that will get passed into view, but stick around.
            var globalEventHub = _.extend({}, Backbone.Events);
            var TEST_EVENT = "changeval"; // ARGS: new val.

            // 2. Separate the view into static and view bound.
            //    The test-container will be rendered to by the view.
            //    But intentionally let the view see something outside itself.
            fixture.append("<div id='test-container'></div>"+button);
            fixture = $("#test-container");

            // 3. Make a view. No model for simplicity.
            var testView1 = Backbone.View.extend({
                el: '#qunit-fixture',
                events: {
                    "click #b1" : 'onClick'
                },
                initialize: function (options) {
                    this.value = options.value;
                    this.options.eventHub.bind(TEST_EVENT, this.changeVal, this);
                    _.bindAll(this,"changeVal");
                    _.bindAll(this,"onClick");
                },
                changeVal: function(val) {
                    this.value = val;
                    this.render();
                },
                getValue: function () {
                    return this.value;
                },
                onClick: function(evt) {
                    this.options.eventHub.trigger(TEST_EVENT,99);
                    return false;
                },
                render: function () {
                    $("#test-container").html("<h1>" + this.getValue() + "</h1>");
                    return this;
                }
            });

            // 4. Create an instance.
            var view1 =  new testView1({
                eventHub: globalEventHub,
                value: 1
            });

            // 5. Append to dom (this view is self appending)
            ok(view1);
            fixture.empty();
            ok(view1.render());

            // 6. Make sure it looks right.
            strictEqual(fixture.html(), "<h1>1</h1>");

            // 7. Send an event.
            globalEventHub.trigger(TEST_EVENT, 5);

            // 8. Make sure it looks right.
            strictEqual(fixture.html(), "<h1>5</h1>");

            // 9. Undefine the var, BUT CLOSE THE VIEW FIRST.
            //    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            view1.close();
            view1 = undefined;

            // 10. Empty the dom.
            fixture.empty();
            strictEqual(fixture.html(), "");

            // 11. The view is gone. But send an event anyway.
            globalEventHub.trigger(TEST_EVENT, 9);
            strictEqual(fixture.html(), ""); // *********** PASS ***********

            // 12. Even better, drop the event hub.
            globalEventHub = undefined;
            fixture.empty();
            strictEqual(fixture.html(), "");
            $("#b1").click();
            strictEqual(fixture.html(), ""); // *********** PASS ***********

            /**
             * By closing our view and accounting for the three possibilities; our view is truly gone.
             */
        });

    };

    return {testSuite: testSuite}
});
