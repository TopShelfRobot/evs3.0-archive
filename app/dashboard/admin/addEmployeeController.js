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
      $http.get(config.remoteApiName + 'Account/GetAllRoles').
      success(function (data) {
        populateMultiSelect(data);
      }).
      error(function (data, status, headers, config) {
        // called asynchronously if an error occurs
      });
    }

    function populateMultiSelect(roles) {
      for (var i = 0; i < roles.length; i++) {
        console.log(roles[i]);
        vm.multiSelect.dataSource.add({
          name: roles[i] //,
            //roleId: roles[i].roleId
        });
      }
    }

    vm.selectedRoles = [];

    vm.roleOptions = {
      placeholder: 'Select roles...',
      dataTextField: 'name',
      dataValueField: 'name',
    };

    vm.cancel = function () {
      return datacontext.cancel()
        .then(complete);

      function complete() {
        $location.path('/employee');
      }
    };

    vm.saveAndNav = function () {

      /* TODO Error handling

			 Process below is as follows:
			1) Creates the ASP User Account
			2) If vm.savedSuccessfully === true then it does an $http post to save the user roles by user id (vm.registration.userId)
			3) If that is successful it will then save the employee.
			*/

      authService.saveRegistration(vm.registration, false).then(function (response) {
          vm.savedSuccessfully = true;
          vm.message = 'Employee has been created successfully, you will be redirected.';
        },
        function (response) {
          var errors = [];
          for (var key in response.data.modelState) {
            //TODO whg added this. might explode
            if (response.data.modelState.hasOwnProperty(key)) {
              for (var i = 0; i < response.data.modelState[key].length; i++) {
                errors.push(response.data.modelState[key][i]);
              }
            }
          }
          vm.message = 'Failed to register user due to: ' + errors.join(' ');
        }).then(function () {
        if (vm.savedSuccessfully === true) {
          vm.employee.email = vm.registration.userName; /* Set employee email address if registration === successful */
          var source = {
            'userName': vm.employee.email,
            'roles': vm.selectedRoles
          };
          console.log(source);

          $http.post(config.apiPath + 'api/Account/PutRoles', source).
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
