'use strict';
;(function () {

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

            authService.saveRegistration($scope.registration).then(function (response) {

                $scope.savedSuccessfully = true;
                $scope.message = "User has been registered successfully, you will be redirected in 2 seconds.";
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
                authService.login($scope.registration).then(function() {
                        $scope.authentication = authService.authentication;

                        datacontext.participant.getParticipantByEmailAddress($scope.authentication.userName, cart.ownerId)
                            .then(function (data) {
                                if (data === null || typeof data === 'undefined') {
                                    $location.path('/part');
                                }
                                else {

                                    if (requestPath === '/dash.html') {
                                        // set login in stuff for dash side
                                        $location.path('/eventurecenter');
                                    }
                                    else {
                                        cart.houseId = data.id;
                                        $location.path(cart.navUrl);
                                        //this is wil's trying to pass in path
                                        //if (typeof $scope.requestPath === 'undefined') {
                                        //    cart.houseId =
                                        //    $location.path('/eventure');
                                        //}
                                        //else {
                                        //    window.location.href = $scope.requestPath;
                                        //}
                                    }
                                }
                            });
                    },
                    function (err) {
                        $scope.message = err.error_description;
                    });
            }, 2000);
        };
    }
   
    angular.module("evReg").controller(controllerId, ['$scope', '$location', '$timeout', 'authService', 'datacontext', 'CartModel', 'common', Controller]);
})();
