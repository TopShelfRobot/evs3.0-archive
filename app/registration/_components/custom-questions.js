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
				
				function makeCombined(){
					if(scope.questions && scope.answers){
						for(var i = 0; i < scope.questions.length; i++){
							var item = {};
							item.questionType = scope.questions[i].questionType;
							item.active = scope.questions[i].active;
							item.options = [];
							if(scope.questions[i].options){
								item.options = scope.questions[i].options.split(",");
							}
							item.questionText = scope.questions[i].questionText;
							item.questionId = scope.questions[i].id;
							item.order = scope.questions[i].order;
							for(var j = 0; j < scope.answers.length; j++){
								if(scope.answers[j].questionId == item.questionId){
									item.answer = scope.answers[j].answerText;
									break;
								}
							}
							if(item.questionType == "checkbox"){
								item.answer = item.answer.toLowerCase() == "true";
							}
							scope.combined.push(item);
						}
					}
				}
				
				scope.$watch("questions", function(n, o){
					makeCombined();
				});
				
				scope.$watch("answers", function(n, o){
					makeCombined();
				});
				
				scope.onChange = function(question){
					for(var i = 0; i < scope.answers.length; i++){
						if(scope.answers[i].questionId == question.questionId){
							scope.answers[i].answerText = question.answer;
							if(question.questionType == "checkbox"){
								scope.answers[i].answerText = question.answer ? "True" : "False";
							}
						}
					}
				};
				
				if(scope.questions && scope.answers){
					makeCombined();
				}
			}
		};
		
		return out;
	}
	
	angular.module("evReg").directive("customQuestions", Directive);
})();