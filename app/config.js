﻿(function () {
    'use strict';

    var app = angular.module('app');

    // Configure Toastr
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-bottom-right';

    // For use with the HotTowel-Angular-Breeze add-on that uses Breeze
    //var remoteServiceName = 'breeze/Breeze';
    var remoteServiceName = 'http://evs30api.eventuresports.info/breeze/breeze/';
    var remoteApiName = 'http://evs30api.eventuresports.info/kendo/';

    // var remoteServiceName = 'http://localhost:55972/breeze/breeze/';
    // var remoteApiName = 'http://localhost:55972/kendo/';

    //var remoteServiceName = '/breeze/breeze/';
    //var remoteApiName = '/kendo/';

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

        houseId: 0,    //this will be set by shell
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
        partButtonText: 'Select PArty!',

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
    app.config(['commonConfigProvider', function (cfg) {
        cfg.config.controllerActivateSuccessEvent = config.events.controllerActivateSuccess;
        cfg.config.spinnerToggleEvent = config.events.spinnerToggle;
    }]);
    //#endregion
})();
