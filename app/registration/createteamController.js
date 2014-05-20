(function(){

    function controller(scope, $location, model){
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

        scope.makeTeam = function(){
            model.makeTeam()
                .then(function(){
                    $location.path("/eventure/1/list/1/team/1/payment");
                });
        }
    }

    angular.module("app").controller("CreateTeamController", ["$scope", "$location", "RegistrationModel", controller]);
})();
