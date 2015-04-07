;
(function () {

    var controllerId = "EditTeamController";

    function Controller($scope, $location, $routeParams, $window, $http, config, common, datacontext) {

        var team = null;

        function getTeam() {
            return datacontext.team.getTeamById($routeParams.teamId)
              .then(function (result) {
                  team = result;
                  $scope.team = team;
                  console.log("Team:", $scope.team);

              });
        }

        function getPlayers() {
            return datacontext.team.getTeamMembersByTeamId($routeParams.teamId)
              .then(function (members) {
                  console.log("members:", members);
                  // $scope.players = members;
                  $scope.players = [];
                  var player;
                  for (var i = 0; i < members.length; i++) {
                      player = members[i];
                      $scope.players.push(player);
                  }
              });
        }

        var promises = [
       getTeam(),
       getPlayers()
        ];
        common.activateController(promises, controllerId)
          .then(function () { })
          .finally(function () { });

        $scope.addPlayer = function (name, email) {
            $scope.players.push({
                name: null,
                email: null,
                position: null
            });
        };

        $scope.editTeam = function () {
            var item = [];
            team.name = $scope.team.name;
            for (var i = 0; i < $scope.players.length; i++) {
                if (typeof $scope.players[i].id == "undefined") {
                    if ($scope.players[i].name && $scope.players[i].email) {
                        item.push(datacontext.team.addTeamMember({
                            teamId: $routeParams.teamId,
                            name: $scope.players[i].name,
                            email: $scope.players[i].email,
                            position: $scope.players[i].position,
                            active: true
                        }));
                    }
                }
            }
            console.log(datacontext);
            datacontext.save()
                  .then(function () {
                     for (var i = 0; i < item.length; i++) {
                         $http.post(config.apiPath + 'api/mail/SendTeamPlayerInviteMail/' + item[i].id);
                      }
                  })
            .then(function () {
                $window.history.back();
            });
        };
    }

    angular.module("evReg").controller(controllerId, ["$scope", "$location", "$routeParams", "$window", "$http","config", "common", "datacontext", Controller]);
})();
