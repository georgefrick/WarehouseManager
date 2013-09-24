/**
 * George Frick (george.frick@gmail.com)
 * @brewcitycoder
 * May be freely distributed under the MIT license.
 */
require.config( {

    baseUrl: "js/",
		deps: [ 'app/bootstrap' ],
    // 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.8.3.min")
    paths: {
        // Core Libraries
        jquery:       "lib/jquery",
        jqueryui:     "lib/jquery-ui-1.10.2.custom",
        json2:        "lib/json2",
        underscore:   "lib/underscore",
        backbone:     "lib/backbone",
        handlebars:   "lib/handlebars",
        'backbone.validation':     "lib/backbone.validation"
    },

    // Sets the configuration for your third party scripts that are not AMD compatible
    shim: {
        "backbone": {
            "deps": [ "underscore", "jquery", "handlebars" ],
            "exports": "Backbone"  //attaches "Backbone" to the window object
        },
        "underscore" : {
            "exports": "_"
        },
        "jquery" : {
            "exports": "$"
        },
        "handlebars": {
            "exports": "Handlebars"
        },
        "jqueryui" : {
            "deps": [ "jquery"]
        },
        "backbone.validation": {
            "deps": [  "backbone" ],
            "exports": "Backbone.Validation"
        }
    } // end Shim Configuration
} );
