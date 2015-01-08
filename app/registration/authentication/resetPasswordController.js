'use strict';
;(function () {

    var controllerId = "resetPasswordController";

    function Controller($scope, $location, $timeout, authService, common) {

        $scope.message = "";

        $scope.token = $location.search().userId;

        $scope.registration = {
            email: "",
            password: "",
            confirmPassword: "",
            code: $scope.token
        };

        common.activateController(controllerId);

        $scope.resetPassword = function () {
            console.log($scope.registration);
           
            authService.resetPassword($scope.registration).then(function (response) {

                $scope.savedSuccessfully = true;
                $scope.message = "User has been registered successfully, you will be redirected to login page in 2 seconds.";
                startTimer();
            },
            function (response) {
                var errors = [];
                for (var key in response.data.modelState) {
                    for (var i = 0; i < response.data.modelState[key].length; i++) {
                        errors.push(response.data.modelState[key][i]);
                    }
                }
                $scope.message = "Failed to register user due to:" + errors.join(' ');
            });
        };

        var startTimer = function () {
            var timer = $timeout(function () {
                $timeout.cancel(timer);
                $location.path('/login');
            }, 2000);
        };

    }

    angular.module("evReg").controller(controllerId, ['$scope', '$location', '$timeout','authService', 'common', Controller]);
})();
