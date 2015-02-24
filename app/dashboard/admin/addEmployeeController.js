(function () {
	'use strict';

	var controllerId = 'addEmployee';
	angular.module('app').controller(controllerId, ['$location', '$http', 'common', 'datacontext', 'config', 'authService', addEmployee]);

	function addEmployee($location, $http, common, datacontext, config, authService) {

		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		var vm = this;

		vm.title = 'Add A New Employee';
		vm.buttonText = 'Save Employee';

		vm.ownerId = config.owner.ownerId;

		vm.employee = {};

		vm.registration = {
			userName: '',
			password: '',
			confirmPassword: ''
		};

		vm.roleOptions = {
			placeholder: 'Select roles...',
			dataTextField: 'name',
			dataValueField: 'roleId',
		};

		vm.selectedRoles = [];


		activate();

		var promises = [CreateEmployee()];

		function activate() {
			common.activateController(promises, controllerId)
				.then(function () {
					getAllRoles();
				});
		}

		function CreateEmployee() {
			vm.employee = datacontext.participant.createEmployeeProfile();
			return vm.employee;
		}

		function getAllRoles() {
			$http.get(config.remoteApiName + 'Account/GetAllRoles/').
			success(function (roles) {
				multiSelect(roles);
			}).
			error(function (data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			});
		}

		function multiSelect(roles) {
			for (var i = 0; i < roles.length; i++) {
				vm.multiSelect.dataSource.add({
					name: roles[i].name,
					id: roles[i].id
				});
			}
		}

		vm.cancel = function () {
			return datacontext.cancel()
				.then(complete);

			function complete() {
				$location.path('/employee');
			}
		};

		vm.saveAndNav = function () {
			/* TODO whg authService.saveRegistration currently logs you out before proceeding. This throws you into an infinite loop.
							Will probably need to write a new authService.saveRegistration for this.

				 TODO Error handling

			 Process below is as follows:
			1) Creates the ASP User Account
			2) If vm.savedSuccessfully === true then it does an $http post to save the user roles by user id (vm.registration.userId)
			3) If that is successful it will then save the employee.
			*/

			authService.saveRegistration(vm.registration).then(function (response) {
					vm.savedSuccessfully = true;
					vm.message = 'User has been registered successfully, you will be redirected in 2 seconds.';
				},
				function (response) {
					var errors = [];
					for (var key in response.data.modelState) {
						for (var i = 0; i < response.data.modelState[key].length; i++) {
							errors.push(response.data.modelState[key][i]);
						}
					}
					vm.message = 'Failed to register user due to:' + errors.join(' ');
				}).then(function () {
				if (vm.savedSuccessfully === true) {
					vm.employee.emailAddress = vm.registration.userId; /* Set employee email address === successful userId */
					$http.post(config.remoteApiName + 'Account/SaveUserRolesByUserId/' + vm.registration.userId, vm.selectedRoles).
					success(function () {
						return datacontext.save(vm.employee)
							.then(complete);

						function complete() {
							$location.path('/employee');
						}

					}).
					error(function (data, status, headers, config) {
						// called asynchronously if an error occurs
						// or server returns response with an error status.
					});
				}
			});
		};

	}
})();
