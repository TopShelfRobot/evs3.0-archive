;(function(){
	
	var questionKeys = [
		"questionText",
		"questionType",
		"active",
		"isRequired",
		"options"
	];
	
	
	function Controller($scope, $routeParams, $location, datacontext, config){
		var self = this;
		
		var listId = $routeParams.listId;
		
		this.activeQuestion = null;
		this.workingQuestion = {};
		
		var loadCustomQuestions = function(){
			return datacontext.question.getCustomQuestionSetByEventureListId(listId)
				.then(function(data){
					console.log("custom questions:", data);
				
					self.customQuestions = data;
					return self.customQuestions;
				});
		};
		
		loadCustomQuestions();
		
		this.editQuestion = function(key){
			self.activeQuestion = key;
			for(var i = 0; i < questionKeys.length; i++){
				self.workingQuestion[questionKeys[i]] = self.customQuestions[key][questionKeys[i]];
			}
		};
		
		this.clearEdits = function(){
			self.activeQuestion = null;
			self.workingQuestion = {};
		};
			
		this.saveQuestion = function(){
			var question;
			if(self.activeQuestion == null){
				question = datacontext.question.createCustomQuestion(listId);
			}else{
				question = self.customQuestions[self.activeQuestion];
			}
			for(var key in self.workingQuestion){
				question[key] = self.workingQuestion[key];
			}
			datacontext.save()
				.then(function(data){
					self.clearEdits();
					console.log("save successful:", data);
					return loadCustomQuestions();
				}).catch(function(err){
					console.error("save unsuccessful:", err);
					return loadCustomQuestions();
				});
		}
		
		this.saveAndNav = function(){
			datacontext.save()
			.then(function(){
				$location.path("/elistcenter/" + listId);
			}).catch(function(){
				console.log("save failed");
			});
		}
	}
	
	angular.module("app").controller("SetQuestion", ['$scope', '$routeParams', '$location', 'datacontext', 'config', Controller]);
})();