;(function(){
	
	var controllerId = "EditRegistration";
	
	function Controller($routeParams, $location, $q, model, common, config){
		var self = this;
		this.showDefer = false;
		this.showTransfer = false;
		this.newListing = null;
		this.model = model;
		this.regId = $routeParams.regId;
		
		this.saveAnswers = function(){
			self.model.saveAnswers()
			.then(function(){
				console.log("done");
			});
		};
		
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
		
		this.cancelTransfer = function(){
			self.newListing = null;
			self.showTransfer = false;
		};
		
		this.cancelDefer = function(){
			self.showDefer = false;
		};
		
		this.submitTransfer = function(){
			console.log("new listing:", self.newListing);
			self.model.setTransfer(self.newListing);
			$location.path("/registration/" + self.regId + "/transferQuestions");
		};
		
		this.submitDefer = function(){
			self.model.setDefer();
			$location.path("/registration/" + self.regId + "/edit");
		};
		
		common.activateController(model.load(self.regId), controllerId);
	}
	
	angular.module("evReg").controller(controllerId, ["$routeParams", "$location", "$q", "RegistrationEditModel", "common", "config", Controller]);
	
})();