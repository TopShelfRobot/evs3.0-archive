;(function(){
	
	var controllerId = "TransferQuestions";
	
	function Controller($routeParams, $location, $q, model, common, config){
		var self = this;
		
		this.regId = $routeParams.regId;
		
		this.submit = function(){
			$location.path("/registration/" + self.regId + "/edit");
		};
		
		common.activateController(model.getNewQuestions(), controllerId);
	}
	
	angular.module("evReg").controller(controllerId, ["$routeParams", "$location", "$q", "RegistrationEditModel", "common", "config", Controller]);
	
})();