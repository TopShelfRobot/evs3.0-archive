
; (function () {

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

		var promises = [];

		promises.push(
			datacontext.question.getCustomQuestionSetByEventureListId($routeParams.listId)
				.then(function (results) {
					//alert(results.length);
					for (var i = 0; i < results.length; i++) {
						results[i].answer = null;
						if (results[i].options && results[i].options.length) {
							results[i].qOptions = results[i].options.split(",");
						}
						if (results[i].questionOptions && results[i].questionOptions.length) {
							results[i].qOptions = results[i].questionOptions;
						}
					}
					$scope.customQuestions = results;
					console.log("Custom Questions:", $scope.customQuestions);
					return results;
				})
				.then(function (results) {
					$scope.customAnswers = new Array(results.length);
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
				})
		);

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
					});
			})()
		);

		common.activateController(promises, controllerId);

		//$scope.stockAnswerSet = {
		//        shirtSize: "",
		//        howHear: "",
		//    };

		var getCustomAnswers = function () {
			var answers = [];
			var ans;
			//alert($scope.customAnswers.length);
			//alert($scope.customQuestions.length);
			for (var i = 0; i < $scope.customAnswers.length; i++) {
				//alert('getting in herer');
			    ans = {
			        questionId: $scope.customQuestions[i].id,
			        answer: $scope.customAnswers[i],
			    };
			    if ($scope.customQuestions[i].active) {
			        //alert('what about here');
			        answers.push(ans);
			    }
			}
			//alert(answers.length);
			return answers;
		};

		$scope.next = function () {
			if ($scope.questionsForm.$valid) {
				// Submit as normal
				cartModel.addRegistration($scope.eventure, $scope.eventureList, $scope.participant, getCustomAnswers(), $scope.groupId, $scope.group2Id, $scope.quantity);
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