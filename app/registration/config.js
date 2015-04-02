(function () {
	'use strict';

	var app = angular.module('evReg');

	// For use with the HotTowel-Angular-Breeze add-on that uses Breeze
	//var remoteServiceName = 'breeze/Breeze';

	var apiPath = '';
	//apiPath = 'http://localhost:49822/';
	apiPath = 'http://dev30.eventuresports.info/';

	var remoteServiceName = apiPath + 'bdc/registration/';
	var remoteApiName = apiPath + 'api/';
	var events = {
		controllerActivateSuccess: 'controller.activateSuccess',
		spinnerToggle: 'spinner.toggle'
	};

	var imageSettings = {
		imageBasePath: '../content/images/photos/',
		unknownPersonImageSource: 'unknown_person.jpg',
		logoImageName: '/Content/images/logo.png'
	};

	var config = {
		appErrorPrefix: '[evs Error] ', //Configure the exceptionHandler decorator
		docTitle: 'eventure sports: ',
		events: events,
		apiPath: apiPath,
		remoteServiceName: remoteServiceName,
		imageSettings: imageSettings,
		version: '3.0.0',
		remoteApiName: remoteApiName,
		owner: {
			ownerId: 1,
			authEmail: '',
			isAdmin: false,
			mr_houseId: 0
		}
	};

	app.value('config', config);

	app.config(['$logProvider', function ($logProvider) {
		// turn debugging off/on (no info or warn)
		if ($logProvider.debugEnabled) {
			$logProvider.debugEnabled(true);
		}
  }]);

	// Configure the routes and route resolvers
	app.config(['$routeProvider', 'reg.routes', function ($routeProvider, routes) {
		routes.forEach(function (r) {
			// $routeProvider.when(r.url, r.config);
			setRoute(r.url, r.config);
		});
		$routeProvider.otherwise({
			redirectTo: '/eventure'
		});


		function setRoute(url, definition) {
			// Sets resolvers for all of the routes
			// by extending any existing resolvers (or creating a new one).
			definition.resolve = angular.extend(definition.resolve || {}, {
				prime: prime
			});

			$routeProvider.when(url, definition);
			return $routeProvider;
		}
	}]);

	prime.$inject = ['datacontext'];

	function prime(dc) {
		return dc.prime();
	}

	//#region Configure the common services via commonConfig
	app.config(['commonConfigProvider', "$httpProvider", function (cfg, $httpProvider) {
		cfg.config.controllerActivateSuccessEvent = config.events.controllerActivateSuccess;
		cfg.config.spinnerToggleEvent = config.events.spinnerToggle;
		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }]);
	//#endregion
})();
