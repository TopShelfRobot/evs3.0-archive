(function () {
	'use strict';

	function Controller($location, datacontext, helpers, config) {
		var vm = this;

		vm.search = function () {
			vm.selectedUser = null;
			if (vm.employeeEmail) {
				// search by email
				datacontext.participant.getEmployeesBySearchingEmail(vm.employeeEmail)
					.then(function (list) {
						vm.searchResults = list;
					});
			} else if (vm.partName) {
				// search by name
				datacontext.participant.getEmployeesBySearchingName(vm.employeeName)
					.then(function (list) {
						vm.searchResults = list;
					});
			} else {
				vm.searchResults = [];
			}
		};

		vm.ageFromBirthday = helpers.ageFromBirthday;

		vm.searchResults = [];

		vm.selectedUser = null;

		vm.createNewUser = function () {
			$location.path('/employee-profile/add'); //TODO whg Should probably be a separate page for employee add
		};
	}

	angular.module('app').controller('Employee', ['$location', 'datacontext', 'Helpers', 'config', Controller]);
})();
