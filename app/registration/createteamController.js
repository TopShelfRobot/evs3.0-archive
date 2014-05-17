(function(){

    function controller(scope, model){
        console.log("CreateTeamController here");

        scope.teamName = model.teamName;

        scope.players = model.players;

        scope.addPlayer = function(name, email){
            // push it to the array
            model.players.push({name : name, email : email});
            // clear the input boxes
            scope.addName = "";
            scope.addEmail = "";
        }
    }

    angular.module("app").controller("CreateTeamController", ["$scope", "RegistrationModel", controller]);
})();
