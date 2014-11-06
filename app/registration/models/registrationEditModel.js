;(function(){
	
	function Service($q, datacontext, config){
		var self = this;
		
		this.isDefer = false;  // by default it is a transfer
		this.transferListing = null;
		this.transferQuestions = [];
		this.transferAnswers = [];
		this.current = null;
		
		this.setTransfer = function(newListing){
			self.transferListing = newListing;
			self.isDefer = false;
			self.getTotalPrice();
		};
		
		this.setDefer = function(){
			self.transferListing = null;
			self.isDefer = true;
			self.getTotalPrice();
		};
		
		this.totalPrice = 0;
		this.surcharges = [];
		
		this.getNewQuestions = function(){
			return datacontext.question.getCustomQuestionSetByEventureListId(self.transferListing.id)
			.then(function(qs){
				self.transferQuestions = qs;
				self.transferAnswers = [];
			});
		};
		
		this.getSurcharges = function(){
			var out = [];
			if(self.current){
				if(self.isDefer){
					out.push({desc: "Deferral Fee", amount: self.current.eventure.deferralFee});
				}else{
					out.push({desc: "Transfer Fee", amount: self.current.eventure.transferFee});
					var diff = 0;
					if(self.transferListing){
						diff = self.transferListing.currentFee - self.current.currentFee;
						diff = diff > 0 ? diff : 0;
					}
					out.push({desc: "Price Difference", amount: diff});
				}
			}
			
			self.surcharges = out;
			console.log("surcharges:", self.surcharges);
			return out;
		};
		
		this.getTotalPrice = function(){
			var total = 0;
			var surcharges = self.getSurcharges();
			for(var i = 0; i < surcharges.length; i++){
				total += surcharges[i].amount;
			}
			
			self.totalPrice = total;
			console.log("Total Price:", self.totalPrice);
			return total;
		};
		
		this.saveAnswers = function(){
			return datacontext.save();
		};
		
		var loaded = false;
		this.load = function(regId){
			
			if(!loaded){
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
								// if(!self.customAnswers){
								// 	self.customAnswers = datacontext.question.createCustomAnswerSet();
								// 	console.log("custom answers:", self.customAnswers);
								// }
								return self.customAnswers;
							});
				
						return $q.all([defListing, defQuestions])
							.then(function(xx){
								loaded = true;
								return xx;
							});
					});
			}else{
				return;
			}
			
		};
	}
	
	
	angular.module("evReg").service("RegistrationEditModel", ["$q", "datacontext", "config", Service]);
})();