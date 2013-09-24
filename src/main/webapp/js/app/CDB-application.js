/**
 * George Frick (george.frick@gmail.com)
 * @brewcitycoder
 * May be freely distributed under the MIT license.
 */
define([  'app/calculator', 'app/CDB-client', 'app/CDB-parts', 'backbone.validation'],
    function (Calculator, CDBClientManager, CDBPartsManager) {
        "use strict";

        /* Everything into its own scope. */
        var Application = {};

        /*
         * 9. A serious router.
         * This is the root of the application, by linking things with href="#myurl", that link will run code.
         * Here, we manage the tabs within the application using those url/code matches.
         */
        Application.Router = Backbone.Router.extend({
            initialize: function (options) {
                this.el = options.el;
                this.tabTemplate = Handlebars.loadTemplate("tab");
                this.tabContentTemplate = Handlebars.loadTemplate("tabContent");
                this.modules = {};
            },
            routes: {
                "": "showHome",
                "newClientManager": "newClientManager",
                "newPartsManager": "newPartsManager",
                "newInvoice": "newInvoice",
                "newCalculator": "newCalculator",
                "closeAll": "closeAllTabs"
            },
            showHome: function () {
                // do nothing.
            },
            newCalculator: function () {
                // For the calculator, we allow multiple tabs...
                var tabId = "calculator-" + Math.guid();
                var tabName = "Calculator";
                var calc = new Calculator.CalculatorView();
                this.modules[tabId] = calc;

                var uniqueId = this.addTab({
                    'id': tabId,
                    'name': tabName
                });
                var tabContent = $("#" + uniqueId);
                tabContent.empty();
                tabContent.append(calc.render().el);
                Backbone.history.navigate("");
            },
            newClientManager: function () {
                if (!this.openClientManager || ($("#" + this.openClientManager).length == 0)) {
                    var tabId = "client-manager";
                    var tabName = "Clients";
                    var clientManager = new CDBClientManager.ClientManagerView();
                    this.modules[tabId] = clientManager;
                    this.openClientManager = this.addTab({
                        'id': tabId,
                        'name': tabName
                    });
                    var tabContent = $("#" + this.openClientManager);
                    tabContent.empty();
                    tabContent.append(clientManager.render().el);
                } else if (this.openClientManager) {
                    this.selectTabById(this.openClientManager);
                }
                Backbone.history.navigate("");
            },
            newPartsManager: function () {
                if (!this.openPartsManager || ($("#" + this.openPartsManager).length == 0)) {
                    var tabId = "parts-manager";
                    var tabName = "Parts";
                    var partsManager = new CDBPartsManager.PartsManagerView();
                    this.modules[tabId] = partsManager;
                    this.openPartsManager = this.addTab({
                        'id': tabId,
                        'name': tabName
                    });
                    var tabContent = $("#" + this.openPartsManager);
                    tabContent.empty();
                    tabContent.append(partsManager.render().el);
                } else if (this.openPartsManager) {
                    this.selectTabById(this.openPartsManager);
                }
                Backbone.history.navigate("");
            },
            addTab: function (tabInfo) {
                var current = {
                    // Defaults
                    'name': "New Tab",
                    'content': "",
                    'show': true,
                    'id': Math.guid()
                };
                var attr, val;
                var attrs = {};

                // Check if just the name was passed in, or an object full of properties.
                if (typeof tabInfo === 'object') {
                    attrs = tabInfo;
                } else {
                    attrs.name = tabInfo;
                }

                // Look for passed in options that override defaults and set them.
                for (attr in attrs) {
                    val = attrs[attr];
                    if (current[attr] !== undefined && !_.isEqual(current[attr], val)) {
                        current[attr] = val;
                    }
                }

                // Construct the new tab, consisting of the tab and the tab content.
                this.el.find(".ui-tabs-nav:first").append(this.tabTemplate(current));
                this.el.append(this.tabContentTemplate(current));
                this.el.tabs("refresh");

                // If the user opted not to show the tab, it is opened in the background.
                if (current.show) {
                    this.selectTabById(current.id);
                }
                return current.id;
            },
            selectTabById: function (tabId) {
                var index = $('#tabs a[href="#' + tabId + '"]').parent().index();
                return $("#" + tabId).length && $("#tabs").tabs("option", "active", index);
            },
            closeAllTabs: function () {
                var tabCount = $('#tabs >ul >li').size();
                while (tabCount > 1) {
                    // @TODO call "close" on the module.
                    var tab = $("#tabs").find(".ui-tabs-nav li:eq(1)").remove();
                    var panelId = tab.attr("aria-controls");
                    $("#" + panelId).remove();
                    $("tabs").tabs("refresh");
                    tabCount--;
                }
                Backbone.history.navigate("");
            }
        });

        Application.startup = function (container) {
            container = $(container);
            var router = new Application.Router({el: container});
            Backbone.history.start();
            return router;
        };

        // Add a way to create unique id's.
        if (Math && !Math.s4 && !Math.guid) {
            var s4 = function () {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            };
            Math.s4 = s4;
            Math.guid = function () {
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            }
        }

        // Extend Handlebars to load [and cache] a template from within the DOM.
        if (Handlebars && !Handlebars.loadTemplate) {
            var loadTemplate = function (name) {
                if (this[name]) {
                    return this[name];
                }
                var temp = $("#" + name + "-template").html();
                var compiled = Handlebars.compile(temp);
                this[name] = compiled;
                return compiled;
            };
            Handlebars.loadTemplate = loadTemplate;
        }

        // Extend backbone to find our error-box and show errors.
        _.extend(Backbone.Validation.callbacks, {
            valid: function (view, attr, selector) {
                view.$('[' + selector + '=' + attr + ']').removeClass('invalid');
                // remove from the list; and if empty; hide it.
                view.$('.error-box').find('li[name=' + attr + ']').remove();
                if (view.$('.error-box').find('ul li').length == 0) {
                    view.$('.error-box').hide();
                }
            },
            invalid: function (view, attr, error, selector) {
                view.$('[' + selector + '=' + attr + ']').addClass('invalid');
                // show container, add to list (with name!).
                view.$('.error-box').find('li[name=' + attr + ']').remove();
                view.$('.error-box').show().find('.error-list').append(
                    '<li name="' + attr + '">' + error + '</li>');
            }
        });

        Backbone.View.prototype.close = function () {
            this.$el.empty();
            this.unbind();
            // @TODO if you are using the global event hub, unbind from it.
//            if (globalEventHub) {
//                globalEventHub.off(null, null, this);
//            }
        };

        return Application;
    });