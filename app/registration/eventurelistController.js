(function(){

    function controller(scope, $params, eModel, regModel, partModel){


        eModel.getEventure($params.eventureId)
            .then(function(eventure){
                console.log("here:", eventure);
                scope.eventure = eventure;
            });

        eModel.getEventureList($params.eventureId)
            .then(function(list){
                scope.list = list;
                scope.selection = scope.list[0];
            });

        partModel.getAll()
            .then(function(list){
                console.log("participants:", list);
            });

    }

    angular.module("app").controller("EventureListController", ["$scope", "$routeParams", "EventureModel", "RegistrationModel", "ParticipantModel", controller]);

})();
