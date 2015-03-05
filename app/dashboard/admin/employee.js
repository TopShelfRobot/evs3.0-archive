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
                    name: roles[i]   //,
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

        vm.updateUserRoles = function () {
            console.log('selectedEmployee:', vm.selectedUser.email);
            $http.get(config.remoteApiName + 'Account/GetUserRolesByUserId/' + vm.selectedUser.email + '/')
              .then(function (roles) {
                  vm.selectedRoles = roles.data;
              });
        };

        vm.createNewUser = function () {
            $location.path('/add-employee');
        };

        vm.saveChanges = function () {
            var source = {
                'userName': vm.selectedUser.email,
                'roles': vm.selectedRoles
            };
            $http.post(config.apiPath + 'api/Account/PutRoles', source);
            datacontext.save();
        };

    }
})();
