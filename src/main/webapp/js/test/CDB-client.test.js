/**
 * George Frick (george.frick@gmail.com)
 * @brewcitycoder
 * May be freely distributed under the MIT license.
 */
define([ 'app/CDB-client', 'backbone', 'underscore', 'backbone.validation' ], function (CDBClientManager) {
    "use strict";
    var testSuite = function () {
        module("CDB.clientTests");

        test("CDBClient.validation.invalid", function () {
            expect(5);
            var model = new CDBClientManager.Client();
            var view = new Backbone.View({model: model});
            Backbone.Validation.bind(view);

            var validation = model.validate();
            ok(validation, "Validation should be defined.");
            ok(validation.firstName, "Validation should have a firstName entry.");
            ok(validation.lastName, "Validation should have a lastName entry.");
            ok(validation.email, "Validation should have an email entry.");
            strictEqual(model.isValid(), false, "Model should not be valid.");

        });

        test("CDBClient.validation.valid", function () {
            expect(2);
            var model = new CDBClientManager.Client();
            var view = new Backbone.View({model: model});
            Backbone.Validation.bind(view);

            model.set({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@doe.org'
            });
            var validation = model.validate();
            ok(_.isUndefined(validation), "Validation should be undefined.");
            strictEqual(model.isValid(), true, "Model should be valid.");

        });

        test("CDBClient.validation.firstName", function () {
            expect(15);
            var model = new CDBClientManager.Client();
            var view = new Backbone.View({model: model});
            Backbone.Validation.bind(view);
            var validation = {};

            model.set({
                lastName: 'Doe',
                email: 'john.doe@doe.org'
            });

            // Missing
            validation = model.validate();
            ok(validation, "Validation should be defined.");
            ok(validation.firstName, "Validation should have firstName entry.");
            strictEqual(model.isValid(), false, "Model should not be valid.");

            // Make sure it is the only error.
            var withoutFirstName = _.omit(validation, 'firstName');
            ok(_.isEmpty(withoutFirstName), "Validation should now be empty.");

            // Too Short
            model.set({
                firstName: 'A'
            });
            validation = model.validate();
            ok(validation, "Validation should be defined.");
            ok(validation.firstName, "Validation should have firstName entry.");
            strictEqual(model.isValid(), false, "Model should not be valid.");

            // Too Long
            model.set({
                firstName: '1234567890123456'
            });
            validation = model.validate();
            ok(validation, "Validation should be defined.");
            ok(validation.firstName, "Validation should have firstName entry.");
            strictEqual(model.isValid(), false, "Model should not be valid.");

            // Exact
            model.set({
                firstName: '123456789012345'
            });
            validation = model.validate();
            ok(_.isUndefined(validation), "Validation should be undefined.");
            strictEqual(model.isValid(), true, "Model should be valid.");

            // Special Case
            model.set({
                firstName: 'George'
            });
            validation = model.validate();
            ok(validation, "Validation should be defined.");
            ok(validation.madeUpField, "Validation should have a madeUpField.");
            strictEqual(model.isValid(), false, "Model should not be valid.");
        });

    };

    return {testSuite: testSuite}
});

