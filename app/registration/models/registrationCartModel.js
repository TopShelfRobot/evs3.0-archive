(function(){

    function Model($http, $routeParams, $location, config){

        var model = {};

        model.eventureId = null;
        model.eventureListId = null;
		model.participantId = null;
        model.waiverSigned = false;
        model.teamName;
        model.teamMembers = [];
        model.teamId = "tbd";
        model.currentlyPaid = 0;
        model.allowZeroPayment = false;

        model.order = function (value) {
            var order = {
                orderAmount: Number(value),
                orderHouseId: model.participantId,
                ownerId: 1,
                regs: [
                    {
						regType: "teamreg",
                        eventureListId: model.eventureListId,
                        houseId: config.owner.houseId,
                        partId: model.participantId,
                        fee: Number(value),
                        quantity: 1,
						teamMembers : model.teamMembers,
						teamName : model.teamName,
                    }
                ]
            };
            return order;
        };

        // Submits orders to be processed by the backend.
        model.submitOrder = function(token, value) {
			
			var order = model.order(value);
            alert('sending order');
            console.log(order);
            return $http.post(config.apiPath + "api/Payment/PostTeam", order);
        };

        return model;
    }

    angular.module("evReg").service("RegistrationCartModel", ["$http", "$routeParams", "$location", "config", Model]);
})()
