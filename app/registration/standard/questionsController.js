(function () {

	var controllerId = "QuestionsController";

	function Controller($scope, $location, config, cartModel, datacontext, $routeParams, common) {

		$scope.cart = cartModel;

		$scope.notAllowedToContinue = function () {
			return !$scope.isWaiverChecked;
		};

		$scope.setWaiverChecked = function (val) {
			console.log("setWaiverChecked:", val);
			$scope.isWaiverChecked = val;
		};

		$scope.groups = [];
		$scope.isWaiverChecked = false;
		$scope.quantity = 1;
    
    $scope.addons = [];

		var promises = [];

		promises.push(
			datacontext.question.getCustomQuestionSetByEventureListId($routeParams.listId)
			.then(function (results) {
				//alert(results.length);
				$scope.customQuestions = results;
				$scope.customAnswers = [];
				for (var i = 0; i < results.length; i++) {
					$scope.customAnswers.push({
						questionId: results[i].id,
						answerText: ""
					});
				}
				console.log("Custom Questions:", $scope.customQuestions);
				return results;
			})
		);


		promises.push(
			datacontext.eventure.getGroupsActiveByEventureListId($routeParams.listId)
			.then(function (data) {
				$scope.groups = data;
				if (config.isGroupRequired && groups().length < 1) {
					alert('There are currently no spaces available');
					router.navigateTo("#eventurelist/" + cartModel.currentEventureListId);
				}
				return data;
			})
		);
    
    $scope.addons.push({
      "id":2,
      "name":"Best Dad Coffee Cup",
      "active":true,
      "amount":13.00,
      "addonType":"owner",
      "addonDesc":"This is a best dad coffee cup",
      "eventureId":null,
      "ownerId":1,
      "imagePath":"download.jpeg",
      "dateCreated":"1900-01-01T05:00:00.000",
      "eventure":null,
      quantity: 0
    });
    
    // promises.push(
    //   datacontext.surcharge.getAddonsByEventureId($routeParams.eventureId)
    //     .then(function(data){
    //       data.forEach(function(item){
    //         item.quantity = 0;
    //         $scope.addons.push(item);
    //       });
    //       return $scope.addons;
    //     })
    // );
    //
    // promises.push(
    //   datacontext.surcharge.getAddonsByOwnerId(config.owner.ownerId)
    //     .then(function(data){
    //       data.forEach(function(item){
    //         item.quantity = 0;
    //         $scope.addons.push(item);
    //       });
    //       return $scope.addons;
    //     })
    // );

		//promises.push(
		//    datacontext.question.getStockQuestionSetByEventureListId($routeParams.listId)
		//		.then(function(data){
		//			return data;
		//		})
		//);

		promises.push(
			datacontext.eventure.getEventureListById($routeParams.listId)
			.then(function (data) {
				$scope.eventureList = data;
				return data;
			})
		);

		promises.push(
			datacontext.eventure.getEventureById($routeParams.eventureId)
			.then(function (data) {
				$scope.eventure = data;
				return data;
			})
		);

		promises.push(
			(function () {
				var partId = $location.search().uid;
				if (!partId) {
					partId = cart.houseId;
				}
				return datacontext.participant.getParticipantById(partId)
					.then(function (result) {
						$scope.participant = result;
						return result;
					});
			})()
		);

		common.activateController(promises, controllerId);

		$scope.next = function () {
			if ($scope.questionsForm.$valid) {
				// Submit as normal
				cartModel.addRegistration($scope.eventure, $scope.eventureList, $scope.participant, $scope.customAnswers, $scope.groupId, $scope.group2Id, $scope.quantity);
				$location.$$search = {};
				$location.path("/eventure");
			} else {
				toastr.options = {
					'positionClass': 'toast-bottom-right'
				};
				toastr.error('Please answer all questions and accept all terms.');
			}
			////cartModel.registrations.currentGroupId = $scope.groupId;
			////alert($scope.groupId);
			////cartModel.currentStockAnswerSet = $scope.stockAnswerSet;
			////cartModel.currentCustomAnswerSet = getCustomAnswers();
			////cartModel.setCurrentParticipant($scope.participant);
			////cartModel.setCurrentEventure($scope.eventure);
			////cartModel.setCurrentEventureList($scope.eventureList);
			//cartModel.addRegistration($scope.eventure, $scope.eventureList, $scope.participant, getCustomAnswers(), $scope.groupId, $scope.group2Id, $scope.quantity);
			//$location.$$search = {};
			////$location.path("/eventure/");
			//$location.path("/confirm");
		};
	}

	angular.module("evReg").controller(controllerId, ["$scope", "$location", "config", "CartModel", "datacontext", "$routeParams", "common", Controller]);
})();
