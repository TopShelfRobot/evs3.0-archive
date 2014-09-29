
;(function(){
	
	var controllerId = "QuestionsController";
    
    function Controller($scope, $location, config, cartModel, datacontext, $routeParams, common) {
		
		$scope.cart = cartModel;
		
		$scope.notAllowedToContinue = function(){
			return !$scope.isWaiverChecked;
		};
		
		$scope.setWaiverChecked = function(val){
			console.log("setWaiverChecked:", val);
			$scope.isWaiverChecked = val;
		};
		
        $scope.groups = [];
        $scope.isWaiverChecked = false;
        $scope.groupId = 0;
        $scope.group2Id = 0;
		
		var loadCustomQuestions = function(){
			return datacontext.question.getCustomQuestionSetByEventureListId($routeParams.listId)
	            .then(function(results){
					for(var i = 0; i < results.length; i++){
						results[i].answer = null;
						if(results[i].options && results[i].options.length){
							results[i].qOptions = results[i].options.split(",");
						}
						if(results[i].questionOptions && results[i].questionOptions.length){
							results[i].qOptions = results[i].questionOptions;
						}
					}
					$scope.customQuestions = results;
					console.log("Custom Questions:", $scope.customQuestions);
					return results;
	            });
		};
		
		loadCustomQuestions()
			.then(function(results){
				$scope.customAnswers = new Array(results.length);
			});

		var promises = [];
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

		promises.push(
	        datacontext.question.getStockQuestionSetByEventureListId($routeParams.listId)
				.then(function(data){
					return data;
				})
		);

        $scope.stockAnswerSet = {
	            shirtSize: "",
	            howHear: "",
	        };

        var getCustomAnswers = function(){
            var answers = [];
			var ans;
			for(var i = 0; i < $scope.customAnswers.length; i++){
				ans = {
					id : $scope.customQuestions[i].id,
					answer : $scope.customAnswers[i],
				}
				if($scope.customQuestions[i].active){
					answers.push(ans);
				}
			}
            return answers;
        };

        $scope.next = function () {
            cartModel.currentGroupId = $scope.groupId;
            cartModel.currentStockAnswerSet = $scope.stockAnswerSet;
            cartModel.currentCustomAnswerSet = getCustomAnswers();
            cartModel.addRegistration();
			$location.$$search = {};
            $location.path("/eventure/");
        };
	}
	
	angular.module("evReg").controller(controllerId, ["$scope", "$location", "config", "CartModel", "datacontext", "$routeParams", "common", Controller]);
})();