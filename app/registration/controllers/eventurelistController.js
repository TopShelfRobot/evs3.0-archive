(function(){

    function controller($scope, $location, $routeParams, config, cartModel, datacontext){
		
		$scope.cart = cartModel;
		
		datacontext.getEventureById($routeParams.eventureId)
	        .then(function(item){
	            $scope.eventure = item;
	        });
		
		datacontext.getEventureListsByEventureId($routeParams.eventureId)
	        .then(function(list){
	            $scope.list = list;
	            $scope.selection = $scope.list[0];
	        });

		datacontext.getParticipantsByHouseId(config.owner.houseId)
	        .then(function(list) {

	            $scope.selectedParticipant = list[0];
	            $scope.participants = list;
	        });

        $scope.register = function(eventure, eventureList, participant) {
            cartModel.setCurrentParticipant(participant);
            cartModel.setCurrentEventure(eventure);
            cartModel.setCurrentEventureList(eventureList);

            $location.path("/eventure/" + eventure.id + "/list/" + eventureList.id + "/team");

            //if (eventure.IsTeam) {
            //    $location.path("/eventure/" + eventure.id + "/list/" + eventureList.id + "/team")
            //        .search("uid", participant.id);
            //} else {
            //    $location.path("/eventure/" + eventure.id + "/list/" + eventureList.id + "/questions")
            //        .search("uid", participant.id);
            //}
        };
    }

    angular.module("evReg").controller("EventureListController",
        ["$scope", "$location", "$routeParams", "config", "CartModel", "datacontext", controller]);

})();
