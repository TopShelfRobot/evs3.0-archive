(function(){

    var controllerId = 'MemberPaymentController';

    function Controller($scope, $routeParams, $q, datacontext, stripe, cartModel, common){
        var controller = {};
        $scope.allowZeroPayment = cartModel.allowZeroPayment;
        $scope.waiverSigned = false;
        $scope.userPaying = $scope.suggested;
        $scope.teamMemberGuid = $routeParams.teamMemberGuid;
        $scope.teamGuid = $routeParams.teamGuid;
    
        //$q.all([datacontext.team.getTeamMemberPaymentInfoByTeamMemberGuid($scope.teamMemberGuid),
        //            datacontext.team.getNotPaidTeamMemberCountByTeamGuid($scope.teamGuid),
        //            datacontext.team.getTeamMemberPaymentSumByTeamGuid($scope.teamGuid)])  //$scope.teamMemberGuid
        //    .then(function(data){
        //        // console.log("team:", team);
        //        if(data) {
        //            cartModel.teamMemberId = data.teamMemberId;
        //            $scope.teamName = data.name;
        //            $scope.listName = data.listName;
        //            $scope.remaining = data.regAmount;  // - data.PaymentSum;
        //            $scope.suggested = $scope.remaining; // / data.memberCount;
        //        }
        //        else {
        //            alert("Invalid Team Id! Please contact your team's coach.");
        //        }
        //    });
       
        activate();

        function activate() {
            var promises = [datacontext.team.getTeamMemberPaymentInfoByTeamMemberGuid($scope.teamMemberGuid),
                   datacontext.team.getNotPaidTeamMemberCountByTeamGuid($scope.teamGuid),
                   datacontext.team.getTeamMemberPaymentSumByTeamGuid($scope.teamGuid)];

            common.activateController(promises, controllerId)
                .then(function () { log('Activated Listing Detail View'); });
        }
        

        $q.all([datacontext.team.getTeamMemberPaymentInfoByTeamMemberGuid($scope.teamMemberGuid),
                   datacontext.team.getNotPaidTeamMemberCountByTeamGuid($scope.teamGuid),
                   datacontext.team.getTeamMemberPaymentSumByTeamGuid($scope.teamGuid)])  //$scope.teamMemberGuid
           .then(function (data) {
               // console.log("team:", team);
               if (data) {
                   cartModel.teamMemberId = data.teamMemberId;
                   $scope.teamName = data.name;
                   $scope.listName = data.listName;
                   $scope.remaining = data.regAmount;  // - data.PaymentSum;
                   $scope.suggested = $scope.remaining; // / data.memberCount;
               }
               else {
                   alert("Invalid Team Id! Please contact your team's coach.");
               }
           });

        console.log("MemberPaymentController:", $scope);

       

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
    angular.module("evReg").controller(controllerId,
        ["$scope", "$routeParams", "$q", "datacontext", "StripeService", "MemberCartModel", "common", Controller]);
})();
