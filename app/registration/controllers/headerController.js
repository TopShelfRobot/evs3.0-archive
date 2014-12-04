(function(){

    var controllerId = "HeaderController";

    function controller($scope, $location, config, datacontext, cart, authService, common) {

        //$scope.cart = cart;

        $scope.logOut = function () {
            authService.logOut();
            $location.path('/eventure');
        }

        $scope.authentication = authService.authentication;

        console.log($scope.authentication.isAuth);

        //$scope.isAuth = authService._authentication.isAuth;

        var promises = [];
        promises.push(
            datacontext.participant.getOwnerById(cart.ownerId)
                .then(function(data){
                    $scope.owner = data;
                })
        );

        common.activateController(promises, controllerId);

    }

    angular.module("evReg").controller(controllerId, ["$scope", "$location", "config", "datacontext", "CartModel", "authService", "common", controller]);

})();
