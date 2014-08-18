(function(){
    angular.module("evReg").controller("EventureListController",
                    ["$scope", "$location", "$routeParams", "config", "CartModel", "datacontext", controller]);
    
    function controller($scope, $location, $routeParams, config, cartModel, datacontext){
		
		$scope.cart = cartModel;
		
		datacontext.eventure.getEventureById($routeParams.eventureId)
	        .then(function(item){
	            $scope.eventure = item;
	        });
		
        datacontext.eventure.getEventureListsByEventureId($routeParams.eventureId)
	        .then(function(list){
	            $scope.list = list;
	            $scope.selection = $scope.list[0];
	        });

		datacontext.participant.getParticipantsByHouseId(config.owner.houseId)
	        .then(function(list) {
	            $scope.selectedParticipant = list[0];
	            $scope.participants = list;
	        });

        $scope.register = function(eventure, eventureList, participant) {
             //cartModel.setCurrentParticipant(participant);
             //cartModel.setCurrentEventure(eventure);
            //cartModel.setCurrentEventureList(eventureList);
            cartModel.fee = $scope.selection.currentFee;
            //console.log("fee:", cartModel.fee);

            //$location.path("/eventure/" + eventure.id + "/list/" + eventureList.id + "/questions")
			//	.search("uid", participant.id);

            $location.path("/eventure/" + eventure.id + "/list/" + eventureList.id + "/team")
                    .search("uid", participant.id);

            //if (eventure.IsTeam) {
            //    $location.path("/eventure/" + eventure.id + "/list/" + eventureList.id + "/team")
            //        .search("uid", participant.id);
            //} else {
            //    $location.path("/eventure/" + eventure.id + "/list/" + eventureList.id + "/questions")
            //        .search("uid", participant.id);
            //}
        };
    }
})();
