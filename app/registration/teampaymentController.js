(function(){

    function controller(scope, eventureModel, cartModel){

        console.log("cartModel:", cartModel);

        scope.teamName = cartModel.teamName;

        scope.remaining;
        console.log(cartModel.eventureId, cartModel.eventureListId);
        eventureModel.getEventureListItem(cartModel.eventureId, cartModel.eventureListId)
            .then(function(item){
                scope.remaining = item.currentFee - cartModel.currentlyPaid;
            });

        scope.userPaying = model.userPaying;
    }


    angular.module("app").controller("TeamPaymentController",
        ["$scope", "EventureModel", "RegistrationCartModel", controller]);

})();
