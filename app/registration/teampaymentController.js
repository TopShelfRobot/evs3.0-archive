(function(){

    function controller(scope, model){
        console.log("TeamPaymentController entered");

        console.log("model:", model);

        scope.teamName = model.teamName;

        scope.remaining = function(){
            return model.totalCost - model.currentlyPaid;
        }

        scope.userPaying = model.userPaying;
    }


    angular.module("app").controller("TeamPaymentController", ["$scope", "RegistrationModel", controller]);

})();
