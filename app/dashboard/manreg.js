;(function(){
	
	function Controller(datacontext){
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
		
		this.ageFromBirthday = function(birthday){
			return 10;
		};
		
		this.searchResults = [];
		
		this.selectedUser = null;
	}
	
	angular.module("app").controller("ManReg", ["datacontext", Controller]);
})();