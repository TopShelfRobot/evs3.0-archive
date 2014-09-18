
;(function(){
    angular.module("evReg").controller("QuestionsController", ["$scope", "$location", "config", "CartModel", "datacontext", "$routeParams", Controller]);
    function Controller($scope, $location, config, cartModel, datacontext, $routeParams) {
		
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
		
        datacontext.getCustomQuestionSetByEventureListId(cartModel.currentEventureListId)
            .then(function(results){
				for(var i = 0; i < results.length; i++){
					results[i].answer = null;
					if(results[i].options && results[i].options.length && results[i].options.length > 0)
						results[i].options = results[i].options.split(",");
					if(results[i].required && results[i].type !== "combo" && results[i].type !== "text"){
						results[i].answer = results[i].options ? results[i].options[0] : true;
					}
				}
				$scope.customQuestions = results;
            });

        //datacontext.eventure.getGroupsActiveByEventureListId(cartModel.currentEventureListId)
        datacontext.eventure.getGroupsActiveByEventureListId(6)   //$routeParams.ListId
            .then(function (data) {
				$scope.groups = data;
                if (config.isGroupRequired && groups().length < 1) {
                    alert('There are currently no spaces available');
                    router.navigateTo("#eventurelist/" + cartModel.currentEventureListId);
                }
            });

        datacontext.question.getStockQuestionSetByEventureListId(cartModel.currentEventureListId)
			.then(function(data){
				return questions.stockQuestionSet = data;
			});

        $scope.stockAnswerSet = {
	            shirtSize: "",
	            howHear: "",
	        };

        var getCustomAnswers = function(){
            var answers = [];
			var ans;
			for(var i = 0; i < $scope.customQuestions.length; i++){
				ans = {
					id : $scope.customQuestions[i].id,
					answer : $scope.customQuestions[i].answer,
				}
				answers.push(ans);
			}
            return answers;
        }

        $scope.next = function () {
			
            cartModel.currentGroupId = $scope.groupId;
            cartModel.currentStockAnswerSet = $scope.stockAnswerSet;
            cartModel.currentCustomAnswerSet = getCustomAnswers();
            cartModel.addRegistration();
			$location.$$search = {};
            $location.path("/eventure/");
        };
	}
})();