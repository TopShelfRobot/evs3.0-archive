'use strict';
;(function () {

    var controllerId = "forgotPasswordController";

    function Controller($scope, authService, common) {

        $scope.message = "";

        $scope.registration = {
            email: ''  //,
            //password: "",
            //confirmPassword: ""
        };

        common.activateController(controllerId);

        $scope.requestPassword = function () {

            authService.forgotPassword($scope.registration).then(function(response) {
                    $scope.message = 'Please check your email. A link has been provided.';
            },
            function (response) {
               var errors = [];
               for (var key in response.data.modelState) {
                    for (var i = 0; i < response.data.modelState[key].length; i++) {
                        errors.push(response.data.modelState[key][i]);
                    }
               }
               $scope.message = 'Sorry. This user name was not found.';
        });


        };

    }

    angular.module("evReg").controller(controllerId, ['$scope', 'authService', 'common', Controller]);
})();
