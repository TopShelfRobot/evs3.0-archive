;(function(){
	
	
	function Controller($scope, $routeParams, datacontext, config){
		var self = this;
		
		var listId = $routeParams.listId;
		
		this.stockQuestions = ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5", "Question 6"];
		this.stockAnswers = [false, false, false, false, false, false];
		
		this.activeQuestion;
		
		this.questionChanged = function(){
			console.log($scope.regions);
		};
		
		datacontext.question.getCustomQuestionSetByEventureListId(listId)
			.then(function(data){
				console.log("custom questions:", data);
				
				data.unshift({required: false, active: false, questionText: "", questionType: "text"});
				self.activeQuestion = data[0];
				
				for(var i = 0; i < data.length; i++){
					if(data[i].required == null)
					 	data[i].required = false;
					if(data[i].active == null)
						data[i].active = false;
				}
				self.customQuestions = data;
			});
			
		this.saveQuestion = function(){
			console.log("custom questions:", self.activeQuestion);
		}
	}
	
	angular.module("app").controller("SetQuestion", ['$scope', '$routeParams', 'datacontext', 'config', Controller]);
})();