'use strict';
;(function () {

    var controllerId = "forgotPasswordController";

    function Controller($scope, authService, common) {

        $scope.message = "";

        $scope.registration = {
            email: "boone.mike@gmail.com"  //,
            //password: "",
            //confirmPassword: ""
        };

        common.activateController(controllerId);

        $scope.requestPassword = function () {

            authService.forgotPassword($scope.registration);



        };

    }

    angular.module("evReg").controller(controllerId, ['$scope', 'authService', 'common', Controller]);
})();
