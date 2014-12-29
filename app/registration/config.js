(function () {
    'use strict';

    var app = angular.module('evReg');

    // For use with the HotTowel-Angular-Breeze add-on that uses Breeze
    //var remoteServiceName = 'breeze/Breeze';
    var apiPath = "";
    //apiPath = "http://localhost:49822/";
    apiPath = "http://dev30.eventuresports.info/";

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
        remoteApiName: remoteApiName
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
