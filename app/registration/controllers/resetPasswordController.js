'use strict';
;(function () {

    var controllerId = "resetPasswordController";

    function Controller($scope, authService, common) {

        $scope.message = "";

        $scope.registration = {
            userName: "",
            password: "",
            confirmPassword: ""
        };

        common.activateController(controllerId);

        $scope.requestPassword = function () {

        };

    }

    angular.module("evReg").controller(controllerId, ['$scope', 'authService', 'common', Controller]);
})();
