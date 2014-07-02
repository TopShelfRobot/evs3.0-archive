(function () {
    'use strict';

    var app = angular.module('evReg');
	
    toastr.options.timeOut = 1000;
    toastr.options.positionClass = 'toast-bottom-right';
	
	// function Config(datacontext){
		
		var apiPath = "";
		apiPath = 'http://evs30api.eventuresports.info';
	    var remoteServiceName = apiPath + '/breeze/breeze/';
	    var remoteApiName = apiPath + '/kendo/';
	
	    var events = {
	        controllerActivateSuccess: 'controller.activateSuccess',
	        spinnerToggle: 'spinner.toggle'
	    };

	    var imageSettings = {
	        imageBasePath: '../content/images/photos/',
	        unknownPersonImageSource: 'unknown_person.jpg'
	    };

	    // var owner = {
// 	        ownerId: 1,
// 	        guid: 0,
// 	        logoImageName: '/Content/images/logo.png',
//
// 	        accessType: "none",
// 	        isReg: false,
//
// 	        isHeadfirst: false,
// 	        isSportsComm: false,
//
// 	        wizard: true,
// 	        wizEventureId: 0,
// 	        wizEventureListId: 0,
//
// 	        isGroupRequired: false,
//
// 	        multItemDiscount: false,
// 	        fourDeLisDiscount: false,
//
// 	        isAddSingleFeeForAllRegs: false,
// 	        addSingleFeeForAllRegsPercent: 0,
// 	        addSingleFeeType: '',
// 	        addSingleFeeForAllRegsFlat: 0,
//
// 	        eventureName: 'Event',
// 	        listName: 'List',
// 	        groupName: 'Group',
// 	        partButtonText: 'Select PArty!',
//
// 	        listStatement: 'Select a desired start time',
//
// 	        isEnterpriseDisplayedOnMenu: true,
// 	        isEventureDisplayedOnMenu: true,
// 	        isPartDisplayedOnMenu: true,
// 	        isCouponDisplayedOnMenu: true,
// 	        isResourceDisplayedOnMenu: true,
// 	        isReportingDisplayedOnMenu: true
// 	    };

		// datacontext.getParticipantById(config.houseId)
// 			.then(function(part){
// 				config.participant = part;
// 			});
//
// 		datacontext.getOwnerById(config.ownerId)
// 			.then(function(owner){
// 				config.owner = owner;
// 			});

	    var config = {
	        appErrorPrefix: '[evs Error] ', //Configure the exceptionHandler decorator
	        docTitle: 'eventure sports: ',
	        events: events,
			houseId : 13,
			ownerId : 1,
	        imageSettings: imageSettings,
	        version: '3.0.0',
			apiPath : apiPath,
	        remoteServiceName: remoteServiceName,
	        remoteApiName: remoteApiName,
	        owner: null,
			participant : null,
	    };
		
		// return config;
	// }
	
    // app.service('config', ["datacontext", Config]);
	app.value('config', config);

    app.config(['$logProvider', function ($logProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
    }]);

    //#region Configure the common services via commonConfig
    app.config(['commonConfigProvider', "$httpProvider", function (cfg, $httpProvider) {
        cfg.config.controllerActivateSuccessEvent = config.events.controllerActivateSuccess;
        cfg.config.spinnerToggleEvent = config.events.spinnerToggle;
		$httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]);
    //#endregion
})();
