
;(function(){
	
	function Controller($scope, $location, config, cartModel, datacontext, logger){
		
		$scope.cart = cartModel;
		
		var questions = {
				stockQuestionSet : [],
		        customQuestionSet : [],
		        stockAnswerSet : [],
			};
			
		$scope.questions = questions;
		
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
				// for(var i = 0; i < results.length; i++){
				// 	if(results[i].options)
				// 		results[i].options = results[i].options.split(",");
				// }
				$scope.customQuestions = results;
            });

        datacontext.getGroupsActiveByEventureListId(cartModel.currentEventureListId)
            .then(function (data) {
				$scope.groups = data;
                if (config.isGroupRequired && groups().length < 1) {
                    alert('There are currently no spaces available');
                    router.navigateTo("#eventurelist/" + cartModel.currentEventureListId);
                }
            });

        datacontext.getStockQuestionSetByEventureListId(cartModel.currentEventureListId)
			.then(function(data){
				return questions.stockQuestionSet = data;
			});

        questions.stockAnswerSet = {
	            shirtSize: "",
	            howHear: "",
	        };

        var getCustomAnswers = function(){
            var answers = [];
            for(var i = 0; i < questions.customQuestionSet.length; i++){
                answers.push({
                	id : questions.customQuestionSet[i].id,
					answerValue : questions.customQuestionSet[i].answerValue
                });
            }
            return answers;
        }

        $scope.next = function (isValid) {

            var form = $(".form-horizontal");
            form.validate();

            if (form.valid()) {
                cartModel.currentGroupId = $scope.groupId;
                questions.stockAnswerSet.stockQuestionSetId = questions.stockQuestionSet && questions.stockQuestionSet.id ? questions.stockQuestionSet.id : null;
                cartModel.currentStockAnswerSet = questions.stockAnswerSet;
                cartModel.currentCustomAnswerSet = getCustomAnswers();
                cartModel.addRegistration();
	            $location.path("/eventure/");
            }
        };

      // var vm = {
      //       activate: activate,
      //       viewAttached: viewAttached,
      //       clickAddToCart: clickAddToCart,
      //       cart: cart,
      //       eventureList: eventureList,
      //       stockQuestionSet: stockQuestionSet,
      //       stockAnswerSet: stockAnswerSet,
      //       groups: groups,
      //       groupId: groupId,
      //       //group2Id: group2Id,
      //       isWaiverChecked: isWaiverChecked,
      //       customQuestionSet : customQuestionSet,
      //       //isAddCartApproved: isAddCartApproved,
      //       title: 'question'
      //   };
      //   return vm;
	}
	
	angular.module("evReg").controller("QuestionsController", ["$scope", "$location", "config", "CartModel", "datacontext", Controller]);
})();