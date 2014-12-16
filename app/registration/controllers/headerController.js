(function(){

    var controllerId = "HeaderController";

    function controller($scope, $location, config, datacontext, cart, authService, common) {

        //$scope.cart = cart;

        $scope.eventureName = cart.regSettings.eventureName;
        $scope.listName = cart.regSettings.listName;

        $scope.logOut = function () {
            authService.logOut();
            $location.path('/eventure');
        }

        $scope.authentication = authService.authentication;

        //console.log($scope.authentication.isAuth);
        //console.log($scope.authentication.userName);

        //$scope.isAuth = authService._authentication.isAuth;

        var promises = [];

        if ($scope.authentication.isAuth) {

            promises.push(
                datacontext.participant.getParticipantByEmailAddress($scope.authentication.userName, cart.ownerId)
                    .then(function (data) {
                        cart.houseId = data.id;
                    })
            );
        }
        common.activateController(promises, controllerId);
    }

    angular.module("evReg").controller(controllerId, ["$scope", "$location", "config", "datacontext", "CartModel", "authService", "common", controller]);

})();
