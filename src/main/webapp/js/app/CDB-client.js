/**
 * George Frick george.frick@gmail.com
 * @brewcitycoder
 * May be freely distributed under the MIT license.
 * A second Backbone example module.
 */
// 1. Converted to RequireJS.
define([ 'handlebars', 'backbone', 'json2'], function () {
    "use strict";

    var CDBClientManager = {};
    // 2. Note the loss of global, yay!

    CDBClientManager.Client = Backbone.Model.extend({
        defaults: {
            firstName: "",
            lastName: "",
            email: "",
            position: ""
        },
        validation: {
            firstName: {
                required: true,
                maxLength: 15,
                minLength: 2,
                msg: 'Please enter a valid first name.'
            },
            lastName: {
                required: true,
                maxLength: 20,
                minLength: 2,
                msg: 'Please enter a valid last name.'
            },
            email: {
                required: true,
                pattern: 'email',
                msg: 'Please enter a valid email.'
            },
            position: function (value) {
                // always valid for now.
            },
            madeUpField: function (value) {
                if (this.get('firstName') === 'George') {
                    return "George is not an allowed first name.";
                }
            }
        },
        initialize: function () {
        },
        urlRoot: "rest/clients"
    });


    CDBClientManager.ClientList = Backbone.Collection.extend({
        model: CDBClientManager.Client,
        url: "rest/clients"
    });

    CDBClientManager.ClientView = Backbone.View.extend({
        initialize: function () {
            this.template = Handlebars.loadTemplate('client');
        },
        events: {
            "click button": 'deleteClient'
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        deleteClient: function () {
            this.model.destroy();
        }
    });

    CDBClientManager.ClientListView = Backbone.View.extend({
        initialize: function () {
            this.template = Handlebars.loadTemplate('client-list');
            this.clients = new CDBClientManager.ClientList();
            this.clients.on('all', this.render, this);
            this.clients.fetch();
            // 3. Pitfall #X Don't forget to bind when calling out of context!
            _.bindAll(this,'addClient');
        },
        render: function () {
            this.$el.html(this.template(this));
            this.clients.each(this.addClientView, this);
            return this;
        },
        addClientView: function (client) {
            var view = new CDBClientManager.ClientView({model: client});
            this.$('.clientList').append(view.render().el);
        },
        addClient: function (client) {
            this.clients.create(client);
        },
        count: function () {
            return this.clients.length;
        }
    });

    CDBClientManager.ClientForm = Backbone.View.extend({
        tagName: 'form',
        className: 'form-horizontal',
        initialize: function () {
            this.template = Handlebars.loadTemplate('client-form');
            this.model = new CDBClientManager.Client();
            Backbone.Validation.bind(this);
        },
        events: {
            "submit": 'add',
            "change input[type='text']": 'updateTextValue'
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
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
        add: function (event) {
            event.preventDefault();
            var validation = this.model.validate();
            if (this.model.isValid()) {
                // 4. Events between backbone objects to uncouple them.
                this.trigger("newClient", this.model);
                this.model = new CDBClientManager.Client();
                Backbone.Validation.bind(this);
                this.render();
            }
        }
    });

    // 5. Manage Views/ Sub Views
    CDBClientManager.ClientManagerView = Backbone.View.extend({
        // 6. You can optionally provide these.
        tagName: 'div',
        className: 'test',
        initialize: function (options) {
            this.template = Handlebars.loadTemplate('client-manager');
            this.clientDatabase = new CDBClientManager.ClientListView();
            this.clientForm = new CDBClientManager.ClientForm();
            this.clientForm.on("newClient", this.addClientView, this);
        },
        addClientView: function (client) {
            this.clientDatabase.addClient(client);
        },
        render: function () {
            this.$el.empty();
            this.$el.html(this.template());
            // 7-1. this.$el ==> Jquery already wrapped.  (performance benefit: It's already found/bookmarked in the dom)
            // 7-2. this.el ==> Raw dom
            this.$el.find(".clientDatabaseContainer").append(this.clientDatabase.render().el);
            this.$el.find(".clientFormContainer").append(this.clientForm.render().el);
            return this;
        }
    });

    return CDBClientManager;
});
