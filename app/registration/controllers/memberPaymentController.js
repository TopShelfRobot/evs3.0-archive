(function(){

    angular.module("evReg").controller("MemberPaymentController",
        ["$scope", "$routeParams", "datacontext", "StripeService", "MemberCartModel", Controller]);

    function Controller($scope, $routeParams, datacontext, stripe, cartModel){
        var controller = {};

        datacontext.team.getTeamMemberPaymentInfoByTeamMemberGuid($scope.teamMemberGuid)
            .then(function(data){
                // console.log("team:", team);
                if(data) {
                    cartModel.teamMemberId = data.teamMemberId;
                    $scope.teamName = data.teamName;
                    $scope.listName = data.listName;
                    $scope.remaining = data.PaymentSum - data.regAmount;
                    $scope.suggested = $scope.remaining / data.memberCount;
                }
                else {
                    alert("Invalid Team Id! Please contact your team's coach.");
                }
            });

        console.log("MemberPaymentController:", $scope);

        $scope.allowZeroPayment = cartModel.allowZeroPayment;
        $scope.waiverSigned = false;
        $scope.userPaying = $scope.suggested;
        $scope.teamMemberGuid = $routeParams.teamMemberGuid;

        // $scope.checkout = function() {
        //     var payment = $scope.userPaying;
        //     var order = cartModel.order(payment);
        //     stripe.checkout(payment, order);
        // };

        $scope.checkout = function () {
            var cartOrder = cartModel.order($scope.userPaying);

            stripe.checkout(cartOrder.orderAmount)
                .then(function(res){
                    console.log(res);
                    cartOrder.stripeToken = res.id;
                    $http.post(config.apiPath + "/api/Payment/PostTeamPayment", cartOrder)
                        .success(function(data){
                            console.log("success");
                        })
                        .error(function(err){
                            console.error("ERROR:", err.toString());
                        })
                        .finally(function(){
                            $.unblockUI();
                        });
                });
        };

        return controller;
    }

})();
