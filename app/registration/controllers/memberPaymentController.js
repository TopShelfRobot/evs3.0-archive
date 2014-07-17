(function(){

    function Controller($scope, datacontext, stripe, cartModel){
        var controller = {};

        console.log("MemberPaymentController:", $scope);

        $scope.allowZeroPayment = cartModel.allowZeroPayment;
        $scope.waiverSigned = false;
        $scope.userPaying = 30;

        $scope.checkout = function(){
			var payment = $scope.userPaying;
			var order = cartModel.order(payment);
        	stripe.checkout(payment, order);
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
