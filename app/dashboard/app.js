(function () {
	'use strict';

	var app = angular.module('app', [
		// Angular modules
		//'ngAnimate', // animations
		'ngRoute', // routing
		'ngSanitize', // sanitizes html bindings (ex: sidebar.js)
		//'dashboard.controllers',

		// Custom modules
		'common', // common functions, logger, spinner
		'common.bootstrap', // bootstrap dialog wrapper functions
		'LocalStorageModule',

		// 3rd Party Modules
		'breeze.angular', // configures breeze for an angular app
		'breeze.directives', // contains the breeze validation directive (zValidate)
		'ui.bootstrap', // ui-bootstrap (ex: carousel, pagination, dialog)
		'kendo.directives', // kendo-angular (grid, dataviz)
		'angularMoment', // Date and Time Format
		'angulartics',  //analytics
		'angulartics.google.analytics', //analytics
		'evReg',
		'ngRoleAuth'
	]);

	app.config(['$httpProvider', function ($httpProvider) {
		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
	}]);

	// Handle routing errors and success events.
	// Trigger breeze configuration
	app.run(['$route', function ($route) {
		// Include $route to kick start the router.
	}]);

	app.constant('ngAuthSettings', {
		//apiServiceBaseUri: serviceBase,
		clientId: 'ngAuthApp'
	});

	app.config(function ($httpProvider) {
		$httpProvider.interceptors.push('authInterceptorService');
	});

	// Handle routing errors and success events.
	app.run(['$route', 'authService', "AuthService", function ($route, authService, rbs) {
		// Include $route to kick start the router.
		authService.fillAuthData();
		rbs.getRole = function(){
			var roles = [];
			if(authService.authentication.roles){
				roles = authService.authentication.roles;
			}
			return roles;
		};
	}]);


	//app.run(['$route', '$rootScope', '$q', 'routemediator',
	//function ($route, $rootScope, $q, routemediator) {
	//    // Include $route to kick start the router.
	//    breeze.core.extendQ($rootScope, $q);
	//    routemediator.setRoutingHandlers();
	//}]);

})();
