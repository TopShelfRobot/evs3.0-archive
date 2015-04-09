(function(){

    var controllerId = "HeaderController";

    function controller($scope, $location, config, datacontext, cart, authService, common) {

        //console.log('activate header');

        var requestPath = window.location.pathname;

        $scope.cart = cart;

        $scope.eventureName = cart.regSettings.eventureName;
        $scope.listName = cart.regSettings.listName;

        $scope.logOut = function () {
            authService.logOut();
            $location.path('/eventure');
        }

        //console.log($scope.authentication.isAuth);

        $scope.authentication = authService.authentication;
        //console.log('after auth');
        //console.log($scope.authentication.isAuth);
        //console.log($scope.authentication.userName);


        //console.log($scope.authentication.isAuth);
        //console.log($scope.authentication.userName);

        //$scope.isAuth = authService._authentication.isAuth;

        var promises = [];

        if ($scope.authentication.isAuth) {

            promises.push(
                datacontext.participant.getParticipantByEmailAddress($scope.authentication.userName, cart.ownerId)
                    .then(function (data) {

                        if (data === null || typeof data === 'undefined') {
                            //alert('not here i exist');
                            //get participant data
                            $location.path('/new-user/add');
                        }
                        else {
                            //console.log(data);
                            //alert(data.id);
                            //write house id to cart

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
                    })
            );
        }
        common.activateController(promises, controllerId);
    }

    angular.module("evReg").controller(controllerId, ["$scope", "$location", "config", "datacontext", "CartModel", "authService", "common", controller]);

})();
