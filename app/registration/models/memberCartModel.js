(function(){

    function Model($http, $routeParams){

        var model = {};

        model.eventureId = $routeParams.eventureId || null;
        model.eventureListId = $routeParams.listId || null;
        model.teamId = null;                                  // $routeParams.teamId || null;
        model.memberId = null;                                // $routeParams.memberId || null;
        model.waiverSigned = false;
        model.allowZeroPayment = true;

        model.order = function (value) {
            var order = {
                orderAmount: Number(value),
                //teamId: model.teamId,
                teamMemberId: model.teammemberId
                //ownerId: 1,
                //orderType: "playerreg",
            };
            return order;
        };


        // // Submits orders to be processed by the backend.
        // model.submitOrder = function (token, value) {
        //
        //     alert('submitting');
        //
        //     console.log("token value:", token, value);
        //     var order = {
        //         token: token,
        //         eventureId: model.eventureId,
        //         eventureListId: model.eventureListId,
        //         participantId: model.participantId,
        //         payment: value
        //     };
        //
        //     var uri = "/api/team/" + model.teamId + "/member/" + model.memberId + "/payment";
        //
        //     console.log(order, uri);
        //     return $http.post(uri,
        //         order, { headers: { "Content-Type": "application/json" } });
        //     // expected response:
        //     // var response = {
        //     //     teamId : "1233534656"
        //     // }
        // };
        //
        return model;
    }

    angular.module("evReg").service("MemberCartModel", ["$http", "$routeParams", Model]);
})()
