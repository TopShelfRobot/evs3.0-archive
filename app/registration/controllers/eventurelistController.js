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
            cartModel.currentEventureId = eventure.id;
            cartModel.currentEventureListId = eventureList.id;
			
			if(eventure.asdf){
	            $location.path("/eventure/" + cartModel.currentEventureId + "/list/" + cartModel.currentEventureListId + "/team")
	                .search("uid", cartModel.currentParticipantId);
			}else{
	            $location.path("/eventure/" + cartModel.currentEventureId + "/list/" + cartModel.currentEventureListId + "/questions")
	                .search("uid", cartModel.currentParticipantId);
			}
        }
    }

    angular.module("evReg").controller("EventureListController",
        ["$scope", "$location", "$routeParams", "config", "RegistrationCartModel", "datacontext", controller]);

})();
