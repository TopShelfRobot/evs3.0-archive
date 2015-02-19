'use strict';
(function () {

	function Controller($location, datacontext, helpers, config) {
		var vm = this;

		vm.search = function () {
			vm.selectedUser = null;
			if (vm.employeeEmail) {
				// search by email
				datacontext.participant.getParticipantsBySearchingEmail(vm.employeeEmail) //TODO whg needs to be changed to employee
					.then(function (list) {
						vm.searchResults = list;
					});
			} else if (vm.partName) {
				// search by name
				datacontext.participant.getParticipantsBySearchingName(vm.employeeName) //TODO whg needs to be changed to employee
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
			$location.path("/user-profile/add"); //TODO whg Should probably be a separate page for employee add
		};

		if (config.owner.newId && config.owner.houseId) {
			console.log(config);
			config.owner.newId = false;
			$location.path("/eventure/");
		}
	}

	angular.module('app').controller('Employee', ['$location', 'datacontext', 'Helpers', 'config', Controller]);
})();