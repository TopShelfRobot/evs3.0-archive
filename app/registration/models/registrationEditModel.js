;(function(){
	
	function Service($q, datacontext, config){
		var self = this;
		
		this.isDefer = false;  // by default it is a transfer
		this.transferListing = null;
		
		this.setTransfer = function(newListing){
			self.transferListing = newListing;
			self.isDefer = false;
		};
		
		this.setDefer = function(){
			self.transferListing = null;
			self.isDefer = true;
		};
		
		this.load = function(regId){
			
			return datacontext.registration.getRegistrationById(regId)
				.then(function(reg){
					
					self.registration = reg;
				
					var defListing = datacontext.eventure.getEventureListById(reg.eventureListId)
						.then(function(list){
							self.current = list;
							return datacontext.eventure.getEventureListsByOwnerId(config.owner.ownerId)
						})
						.then(function(listings){
							self.possibles = [];
							for(var k in listings){
								if(listings[k].active && listings[k].id !== self.current.id){
									self.possibles.push(listings[k]);
								}
							}
							if(self.possibles.length > 0){
								self.newListing = self.possibles[0];
							}
							return self.possibles;
						});
				
					var defQuestions = datacontext.question.getCustomQuestionSetByEventureListId(reg.eventureListId)
						.then(function(qs){
							self.customQuestions = qs;
							return datacontext.question.getCustomAnswerSetByRegistrationId(regId);
						})
						.then(function(ans){
							self.customAnswers = ans;
							return self.customAnswers;
						});
				
					return $q.all([defListing, defQuestions]);
				});
		};
	}
	
	
	angular.module("evReg").service("RegistrationEditModel", ["$q", "datacontext", "config", Service]);
})();