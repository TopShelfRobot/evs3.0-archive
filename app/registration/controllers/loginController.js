'use strict';
(function () {

    var controllerId = "loginController";

    function controller($scope, $location, authService, common) {

        $scope.loginData = {
            userName: "",
            password: ""
        };

        $scope.message = "";

        common.activateController(controllerId);

        $scope.login = function () {
            
            authService.login($scope.loginData).then(function (response) {
                alert('we are logged oin...  go someplace');
                //$location.path('/orders');

            },
                 function (err) {
                     $scope.message = err.error_description;
                 });
        };
      
    }
    
   

    angular.module("evReg").controller(controllerId, ["$scope", "$location", "authService", "common", controller]);
})();
