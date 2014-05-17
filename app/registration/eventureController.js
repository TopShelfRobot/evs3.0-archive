(function(){

    function controller(scope, eModel, regModel){

        eModel.getEventures()
            .then(function(list){
                scope.eventures = list;
            });

    }

    angular.module("app").controller("EventureController", ["$scope", "EventureModel", "RegistrationModel", controller]);

})();
