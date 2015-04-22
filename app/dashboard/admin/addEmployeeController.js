(function() {
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

		activate();

		var promises = [CreateEmployee()];

		function activate() {
			common.activateController(promises, controllerId)
				.then(function() {});
		}

		function CreateEmployee() {
			vm.employee = datacontext.participant.createEmployeeProfile();
			return vm.employee;
		}

		var rolesApi = config.remoteApiName + 'Account/GetAllRoles';
		vm.selectedRoles = [];
		vm.roleOptions = {
			placeholder: 'Select roles...',
			dataTextField: 'name',
			dataValueField: 'name',
			dataSource: {
				type: "json",
				transport: {
					read: {
						url: rolesApi
					}
				}
			}
		};

		vm.cancel = function() {
			return datacontext.cancel()
				.then(complete);

			function complete() {
				$location.path('/employee');
			}
		};

		vm.saveAndNav = function() {
			vm.savedSuccessfully = false;
			/* TODO Error handling

			 Process below is as follows:
			0) Check if user account exists.. If
			1) Creates the ASP User Account   Else
			2) If vm.savedSuccessfully === true then it does an $http post to save the user roles by user id (vm.registration.userId)
			3) If that is successful it will then save the employee.
			*/

			$http.get(config.apiPath + 'api/Account/UserExists', vm.registration).
			success(function(response) {
				if (!response.userFound) {
					//User Not Found
					//Create Account
					authService.saveRegistration(vm.registration, false).then(function(response) {
							vm.savedSuccessfully = true;
							vm.message = 'Employee account has been created successfully.';
							createEmployee(vm.savedSuccessfully);
						},
						function(response) {
							var errors = [];
							for (var key in response.data.modelState) {
								if (response.data.modelState.hasOwnProperty(key)) {
									for (var i = 0; i < response.data.modelState[key].length; i++) {
										errors.push(response.data.modelState[key][i]);
									}
								}
							}
							vm.message = 'Failed to register user due to: ' + errors.join(' ');
						});
				} else if (response.userFound) {
					createEmployee(true);
				}
			}).
			error(function(data, status, headers, config) {
				// Unable to check for account
				vm.message = 'An error has occurred. Please try again.';
			});

			function createEmployee(saved) {
				if (saved === true) {
					vm.employee.email = vm.registration.userName; /* Set employee email address if registration === successful */
					var source = {
						'userName': vm.employee.email,
						'roles': vm.selectedRoles
					};
					console.log(source);

					$http.post(config.apiPath + 'api/Account/PutRoles', source).
					success(function() {
						return datacontext.save(vm.employee)
							.then(complete);

						function complete() {
							$location.path('/employee');
						}

					}).
					error(function(data, status, headers, config) {
						// Roles could not be assigned
						vm.message = 'Roles were unable to be assigned. Please try again.';
					});
				}
			}
		};

	}
})();
