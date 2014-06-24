(function(){

    function Model($http, $routeParams, config){

        var model = {};

        model.eventureId = $routeParams.eventureId || null;
        model.eventureListId = $routeParams.listId || null;
        model.participantId = $routeParams.uid || null;
        model.waiverSigned = false;
        model.teamName;
        model.teamMembers = [];
        model.teamId = "tbd";
        model.currentlyPaid = 0;
        model.allowZeroPayment = false;

        // Submits orders to be processed by the backend.
        model.submitOrder = function(token, value) {
            // var order = {
            //     token : token,
            //     eventureId : model.eventureId,
            //     eventureListId : model.eventureListId,
            //     participantId : model.participantId,
            //     teamName : model.teamName,
            //     teamMembers : model.teamMembers,
            //     payment : value
            // };

            var order = {
                orderAmount: Number(value),
                orderToken: token,
                orderHouseId: model.participantId,
                ownerId: 1,
                regs: [
                    {
                        eventureListId: model.eventureListId,
                        partId: model.participantId,
                        fee: Number(value),
                        quantitiy: 1,
                        orderType: "teamreg"
                    }
                ]
            };
            alert('sending order');
            console.log(order);
            return $http.post("http://evs30api.eventuresports.info/api/Payment/PostTest", order);
            // expected response:
            // var response = {
            //     teamId : "1233534656"
            // }
        };

        return model;
    }

    angular.module("app").service("RegistrationCartModel", ["$http", "$routeParams", "config", Model]);
})()
