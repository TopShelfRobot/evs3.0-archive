
;(function(){
	
	var controllerId = "QuestionsController";
    
    function Controller($scope, $location, config, cartModel, datacontext, $routeParams, common) {
		
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

//         datacontext.getCustomQuestionSetByEventureListId(cartModel.currentEventureListId)
//             .then(function(obs){
//
//                 for(var i = 0; i < obs().length; i++){
//                     obs()[i].answerValue = ko.observable();
//
//                     if(obs()[i].options()){
//                         var opts = obs()[i].options().split(",");
//                         if(obs()[i].type() == "combo"){
//                             opts.unshift(null);
//                         }
//                         obs()[i].options(opts);
//                     }
//                 }
//                 questions.customQuestionSet = obs();
// return questions.customQuestionSet;
//             });

		var promises = [];
        promises.push(
			datacontext.eventure.getGroupsActiveByEventureListId(6)   //$routeParams.ListId
	            .then(function (data) {
					$scope.groups = data;
	                if (config.isGroupRequired && groups().length < 1) {
	                    alert('There are currently no spaces available');
	                    router.navigateTo("#eventurelist/" + cartModel.currentEventureListId);
	                }
	            })
		);

		promises.push(
	        datacontext.question.getStockQuestionSetByEventureListId(cartModel.currentEventureListId)
				.then(function(data){
					return questions.stockQuestionSet = data;
				})
		);
		
		common.activateController(promises, controllerId);
		
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
	}
	
	angular.module("evReg").controller(controllerId, ["$scope", "$location", "config", "CartModel", "datacontext", "$routeParams", "common", Controller]);
})();