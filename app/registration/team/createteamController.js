(function () {

  var minNameLength = 0;
  var minTeamSize = 0;

  var controllerId = "CreateTeamController";

  function controller($scope, $location, $routeParams, cartModel, common) {

    console.log("cartModel:", cartModel);

    cartModel.eventureId = $routeParams.eventureId;
    cartModel.eventureListId = $routeParams.listId;
    cartModel.participantId = $location.search()["uid"];

    $scope.team = {};
    $scope.team.name = "";
    $scope.players = [{
      name: "",
      email: "",
      position: ""
    }];

    $scope.formholder = {};

    $scope.addPlayer = function () {
      $scope.players.push({
        name: "",
        email: "",
        position: ""
      });
    };

    var promises = [];
    common.activateController(promises, controllerId);

    $scope.makeTeam = function () {
      var valid = true;

      cartModel.division = $scope.team.division;
      cartModel.timeFinish = $scope.team.timeFinish;
      cartModel.teamName = $scope.team.name || "";
      if (cartModel.teamName.length < minNameLength) {
        // make name red
        valid = false;
      }

      cartModel.teamMembers = [];
      for (var i = 0; i < $scope.players.length; i++) {
        var name, email;
        if ($scope.players[i].name.length > minNameLength && $scope.players[i].email) {
          cartModel.teamMembers.push({
            name: $scope.players[i].name,
            email: $scope.players[i].email,
            position: $scope.players[i].position
          });
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
        $location.path("/eventure/" + cartModel.eventureId + "/list/" + cartModel.eventureListId + "/team/" + cartModel.teamId + "/payment");
      }
    };
  }

  angular.module("evReg").controller(controllerId, ["$scope", "$location", "$routeParams", "RegistrationCartModel", "common", controller]);

})();
