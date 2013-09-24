/**
 * George Frick (george.frick@gmail.com)
 * @brewcitycoder
 * May be freely distributed under the MIT license.
 *
 * This is the starting point of the application; separated out for compiling with R.js
 */
// 8. Provide a requirejs starting point, also TABS.
define([ 'jquery', 'jqueryui', 'app/CDB-application'], function ($, $ui, CDBApplication) {

    $("#tabs").tabs();
    CDBApplication.startup($("#tabs"));

});
