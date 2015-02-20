(function () {
	'use strict';

	var controllerId = 'setvolunteerjob';
	angular.module('app').controller(controllerId, ['$routeParams', '$location', '$scope', 'common', 'datacontext', setvolunteerjob]);

	function setvolunteerjob($routeParams, $location, $scope, common, datacontext) {
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		var vm = this;
		vm.job = {};
		vm.jobId = $routeParams.jobId;
		vm.eventureId = $routeParams.eventureId;
		vm.shifts = [];
		vm.opened = [];

		activate();

		function activate() {
			onDestroy();
			common.activateController(getVolunteerJob(), getVolunteerShifts(), controllerId)
				.then(function () { 
				  
				  //log('Activated Volunteer Schedule Edit'); 
				});
		}

		function getVolunteerJob() {
		  if(vm.jobId > 0) {
				return datacontext.volunteer.getVolunteerJobById(vm.jobId)
				  .then(function(data) {
						//applyFilter();
						vm.job = data;
						return vm.job;
					});
		  }
		  else {
			  vm.job = datacontext.volunteer.createVolunteerJob(vm.eventureId);
			  return vm.job;
		  }
					
		}
	  
		function getVolunteerShifts() {
		  if(vm.jobId > 0) {
			return datacontext.volunteer.getVolunteerShiftsByVolunteerJobId(vm.jobId)
			  .then(function(data) {
					for(var i = 0; i < data.length; i++){
						vm.opened.push(false);
					}

					vm.shifts = data;
					return vm.shifts;
				});
		  }
		}
	  
		vm.addNewShift = function () {
		   vm.shifts.push(datacontext.volunteer.createVolunteerShift(vm.jobId));

			vm.opened.push(true);
		};

		vm.open = function($event, key) {
			$event.preventDefault();
			$event.stopPropagation();
			vm.opened[key] = true;
		};

		vm.dateOptions = {
			'year-format': "'yy'",
			'starting-day': 1
		};

		function onDestroy() {
			$scope.$on('$destroy', function () {
				datacontext.cancel();
			});
		}

		vm.formats = ['MM-dd-yyyy', 'yyyy/MM/dd', 'shortDate'];

		vm.format = vm.formats[0];

	  
		vm.cancel = function() {
			$location.path("/eventuredetail/" + vm.eventureId);
		};

		vm.saveAndNav = function() {

			return datacontext.save()
				.then(complete);

			function complete() {
				$location.path("/eventuredetail/" + vm.eventureId);
			}
		};

	}
})();
