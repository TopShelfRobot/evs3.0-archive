﻿(function () {

    var app = angular.module('evReg', [
        // Angular modules
        //'ngAnimate',        // animations
        'ngRoute',          // routing
        'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)

        // Custom modules
        'common',           // common functions, logger, spinner
     
        // 3rd Party Modules
        'breeze.angular',    // configures breeze for an angular app
        'breeze.directives', // contains the breeze validation directive (zValidate)
        'ui.bootstrap',      // ui-bootstrap (ex: carousel, pagination, dialog)
		'kendo.directives', // kendo-angular (grid, dataviz)
		'common.bootstrap', // bootstrap dialog wrapper functions
		'nsPopover',
    ]);

    // Handle routing errors and success events.
    app.run(['$route', function ($route) {
        // Include $route to kick start the router.
    }]);

})();
