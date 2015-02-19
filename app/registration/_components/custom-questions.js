;(function(){
	
	function Directive(){
		var out = {
			restrict : "E",
			scope: {
				questions : "=questions",
				answers: "=answers",
			},
			templateUrl : "/app/registration/_components/custom-questions.part.html",
			bindToController: true,
			link: function(scope, el, attrs) {
				scope.combined = [];
				
				function makeCombined(questions, answers){
					var combined = [];
					if(questions && answers){
						for(var i = 0; i < questions.length; i++){
							var item = {};
							item.questionType = questions[i].questionType;
							item.active = questions[i].active;
							item.options = [];
							if(questions[i].options){
								item.options = questions[i].options.split(",");
							}
							item.questionText = questions[i].questionText;
							item.questionId = questions[i].id;
							item.order = questions[i].order;
							item.foundAnswer = false;
							for(var j = 0; j < answers.length; j++){
								if(answers[j].questionId == item.questionId){
									item.answer = answers[j].answerText;
									item.foundAnswer = true;
									break;
								}
							}
							if(!item.foundAnswer){
								console.error("There was no answer found for this question:", questions[i]);
							}
							if(item.questionType == "checkbox"){
								if(item.answer){
									item.answer = item.answer.toLowerCase() == "true";
								}else{
									item.answer = false;
								}
								
							}
							combined.push(item);
						}
					}
					return combined;
				}
				
				scope.$watch("questions", function(n, o){
					console.log("questions:", scope.questions);
					scope.combined = makeCombined(scope.questions, scope.answers);
				});
				
				scope.$watch("answers", function(n, o){
					console.log("answers:", scope.answers);
					scope.combined = makeCombined(scope.questions, scope.answers);
				});
				
				scope.onChange = function(question){
					for(var i = 0; i < scope.answers.length; i++){
						if(scope.answers[i].questionId == question.questionId){
							scope.answers[i].answerText = question.answer;
							if(question.questionType == "checkbox"){
								scope.answers[i].answerText = question.answer ? "True" : "False";
							}
							scope.answers[i].answer = question.answer;
						}
					}
				};
				
				scope.combined = makeCombined(scope.questions, scope.answers);				
			}
		};
		
		return out;
	}
	
	angular.module("evReg").directive("customQuestions", Directive);
})();