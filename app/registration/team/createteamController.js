(function () {
	'use strict';
	var minNameLength = 0;
	var minTeamSize = 0;

	var controllerId = 'CreateTeamController';

	function controller($scope, $location, $routeParams, cartModel, datacontext, common) {

		$scope.cart = cartModel;

		$scope.team = {};
		$scope.team.teamName = '';
    $scope.team.teamMembers = [];
		$scope.players = [{
			name: '',
			email: '',
			position: ''
		}];

		$scope.addPlayer = function () {
			$scope.players.push({
				name: '',
				email: '',
				position: ''
			});
		};

    function getEventure () {
      datacontext.eventure.getEventureById($routeParams.eventureId)
        .then(function (data) {
          $scope.eventure = data;
          return data;
        });
    }

    function getEventureList () {
      datacontext.eventure.getEventureListById($routeParams.listId)
        .then(function (data) {
          $scope.eventureList = data;
          return data;
        });
    }

		function getActiveGroups () {
			datacontext.eventure.getGroupsActiveByEventureListId($routeParams.listId)
				.then(function (data) {
					$scope.groups = data;
					return $scope.groups;
				});
		}

    function getParticipant () {
      var partId = $location.search()['uid'];
      if (!partId) {
        partId = cart.houseId;
      }
      return datacontext.participant.getParticipantById(partId)
        .then(function (result) {
          $scope.participant = result;
          console.log($scope.participant);
        });
    }

		var promises = [getEventure(), getEventureList(), getActiveGroups(), getParticipant()];
		common.activateController(promises, controllerId);

		$scope.makeTeam = function () {
			var valid = true;
			if ($scope.team.teamName.length < minNameLength) {
				// make name red
				valid = false;
			}

      $scope.team.teamMembers = [];
			for (var i = 0; i < $scope.players.length; i++) {
				var name, email;
				if ($scope.players[i].name.length > minNameLength && $scope.players[i].email) {

					$scope.team.teamMembers.push({
						name: $scope.players[i].name,
						email: $scope.players[i].email,
						position: $scope.players[i].position
					});

        } else if ($scope.players[i].name.length === 0 && $scope.players[i].email.length === 0) {
					// ignore this entry
					// it's still valid
				} else {
					// make line red
					valid = false;
				}
			}

			if ($scope.team.teamMembers.length < minTeamSize) {
				// do something
				valid = false;
			}

			if (valid) {
        console.log($scope.team);
				cartModel.addRegistration($scope.eventure, $scope.eventureList, $scope.participant, null, $scope.groupId, null, 1, $scope.team);
				$location.$$search = {};
				$location.path("/eventure");
			}
		}



		// $scope.makeTeam = function () {
		// 	var valid = true;
		// 	cartModel.teamName = $scope.team.teamName || '';
		// 	if (cartModel.teamName.length < minNameLength) {
		// 		// make name red
		// 		valid = false;
		// 	}
		//
		// 	cartModel.teamMembers = [];
		// 	for (var i = 0; i < $scope.players.length; i++) {
		// 		var name, email;
		// 		if ($scope.players[i].name.length > minNameLength && $scope.players[i].email) {
		// 			cartModel.teamMembers.push({
		// 				name: $scope.players[i].name,
		// 				email: $scope.players[i].email,
		// 				position: $scope.players[i].position
		// 			});
		// 		} else if ($scope.players[i].name.length === 0 && $scope.players[i].email.length === 0) {
		// 			// ignore this entry
		// 			// it's still valid
		// 		} else {
		// 			// make line red
		// 			valid = false;
		// 		}
		// 	}
		//
		// 	if (cartModel.teamMembers.length < minTeamSize) {
		// 		// do something
		// 		valid = false;
		// 	}
		//
		// 	if (valid) {
		// 		$location.search('uid', null);
		// 		$location.path('/eventure/' + cartModel.eventureId +
		// 			'/list/' + cartModel.eventureListId +
		// 			'/team/' + cartModel.teamId + '/payment');
		// 	}
		// };

	}

	angular.module('evReg').controller(controllerId, ['$scope', '$location',
    '$routeParams', 'CartModel', 'datacontext', 'common', controller]);

})();
