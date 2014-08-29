(function(){

    var controllerId = 'MemberPaymentController';

    function Controller($scope, $routeParams, $q, $http, datacontext, stripe, cartModel, common, config){
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
            var promises = [getTeamInfo()];

            common.activateController(promises, controllerId)
                .then(function () {
                    //log('Activated Listing Detail View');

                });
        }

        function getTeamInfo() {
            $q.all([datacontext.team.getTeamMemberPaymentInfoByTeamMemberGuid($scope.teamMemberGuid),
                       datacontext.team.getNotPaidTeamMemberCountByTeamGuid($scope.teamGuid),
                       datacontext.team.getTeamMemberPaymentSumByTeamGuid($scope.teamGuid)])  //$scope.teamMemberGuid
               .then(function (data) {
                    //console.log("team:", team);
                    if (data) {
                        var payment = data[0];
                        var count = data[1];
                        var sum = data[2];
                        //alert('is this null: ' + payment.teamMemberId);
                        cartModel.teamMemberId = payment.teamMemberId;
                        cartModel.teamId = payment.teamId;
                        $scope.teamName = payment.name;
                        $scope.listName = payment.listName;

                        //console.log("regAmount:", payment.regAmount);
                        //console.log("count:", count);
                        //console.log("team:", sum);
                        $scope.remaining = payment.regAmount - sum;
                        $scope.suggested = $scope.remaining / count;
                        //console.log("remain11:", payment.regAmount - sum);
                        //console.log("remain:", $scope.remaining);
                        //console.log("suggest:", $scope.suggested);

                       //cartModel.teamMemberId = data.teamMemberId;
                       //$scope.teamName = data.name;
                       //$scope.listName = data.listName;
                       //$scope.remaining = data.regAmount;  // - data.PaymentSum;
                       //$scope.suggested = $scope.remaining; // / data.memberCount;
                   }
                   else {
                       alert("Invalid Team Id! Please contact your team's coach.");
                   }
               });
        }



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
                    cartOrder.orderToken = res.id;
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
        ["$scope", "$routeParams", "$q", "$http", "datacontext", "StripeService", "MemberCartModel", "common","config", Controller]);
})();
