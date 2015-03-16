;
(function () {
    'use strict';

    var controllerId = "signupController";

    function Controller($scope, $location, $timeout, authService, datacontext, cart, common) {

        $scope.savedSuccessfully = false;
        $scope.message = "";

        $scope.registration = {
            userName: "",
            password: "",
            confirmPassword: ""
        };

        $scope.isDash = false;

        var requestPath = window.location.pathname;

        if (requestPath === '/dash.html') {
            $scope.isDash = true;
        }

        common.activateController(controllerId);

        $scope.signUp = function () {

            //alert('yo yoy yo');
            authService.saveRegistration($scope.registration, true).then(function (response) {

                $scope.savedSuccessfully = true;
                $scope.message = "User has been registered successfully, you will be redirected in 2 seconds.";
                $scope.message = authService.startTimer($scope.registration);
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
    }

    angular.module("evReg").controller(controllerId, ['$scope', '$location', '$timeout', 'authService', 'datacontext', 'CartModel', 'common', Controller]);
})();
