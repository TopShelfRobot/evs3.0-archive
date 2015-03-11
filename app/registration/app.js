(function () {

	var app = angular.module('evReg', [
		// Angular modules
		//'ngAnimate',        // animations
		'ngRoute',          // routing
		'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)

		// Custom modules
		'common',           // common functions, logger, spinner
		 'LocalStorageModule',

		// 3rd Party Modules
		'breeze.angular',    // configures breeze for an angular app
		'breeze.directives', // contains the breeze validation directive (zValidate)
		'ui.bootstrap',      // ui-bootstrap (ex: carousel, pagination, dialog)
		'kendo.directives', // kendo-angular (grid, dataviz)
		'common.bootstrap', // bootstrap dialog wrapper functions
		'nsPopover',
		'angulartics',  //analytics
		'angulartics.google.analytics', //analytics
		'sbDateSelect',
		'ngMask'
	]);

	app.constant('ngAuthSettings', {
	    clientId: 'evsDev30'
	});

	app.config(function ($httpProvider) {
		$httpProvider.interceptors.push('authInterceptorService');
	});

	// Handle routing errors and success events.
	app.run(['$route', 'authService', "datacontext", "config", function ($route, authService, datacontext, config) {
		// Include $route to kick start the router.
		authService.fillAuthData();
	}]);
})();
