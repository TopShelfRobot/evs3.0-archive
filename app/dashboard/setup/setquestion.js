;(function(){
	
	
	function Controller($scope, $routeParams, datacontext, config){
		var self = this;
		
		var listId = $routeParams.listId;
		
		this.stockQuestions = ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5", "Question 6"];
		this.stockAnswers = [false, false, false, false, false, false];
		
		this.activeQuestion;
		this.workingQuestion = {};
		this.questionChanged = function(){
			self.workingQuestion = {};
			var keys = ["questionText", "questionType", "active", "isRequired", "id", "options"];
			for(var i in keys){
				if(typeof self.activeQuestion[keys[i]] !== "undefined"){
					self.workingQuestion[keys[i]] = self.activeQuestion[keys[i]];
				}
			}
			console.log("New working item is:", self.workingQuestion);
		};
		
		var loadStockQuestions = function(){
			// return datacontext.question.getStockQuestionSetByEventureListId(listId)
			// 	.then(function(data){
			// 		console.log("stock answers:", data);
			//
			// 		self.stockAnswers = data;
			// 	});
		}
		
		var loadCustomQuestions = function(){
			return datacontext.question.getCustomQuestionSetByEventureListId(listId)
				.then(function(data){
					console.log("custom questions:", data);
				
					data.unshift({isRequired: false, active: false, questionText: "", questionType: "text"});
					self.activeQuestion = data[0];
					self.questionChanged();
				
					for(var i = 0; i < data.length; i++){
						if(data[i].isRequired == null)
						 	data[i].isRequired = false;
						if(data[i].active == null)
							data[i].active = false;
					}
					self.customQuestions = data;
					return self.customQuestions;
				});
		};
		
		loadCustomQuestions();
		loadStockQuestions();
			
		this.saveQuestion = function(){
			var question;
			if(typeof self.workingQuestion.id == "undefined"){
				question = datacontext.question.createCustomQuestion(listId);
			}else{
				for(var i = 0; i < self.customQuestions.length; i++){
					if(self.workingQuestion.id == self.customQuestions[i].id){
						question = self.customQuestions[i];
						break;
					}
				}
			}
			for(var key in self.workingQuestion){
				question[key] = self.workingQuestion[key];
			}
			datacontext.save()
				.then(function(data){
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
				console.log("ready to nav");
			}).catch(function(){
				console.log("save failed");
			});
		}
	}
	
	angular.module("app").controller("SetQuestion", ['$scope', '$routeParams', 'datacontext', 'config', Controller]);
})();