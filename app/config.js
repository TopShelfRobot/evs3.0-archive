﻿(function () {
	'use strict';

	var app = angular.module('app');

	// Configure Toastr
	toastr.options.timeOut = 4000;
	toastr.options.positionClass = 'toast-bottom-right';
	
	var apiPath = "";
	apiPath = "http://localhost:49822/";
	apiPath = "http://dev30.eventuresports.info/";
	// apiPath = "http://30api.eventuresports.info";
	
	var remoteServiceName = apiPath + 'api/dashboard/';
	var remoteApiName = apiPath + 'api/';

	var events = {
		controllerActivateSuccess: 'controller.activateSuccess',
		spinnerToggle: 'spinner.toggle'
	};

	var imageSettings = {
		imageBasePath: '../content/images/photos/',
		unknownPersonImageSource: 'unknown_person.jpg'
	};

	var owner = {
		ownerId: 1,
	    //accessType: "none",
        authEmail: '',
		isAdmin: true,
		mr_houseId: 0
	};

	var config = {
		appErrorPrefix: '[evs Error] ', //Configure the exceptionHandler decorator
		docTitle: 'eventure sports: ',
		events: events,
		apiPath : apiPath,
		remoteServiceName: remoteServiceName,
		imageSettings: imageSettings,
		version: '3.0.0',
		remoteApiName: remoteApiName,
		owner: owner
	};

	app.value('config', config);
	
	app.constant('USER_ROLES', {
		user: "user",
		admin: "admin",
		superUser: "super-user",
		money: "money",
	});

	app.config(['$logProvider', function ($logProvider) {
		// turn debugging off/on (no info or warn)
		if ($logProvider.debugEnabled) {
			$logProvider.debugEnabled(true);
		}
	}]);

	//#region Configure the common services via commonConfig
	app.config(['commonConfigProvider', function (cfg) {
		cfg.config.controllerActivateSuccessEvent = config.events.controllerActivateSuccess;
		cfg.config.spinnerToggleEvent = config.events.spinnerToggle;
	}]);
	//#endregion
})();
