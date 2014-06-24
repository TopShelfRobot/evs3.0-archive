(function(){

    function controller($scope, $location, Stripe, eventureModel, cartModel){

        console.log("cartModel:", cartModel);

        $scope.teamName = cartModel.teamName;

        $scope.remaining;
        console.log(cartModel.eventureId, cartModel.eventureListId);
        eventureModel.getEventureListItem(cartModel.eventureId, cartModel.eventureListId)
            .then(function(item){
                if(item)
                    $scope.remaining = item.currentFee - cartModel.currentlyPaid;
            });

        $scope.allowZeroPayment = cartModel.allowZeroPayment;
        // $scope.waiverSigned = cartModel.waiverSigned;

        $scope.errorMessage = "";

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
                    return cartModel.submitOrder(token, $scope.userPaying);
                })
                .then(function(response){
                    $location.path("/eventure/" + cartModel.eventureId + "/list/" + cartModel.eventureListId + "/team/" + response.teamId + "/receipt");
                })
                .catch(function(msg){
                    $scope.errorMessage = "There was an error with your transaction:" + msg.toString();
                });
        }
    }

    angular.module("evReg").controller("TeamPaymentController",
        ["$scope", "$location",
            "StripeService", "EventureModel", "RegistrationCartModel",
            controller]);

})();
