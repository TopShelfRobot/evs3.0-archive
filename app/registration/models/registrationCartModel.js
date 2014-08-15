(function(){
    angular.module("evReg").service("RegistrationCartModel",
                ["$http", "$routeParams", "$location", "config", Model]);
    function Model($http, $routeParams, $location, config){

        var model = {};

        model.eventureId = null;
        model.eventureListId = null;
		model.participantId = null;
        model.waiverSigned = false;
        //model.teamName;
        model.teamMembers = [];
        model.teamId = "tbd";
        model.currentlyPaid = 0;
        model.allowZeroPayment = false;

        //var order = {
        //    'orderName': $scope.house.firstName + " " + $scope.house.lastName,
        //    'orderEmail': $scope.house.email,
        //    'orderAmount': cart.getTotalPrice(),
        //    'orderHouseId': $scope.house.id,
        //    'ownerId': $scope.owner.id,
        //    'regs': cart.registrations,
        //    'charges': cart.surcharges
        //};

        model.order = function (value) {
            var order = {
                orderAmount: Number(value),
                orderHouseId: model.participantId,
                ownerId: 1,
                //teamMembers: model.teamMembers,
                regs:[{
						regType: "teamreg33",
                        eventureListId: model.eventureListId,
                        houseId: config.owner.houseId,
                        partId: model.participantId,
                        fee: Number(value),
                        quantity: 1,
						//teamMembers : model.teamMembers,
						teamName : model.teamName
                    }]
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

   
})()
