;(function(){
	
	var controllerId = "EditRegistration";
	
	function Controller($routeParams, datacontext, common){
		var self = this;
		this.showDefer = false;
		this.showTransfer = false;
		
		this.loadTransfer = function(){
			self.showDefer = false;
			self.showTransfer = true;
		};
		
		this.loadDefer = function(){
			self.showDefer = true;
			self.showTransfer = false;
		};
		
		this.cancel = function(){
			console.log("cancel");
		};
				
		var promises = datacontext.registration.getRegistrationById($routeParams.regId)
		.then(function(data){
			console.log(data);
			return datacontext.question.getCustomQuestionSetByEventureListId(data.eventureListId)
		})
		.then(function(qs){
			console.log("qs:", qs);
			self.customQuestions = qs;
			return datacontext.question.getCustomAnswerSetByRegistrationId($routeParams.regId);
		})
		.then(function(ans){
			console.log("ans:", ans);
			self.customAnswers = ans;
		})
		.catch(function(err){
			
		});
		
		common.activateController(promises, controllerId)
	        .then(function () { 
				console.log('Activated Registration Edit View'); 
			})
			.finally(function(){
				console.log("done");
			});
	}
	
	angular.module("evReg").controller(controllerId, ["$routeParams", "datacontext", "common", Controller]);
	
})();