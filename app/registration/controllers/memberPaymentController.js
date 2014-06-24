(function(){

    function Controller($scope, TeamModel, Stripe, cartModel){
        var controller = {};

        console.log("MemberPaymentController:", $scope);

        $scope.allowZeroPayment = cartModel.allowZeroPayment;
        $scope.waiverSigned = false;
        $scope.userPaying = 30;

        $scope.completeRegistration = function(){
            cartModel.waiverSigned = $scope.waiverSigned;

            Stripe.createToken({
                    name : $scope.name,
                    number: $scope.number,
                    cvc: $scope.cvc,
                    exp_month: $scope.expMonth,
                    exp_year: $scope.expYear
                })
                .then(function(token){
                    console.log("$scope.userPaying", $scope.userPaying);
                    return cartModel.submitOrder(token, $scope.userPaying);
                })
                .then(function(response){
                    $location.path("/eventure/" + cartModel.eventureId + "/list/" + cartModel.eventureListId + "/team/" + response.teamId + "/receipt");
                })
                .catch(function(msg){
                    $scope.errorMessage = "There was an error with your transaction:" + msg.toString();
                });
        }

        TeamModel.getTeamById(2)
            .then(function(team){
                console.log("team:", team);
                $scope.teamName = team.name;
            });

        return controller;
    }

    angular.module("evReg").controller("MemberPaymentController",
        ["$scope", "TeamModel", "StripeService", "MemberCartModel", Controller]);
})();
