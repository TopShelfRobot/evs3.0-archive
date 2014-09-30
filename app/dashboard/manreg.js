;(function(){
	
	function Controller($location, datacontext, helpers, config){
		var self = this;
		
		this.partEmail = "";
		
		this.partName = "";
		
		this.search = function(){
			self.selectedUser = null;
			if(self.partEmail){
                // search by email
                datacontext.participant.getParticipantsBySearchingEmail(self.partEmail)
					.then(function(list){
						self.searchResults = list;
					});
            }else if(self.partName){
                // search by name
                datacontext.participant.getParticipantsBySearchingName(self.partName)
					.then(function(list){
						self.searchResults = list;
					});
            }else{
                self.searchResults = [];
            }
		};
		
		this.ageFromBirthday = helpers.ageFromBirthday;
		
		this.searchResults = [];
		
		this.selectedUser = null;
		
		this.selectUser = function(){
			config.owner.houseId = self.selectedUser.houseId;
			console.log(config);
			
            $location.path("/eventure/");
		};
		
		this.createUser = function(){
			
		};
	}
	
	angular.module("app").controller("ManReg", ["$location", "datacontext", "Helpers", "config", Controller]);
})();