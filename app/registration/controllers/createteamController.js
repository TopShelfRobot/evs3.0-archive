(function(){

    var minNameLength = 0;
    var minTeamSize = 0;

    angular.module("evReg").controller("CreateTeamController",
                        ["$scope", "$location", "$routeParams", "RegistrationCartModel", controller]);
    function controller($scope, $location, $routeParams, cartModel){

        console.log("cartModel:", cartModel);
		
		cartModel.eventureId = $routeParams.eventureId;
		cartModel.eventureListId = $routeParams.listId;
		cartModel.participantId = $location.search()["uid"];

        $scope.teamName = "";
        $scope.players = [{name : "", email : ""}];

        $scope.addPlayer = function() {
            $scope.players.push({ name: "", email: "" });
        };

        $scope.makeTeam = function() {
            var valid = true;
            cartModel.teamName = $scope.teamName || "";
            if (cartModel.teamName.length < minNameLength) {
                // make name red
                valid = false;
            }
            
            cartModel.teamMembers = [];
            for (var i = 0; i < $scope.players.length; i++) {
                var name, email;
                if ($scope.players[i].name.length > minNameLength && $scope.players[i].email) {
                    cartModel.teamMembers.push({ name: $scope.players[i].name, email: $scope.players[i].email });
                } else if ($scope.players[i].name.length == 0 && $scope.players[i].email.length == 0) {
                    // ignore this entry
                    // it's still valid
                } else {
                    // make line red
                    valid = false;
                }
            }
            
            if (cartModel.teamMembers.length < minTeamSize) {
                // do something
                valid = false;
            }

            if (valid) {
				$location.search("uid", null);
                $location.path("/eventure/1/list/1/team/" + cartModel.teamId + "/payment");
            }
        };
    }

   
})();
