(function() {
	'use strict';

	var controllerId = 'seteventure';
	angular.module('app').controller(controllerId, ['$routeParams', '$timeout', '$location', '$scope', 'common', 'datacontext', seteventure]);

	function seteventure($routeParams, $timeout, $location, $scope, common, datacontext) {

		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		var vm = this;
		vm.title = 'Eventure';
		vm.eventureId = $routeParams.eventureId || 0;

		//log('val is: ' + vm.eventureId);

		vm.eventure = {};
		activate();

		function activate() {
			onDestroy();
			common.activateController(getEventure(), controllerId)
				.then(function() {
					//log('Activated set eventure');
				});
		}

		function getEventure() {

			if (vm.eventureId > 0) {
				return datacontext.eventure.getEventureById(vm.eventureId)
					.then(function(data) {
						//applyFilter();
						return vm.eventure = data;
					});
			} else {
				return vm.eventure = datacontext.eventure.createEventure();
			}
		}

        vm.cancel = function() {
			$location.path("/eventurecenter");
        };

		function onDestroy() {
			//alert('destroy my contextttttttt!!!!');
			$scope.$on('$destroy', function () {
				//alert('destroymy contextttttttt!!!!!!!');
				//autoStoreWip(true);
				datacontext.cancel();
			});
		}

        vm.saveAndNav = function() {
            return datacontext.save(vm.eventure)
            .then(complete);

                function complete() {
                    $location.path("/eventurecenter");
                }
        };

		vm.today = function () {
			vm.eventure.dateEventure = new Date();
			vm.eventure.dateTransfer = new Date();
			vm.eventure.dateDeferral = new Date();
		};

		vm.today();

		vm.open = function($event, open) {
			$event.preventDefault();
			$event.stopPropagation();
			vm[open] = true;
		};

		vm.dateOptions = {
			'year-format': "'yy'",
			'starting-day': 1
		};

		vm.formats = ['MM-dd-yyyy', 'yyyy/MM/dd', 'shortDate'];

		vm.format = vm.formats[0];

	}
})();
