;(function(){
	
	function Service($q, $http, datacontext, config){
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
		this.regId = null;
		
		this.getNewQuestions = function(){
			return datacontext.question.getCustomQuestionSetByEventureListId(self.transferListing.id)
			.then(function(qs){
				console.log("qs:", qs);
				self.transferQuestions = qs;
				self.transferAnswers = {};
				for(var k = 0; k < self.transferQuestions.length; k++){
					self.transferAnswers[self.transferQuestions[k].id] = datacontext.question.createCustomAnswer(self.regId, self.transferQuestions[k].id)
				}
				
				// delete the previous answers
				for(var key in self.customAnswers){
					self.customAnswers[key].entityAspect.setDeleted();
				}
				return self.transferAnswers;
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
		
		this.getTransferId = function () {
            var transfer = datacontext.registration.createTransfer(self.regId, self.current.id, self.transferListing.id, null, self.registration.participantId);
            return datacontext.saveChanges([transfer])
                .then(function(){
                	return transfer.id;
                });
	    };
		
		this.submitTransfer = function(token, total, paymentType){
			var type = "online";
			if(config.owner.isAdmin){
				type = "manual";
			}
			return self.getTransferId()
				.then(function(id){
					
					var source = {
						'token': token,
						'ownerId': config.owner.ownerId,
						'transferId': id,
						'partId': self.registration.participantId,
						'amount': total,
						'transferNewListName': self.transferListing.name,
						'paymentType': paymentType,
						'type': type
					};
					return $http.post(config.apiPath + "/api/Registrations/Transfer", source);
				});
		};
		
		this.getDeferralId = function () {
            var deferral = datacontext.registration.createDeferral(self.regId, self.current.id, self.registration.participantId);
            return datacontext.saveChanges([deferral])
                .then(function(){
                	return deferral.id;
                });
	    };
		
		this.submitDeferral = function(token, total, paymentType){
			var type = "online";
			if(config.owner.isAdmin){
				type = "manual";
			}
			return self.getDeferralId()
				.then(function(id){
					
					var source = {
						'token': token,
						'ownerId': config.owner.ownerId,
						'deferralId': id,
						'partId': self.registration.participantId,
						'amount': total,
						'paymentType': paymentType,
						'type': type
					};
					return $http.post(config.apiPath + "/api/Registrations/Deferral", source);
				});
		};
		
		this.saveAnswers = function(){
			return datacontext.save();
		};
		
		var loaded = false;
		this.load = function(regId){
			
			if(!loaded){
				self.regId = regId;
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
								console.log("qs:", qs);
								self.customQuestions = qs;
								return datacontext.question.getCustomAnswerSetByRegistrationId(regId);
							})
							.then(function(list){
								console.log("ans:", list);
								self.customAnswers = {};
								var ans = null;
								for(var k = 0; k < self.customQuestions.length; k++){
									ans = null;
									for(var j = 0; j < list.length; j++){
										if(list[j].questionId == self.customQuestions[k].id){
											ans = list[j];
											break;
										}
									}
									if(!ans){
										ans = datacontext.question.createCustomAnswer(regId, self.customQuestions[k].id)
									}
									self.customAnswers[self.customQuestions[k].id] = ans;
								}
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
	
	
	angular.module("evReg").service("RegistrationEditModel", ["$q", "$http", "datacontext", "config", Service]);
})();