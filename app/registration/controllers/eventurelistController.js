(function(){

    function controller($scope, $location, $routeParams, config, cartModel, datacontext){
		
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
	        .then(function(list){
				
	            $scope.participantId = list[0].houseId;
	            $scope.participants = list;
	        });

        $scope.register = function(eventure, eventureList){
            cartModel.currentParticipantId = $scope.participantId;
            cartModel.currentEventure = eventure;
            cartModel.currentEventureList = eventureList;
			
			if(eventure.IsTeam){
	            $location.path("/eventure/" + cartModel.currentEventure.id + "/list/" + cartModel.currentEventureList.id + "/team")
	                .search("uid", cartModel.currentParticipantId);
			}else{
	            $location.path("/eventure/" + cartModel.currentEventure.id + "/list/" + cartModel.currentEventureList.id + "/questions")
	                .search("uid", cartModel.currentParticipantId);
			}
        }
    }

    angular.module("evReg").controller("EventureListController",
        ["$scope", "$location", "$routeParams", "config", "RegistrationCartModel", "datacontext", controller]);

})();
