﻿(function () {
    'use strict';

    var controllerId = 'shell';
    angular.module('common').controller(controllerId,
        ['$rootScope', 'common', 'config', shell]);

    function shell($rootScope, common, config) {
        var vm = this;
        var logSuccess = common.logger.getLogFn(controllerId, 'success!!!');
        var events = config.events;
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.showSplash = true;
        vm.spinnerOptions = {
            radius: 40,
            lines: 7,
            length: 0,
            width: 30,
            speed: 1.7,
            corners: 1.0,
            trail: 100,
            color: '#F58A00'
        };

        activate();

        function activate() {
            //logSuccess('Eventure SPorts Angular loaded!!!!!', null, true);
            // common.activateController([], controllerId);
                //.then(function () {
                //    vm.showSplash = false;
                //});
        }

        function toggleSpinner(on) { 
			vm.isBusy = on; 
		}
		
		toggleSpinner(true);

        $rootScope.$on('$routeChangeStart', function (event, next, last) { 
				toggleSpinner(true); 
			}
        );

        $rootScope.$on(events.controllerActivateSuccess, function (data) { 
				toggleSpinner(false); 
			}
        );

        $rootScope.$on(events.spinnerToggle, function (data) { 
				toggleSpinner(data.show); 
			}
        );

    };
})();