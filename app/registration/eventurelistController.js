(function(){

    function controller(scope, $location, $routeParams, eModel, regModel, cartModel, partModel){


        eModel.getEventure($routeParams.eventureId)
            .then(function(eventure){
                scope.eventure = eventure;
            });

        eModel.getEventureList($routeParams.eventureId)
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
            cartModel.participantId = participantId;
            $location.path("/eventure/" + eventureId + "/list/" + listId + "/team");
        }
    }

    angular.module("app").controller("EventureListController",
        ["$scope", "$location", "$routeParams",
            "EventureModel", "RegistrationModel",
            "RegistrationCartModel", "ParticipantModel", controller]);

})();
