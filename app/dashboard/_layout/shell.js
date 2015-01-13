(function () {
    'use strict';

    var controllerId = 'shell';   //mjb test push

    function Controller($rootScope, $location, $timeout, $css, common, config,  authService) {
        var self = this;

        var logSuccess = common.logger.getLogFn(controllerId, 'success!!!');
        var events = config.events;

        this.busyMessage = 'Please wait ...';
        this.isBusy = true;
        this.showSplash = true;
        this.progBar = 22;
        this.spinnerOptions = {
            radius: 40,
            lines: 7,
            length: 20,
            width: 15,
            speed: 1.7,
            corners: 1.0,
            trail: 100,
            color: '#F58A00'
        };
        this.resolved = false;

        function toggleSpinner(on) {
            self.isBusy = on;
        }

        function activate() {
            var isDefault = true;

            if(isDefault) {
                $css.add('Content/colors.css');
            }

            toggleSpinner(true);
            self.showSplash = true;
            self.progBar = 30;

            var promises = [];

            common.activateController(promises, controllerId)
                .then(function () {
                    self.resolved = true;
                    self.progBar = 90;
                    if(!authService.authentication.isAuth){
                        $location.path("/login");
                    }
                    $timeout(function(){
                        self.progBar = 100;
                        self.showSplash = false;
                    }, 300);
                })
                .then(function(){

                });
        }

        $rootScope.$on('$routeChangeStart', function (event, next, last) {
                // toggleSpinner(true);
            }
        );

        $rootScope.$on(events.controllerActivateSuccess, function (data) {
                toggleSpinner(false);
            }
        );

        $rootScope.$on(events.spinnerToggle, function (scope, on) {
                toggleSpinner(on);
            }
        );

        activate();
    }

    angular.module('app').controller(controllerId, ['$rootScope', '$location', '$timeout', '$css', 'common', 'config',  'authService', Controller]);
})();
