(function () {
  'use strict';
  var controllerId = 'employee';
  angular.module('app').controller(controllerId, ['$http', '$scope', '$location',
  'config', 'common', 'datacontext', employee]);

  function employee($http, $scope, $location, config, common, datacontext) {
    var getLogFn = common.logger.getLogFn;
    var log = getLogFn(controllerId);

    var vm = this;

    activate();

    function activate() {
      var promises = [getAllRoles()];
      common.activateController(promises, controllerId)
        .then(function () {
          //log('Activated Coupon Addon Center View');
        });
    }

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

    vm.searchResults = [];

    vm.selectedUser = null;

    function getAllRoles() {
      $http.get(config.remoteApiName + 'Account/GetAllRoles').
      success(function (data) {
        console.log(data);
        multiSelect(data);
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
          roleId: roles[i].roleId
        });
      }
    }

    vm.selectedRoles = [];

    vm.roleOptions = {
      placeholder: 'Select roles...',
      dataTextField: 'name',
      dataValueField: 'roleId',
    };

    vm.updateUserRoles = function () {
      console.log('selectedEmployee:', vm.selectedUser.email);
      $http.get(config.remoteApiName + 'Account/GetUserRolesByUserId/' + vm.selectedUser.email + '/')
        //$http.get(config.remoteApiName + 'Account/GetUserRolesByUserId/')
        .then(function (roles) {
          //console.table(roles);
          //console.log(roles.data);
          vm.selectedRoles = roles.data;
          console.log(vm.selectedRoles);
          return vm.selectedRoles;
        });
      //					if (typeof(roles) === undefined) {
      //						//Create Roles
      //						console.log('have to create a new role set');
      //					} else {
      //						//Return Roles
      //						console.table(roles);
      //vm.selectedRoles = roles;
      //return vm.selectedRoles;
      //					}
      //	});
    };

    //vm.updateAssignedRoles = function () {
    //    alert('yo yo yo');
    //	datacontext.save();
    //};

    vm.createNewUser = function () {
      $location.path('/employee-profile/add'); //TODO whg Should probably be a separate page for employee add
    };

    vm.saveChanges = function () {
      //alert('calling this stuff0');
      //$http.get(config.remoteApiName + 'Account/GetUserRolesByUserId/' + vm.selectedUser.email + "/")
      var source = {
        'roleId': '1',
        'name': 'fake'
      };
      console.log(source);
      $http.post(config.apiPath + 'api/Account/PutRoles', source);
      //datacontext.save();
    };

  }
})();
