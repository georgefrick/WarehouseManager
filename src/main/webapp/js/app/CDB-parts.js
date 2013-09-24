/**
 * George Frick george.frick@gmail.com
 * @brewcitycoder
 * May be freely distributed under the MIT license.
 * A second Backbone example module.
 */
define([ 'handlebars', 'backbone'], function(){
    "use strict";

    var CDBPartsManager = {};

    CDBPartsManager.Part = Backbone.Model.extend({
        defaults: {
            partCode: "", // In the form, ABC-###
            name: "",
            description: "",
            standard: "Metric",
            quantityPer: 0,
            isNonRefundable: false
        },
        validation: {
            partCode: function(value) {
                if( !value ) {
                    return "All parts must have a part code.";
                }
                if( !value.match(/[a-zA-z]{3}-[0-9]{3}/g) ) {
                    return "Part numbers must be in the form XXX-###";
                }
            },
            name: {
                required: true,
                maxLength: 15,
                minLength: 5,
                msg: 'Please enter a valid part name.'
            },
            description: {
                required: false,
                maxLength: 50,
                minLength: 2,
                msg: 'Please enter a valid description.'
            },
            standard: function(value) {
                if( !value || ( value !== 'SAE' && value !== 'Metric' && value !== 'N/A') ) {
                    return "Standard must be one of N/A, Metric, or SAE.";
                }
            },
            quantityPer:  {
                required: true,
                min: 1,
                msg: "Quantity per must be a number >= 1."
            },
            isNonRefundable: function (value) {
                if(_.isUndefined(value) || !_.isBoolean(value) ) {
                    return "Non-Refundable flag must be true or false.";
                }
            }
        },
        initialize: function () {
            // Nothing.
        },
        urlRoot: "rest/parts"
    });


    CDBPartsManager.PartsList = Backbone.Collection.extend({
        model: CDBPartsManager.Part,
        url: "rest/parts"
    });

    CDBPartsManager.PartView = Backbone.View.extend({
        initialize: function () {
            this.template = Handlebars.loadTemplate('part');
        },
        events: {
            'click button': 'deletePart'
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        deletePart: function () {
            this.model.destroy();
        }
    });

    CDBPartsManager.PartsListView = Backbone.View.extend({
        initialize: function () {
            this.template = Handlebars.loadTemplate('parts-list');
            this.parts = new CDBPartsManager.PartsList();
            this.parts.on('all', this.render, this);
            this.parts.fetch();
        },
        render: function () {
            this.$el.html(this.template(this));
            this.parts.each(this.addPart, this);
            return this;
        },
        addPart: function (part) {
            var view = new CDBPartsManager.PartView({model: part});
            this.$('.partsList').append(view.render().el);
        },
        count: function () {
            return this.parts.length;
        }
    });

    CDBPartsManager.PartForm = Backbone.View.extend({
        tagName: 'form',
        className: 'form-horizontal',
        initialize: function () {
            this.template = Handlebars.loadTemplate('part-form');
            this.model = new CDBPartsManager.Part();
            Backbone.Validation.bind(this);
        },
        events: {
            "submit": 'add',
            "change input[type='text']": 'updateTextValue',
            "change input[type='checkbox']": 'updateCheckBoxValue',
            "change select": 'updateTextValue'
        },
        render: function () {
            this.$el.html(this.template(this));
            return this;
        },
        updateTextValue: function (event) {
            var inputField = $(event.currentTarget);
            var fieldName = inputField.attr('name');
            var fieldValue = inputField.val();
            var tempObj = {};
            tempObj[fieldName] = fieldValue;
            this.model.set(tempObj, {silent: true});
        },
        updateCheckBoxValue: function(event) {
            var inputField = $(event.currentTarget);
            var fieldName = inputField.attr('name');
            var fieldValue = (inputField.attr('checked') === "checked");
            var tempObj = {};
            tempObj[fieldName] = fieldValue;
            this.model.set(tempObj, {silent: true});
        },
        add: function (event) {
            event.preventDefault();
            var validation = this.model.validate();
            if (this.model.isValid()) {
                this.collection.create(this.model);
                this.model = new CDBPartsManager.Part();
                Backbone.Validation.bind(this);
                this.render();
            }
        }
    });

    CDBPartsManager.PartsManagerView = Backbone.View.extend({
        initialize: function(options) {
            this.template = Handlebars.loadTemplate('parts-manager');
            this.partsDatabase = new CDBPartsManager.PartsListView();
            this.partsForm = new CDBPartsManager.PartForm({collection: this.partsDatabase.parts});
        },
        render: function() {
            this.$el.empty();
            this.$el.html(this.template());
            this.$el.find(".partsDatabaseContainer").append(this.partsDatabase.render().el);
            this.$el.find(".partsFormContainer").append(this.partsForm.render().el);
            return this;
        }
    });

    return CDBPartsManager;
});
