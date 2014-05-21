(function(){

    function controller(scope, eModel, regModel){

        var all = [];
        var viewLength = 10;
        var currentPage = 0;
        eModel.getEventures()
            .then(function(list){
                all = list;
                scope.eventures = all.slice(0, viewLength);
            });

        scope.nextPage = function(){
            if(all.length >= (currentPage + 1) * viewLength){
                currentPage++;
                scope.eventures = all.slice(currentPage * viewLength, (currentPage + 1) * viewLength);
            }
        }

        scope.prevPage = function(){
            if(currentPage != 0){
                currentPage--;
                scope.eventures = all.slice(currentPage * viewLength, (currentPage + 1) * viewLength);
            }
        }
    }

    angular.module("app").controller("EventureController", ["$scope", "EventureModel", "RegistrationModel", controller]);

})();
