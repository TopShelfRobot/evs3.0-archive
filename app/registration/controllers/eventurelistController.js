(function(){

    function controller(scope, $location, $routeParams, eModel,  cartModel, partModel){

        console.log("cartModel:", cartModel);

        eModel.getEventure($routeParams.eventureId)
            .then(function(eventure){
                scope.eventure = eventure;
            });

        eModel.getEventureListAll($routeParams.eventureId)
            .then(function(list){
                scope.list = list;
                scope.selection = scope.list[0];
            });

        partModel.getAll()
            .then(function(list){
                scope.participantId = list[0].houseId;
                scope.participants = list;
            });

        scope.register = function(eventureId, listId){
            cartModel.participantId = scope.participantId;
            cartModel.eventureId = eventureId;
            cartModel.eventureListId = listId;
            $location.path("/eventure/" + eventureId + "/list/" + listId + "/team")
                .search("uid", scope.participantId);
        }
    }

    angular.module("evReg").controller("EventureListController",
        ["$scope", "$location", "$routeParams",
            "EventureModel", "RegistrationCartModel", "ParticipantModel",
            controller]);

})();
