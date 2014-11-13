(function(){

    var controllerId = "HeaderController";

    function controller($scope, config, datacontext, cartModel, common) {

        $scope.cart = cartModel;

        $scope.isAuth = config.isAuth;

        var promises = [];
        promises.push(
            datacontext.participant.getOwnerById(config.owner.ownerId)
                .then(function(data){
                    $scope.owner = data;
                })
        );

        common.activateController(promises, controllerId);

    }

    angular.module("evReg").controller(controllerId, ["$scope", "config", "datacontext", "CartModel", "common", controller]);

})();
