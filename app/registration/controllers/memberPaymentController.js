(function(){

    function Controller($scope, datacontext, stripe, cartModel){
        var controller = {};

        console.log("MemberPaymentController:", $scope);

        $scope.allowZeroPayment = cartModel.allowZeroPayment;
        $scope.waiverSigned = false;
        $scope.userPaying = 30;

        $scope.checkout = function(){
        	stripe.checkout($scope.userPaying, cartModel);
        }

        datacontext.getTeamById(2)
            .then(function(team){
                console.log("team:", team);
				if(team)
	                $scope.teamName = team.name;
            });

        return controller;
    }

    angular.module("evReg").controller("MemberPaymentController",
        ["$scope", "datacontext", "StripeService", "MemberCartModel", Controller]);
})();
