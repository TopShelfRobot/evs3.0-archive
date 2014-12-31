;(function(){
	
	function Directive(){
		var out = {
			restrict : "E",
			scope: {
				questions : "=questions",
				answers: "=answers",
			},
			templateUrl : "/app/registration/directives/custom-questions.part.html",
		};
		
		return out;
	}
	
	angular.module("evReg").directive("customQuestions", Directive);
})();