(function(){

    function controller(scope, $params, eModel, regModel){


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

    }

    angular.module("app").controller("EventureListController", ["$scope", "$routeParams", "EventureModel", "RegistrationModel", controller]);

})();
