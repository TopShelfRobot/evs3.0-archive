(function () {
    'use strict';

    var app = angular.module('evReg');

    // For use with the HotTowel-Angular-Breeze add-on that uses Breeze
    //var remoteServiceName = 'breeze/Breeze';
	var apiPath = "";
	 //apiPath = "http://localhost:55972";
	apiPath = "http://dev30.eventuresports.info";
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

    var owner = {
        ownerId: 1,
        houseEmail: 0,
        guid: 0,
        logoImageName: '/Content/images/logo.png',

        houseId: 11,    //this will be set by shell
        mr_houseId: 0,
        houseName: "",
        accessType: "none",
        isReg: false,

        isHeadfirst: false,
        isSportsComm: false,

        wizard: true,
        wizEventureId: 0,
        wizEventureListId: 0,

        isGroupRequired: false,

        multItemDiscount: false,
        fourDeLisDiscount: false,

        isAddSingleFeeForAllRegs: false,
        addSingleFeeForAllRegsPercent: 0,
        addSingleFeeType: '',
        addSingleFeeForAllRegsFlat: 0,

        eventureName: 'Event',
        listName: 'List',
        groupName: 'Group',
        partButtonText: 'Select Party!',

        listStatement: 'Select a desired start time',

        isEnterpriseDisplayedOnMenu: true,
        isEventureDisplayedOnMenu: true,
        isPartDisplayedOnMenu: true,
        isCouponDisplayedOnMenu: true,
        isResourceDisplayedOnMenu: true,
        isReportingDisplayedOnMenu: true
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
