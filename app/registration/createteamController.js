(function(){

    function controller(scope, $location, cartModel){

        console.log("cartModel:", cartModel);
        scope.teamName = cartModel.teamName;
        scope.players = cartModel.teamMembers;

        scope.addPlayer = function(name, email){
            cartModel.addTeamMember(name, email);
            scope.addName = "";
            scope.addEmail ="";
        }

        scope.makeTeam = function(){
            cartModel.teamName = scope.teamName;
            $location.path("/eventure/1/list/1/team/" + cartModel.teamId + "/payment");
        }
    }

    angular.module("app").controller("CreateTeamController",
        ["$scope", "$location", "RegistrationCartModel", controller]);
})();
