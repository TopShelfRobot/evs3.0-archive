(function () {
    angular.module("evReg").service("RegistrationCartModel",
                ["$http", "$routeParams", "$location", "config", Model]);
    function Model($http, $routeParams, $location, config) {

        var model = {};

        model.eventureId = null;
        model.eventureListId = null;
        model.participantId = null;
        model.waiverSigned = false;
        model.fee = 0;
        model.teamName='';
        model.teamMembers = [];
        model.teamId = "tbd";
        model.currentlyPaid = 0;
        model.allowZeroPayment = false;

        model.order = function (value) {
            var order = {
                orderAmount: Number(value),
                orderHouseId: model.participantId,
                ownerId: 1,      //config.owner.ownerId,  //mjb
                regs: [{
                    regType: "teamreg",
                    eventureListId: model.eventureListId,
                    houseId: model.participantId,        // config.owner.houseId,   this will be ok once cart are consolidated
                    partId: model.participantId,
                    fee: Number(model.fee), //total cost of registration
                    quantity: 1,
                    teamName: model.teamName,
                    teamMembers : model.teamMembers
                }]
            };
            return order;
        };

        // Submits orders to be processed by the backend.
        // model.submitOrder = function (token, value) {
        //
        //     var order = model.order(value);
        //     alert('sending order');
        //     console.log(order);
        //     return $http.post(config.apiPath + "api/Payment/PostTeam", order);
        // };

        return model;
    }


})()
