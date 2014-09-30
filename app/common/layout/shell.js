(function () {
    'use strict';

    var controllerId = 'shell';
    angular.module('common').controller(controllerId,
        ['$rootScope', 'common', 'config', "$timeout", shell]);

    function shell($rootScope, common, config, $timeout) {
        var vm = this;
        var logSuccess = common.logger.getLogFn(controllerId, 'success!!!');
        var events = config.events;
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.showSplash = true;
		vm.progBar = 22;
        vm.spinnerOptions = {
            radius: 40,
            lines: 7,
            length: 20,
            width: 15,
            speed: 1.7,
            corners: 1.0,
            trail: 100,
            color: '#F58A00'
        };

        activate();

        function activate() {
            vm.showSplash = true;
			vm.progBar = 55;
            common.activateController([], controllerId)
                .then(function () {
					vm.progBar = 89;
					$timeout(function(){
						vm.showSplash = false;
					}, 500);
					
                });
        }

        function toggleSpinner(on) {
			vm.isBusy = on;
		}

		toggleSpinner(true);

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

    };
})();
