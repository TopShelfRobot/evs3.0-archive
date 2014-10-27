;(function(){
	
	var controllerId = "EditRegistration";
	
	function Controller($routeParams, datacontext, common, config){
		var self = this;
		this.showDefer = false;
		this.showTransfer = false;
		this.newListing = null;
		
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
			self.showTransfer = false;
		};
		
		this.submitTransfer = function(){
			
		};
		
		this.cancelDefer = function(){
			self.showDefer = false;
		};
		
		this.submitDefer = function(){
			
		};
				
		var promises = [];
		
		promises.push(
			datacontext.registration.getRegistrationById($routeParams.regId)
			.then(function(data){
				console.log(data);
				datacontext.eventure.getEventureListById(data.eventureListId)
				.then(function(list){
					console.log("list:", list);
					self.list = list;
					return datacontext.eventure.getEventureListsByOwnerId(config.owner.ownerId)
				})
				.then(function(listings){
					console.log("listings:", listings);
					self.listings = [];
					for(var k in listings){
						if(listings[k].active && listings[k].id !== self.list.id){
							self.listings.push(listings[k]);
						}
					}
					if(self.listings.length > 0){
						self.newListing = self.listings[0];
					}
				});
				
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
			
			})
		);
		
		common.activateController(promises, controllerId)
	        .then(function () { 
				console.log('Activated Registration Edit View'); 
			})
			.finally(function(){
				console.log("done");
			});
	}
	
	angular.module("evReg").controller(controllerId, ["$routeParams", "datacontext", "common", "config", Controller]);
	
})();