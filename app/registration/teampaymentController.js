(function(){

    function controller(scope, eventureModel, cartModel){

        console.log("cartModel:", cartModel);

        scope.teamName = cartModel.teamName;

        scope.remaining;
        console.log(cartModel.eventureId, cartModel.eventureListId);
        eventureModel.getEventureListItem(cartModel.eventureId, cartModel.eventureListId)
            .then(function(item){
                if(item)
                    scope.remaining = item.currentFee - cartModel.currentlyPaid;
            });

        scope.allowZeroPayment = cartModel.allowZeroPayment;
        scope.waiverSigned = cartModel.waiverSigned;

        scope.errorMessage = "";

        scope.completeRegistration = function(){
            cartModel.waiverSigned = scope.waiverSigned;

            console.log("wiaverSIgned", cartModel.waiverSigned);
        }
    }


    angular.module("app").controller("TeamPaymentController",
        ["$scope", "EventureModel", "RegistrationCartModel", controller]);

})();
