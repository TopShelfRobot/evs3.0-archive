(function () {

	function Service($q, $http, datacontext, config) {
		var self = this;

		this.isDefer = false; // by default it is a transfer
		this.transferListing = null;
		this.transferQuestions = [];
		this.transferAnswers = [];
		this.current = null;

		this.setTransfer = function (newListing) {
			self.transferListing = newListing;
			self.isDefer = false;
			self.getTotalPrice();
		};

		this.setDefer = function () {
			self.transferListing = null;
			self.isDefer = true;
			self.getTotalPrice();
		};

		this.totalPrice = 0;
		this.surcharges = [];
		this.regId = null;

		this.getNewQuestions = function () {
			return datacontext.question.getCustomQuestionSetByEventureListId(self.transferListing.id)
				.then(function (qs) {
					console.log("qs:", qs);
					self.transferQuestions = qs;
					self.transferAnswers = [];
					for (var k = 0; k < self.transferQuestions.length; k++) {
						self.transferAnswers.push({
							questionId: self.transferQuestions[k].id,
							answerText: ""
						});
					}

					return self.transferAnswers;
				});
		};

		this.getSurcharges = function () {
			var out = [];
			if (self.current) {
				if (self.isDefer) {
					out.push({
						desc: "Deferral Fee",
						amount: self.current.eventure.deferralFee
					});
				} else {
					out.push({
						desc: "Transfer Fee",
						amount: self.current.eventure.transferFee
					});
					var diff = 0;
					if (self.transferListing) {
						diff = self.transferListing.currentFee - self.current.currentFee;
						diff = diff > 0 ? diff : 0;
					}
					out.push({
						desc: "Price Difference",
						amount: diff
					});
				}
			}

			self.surcharges = out;
			console.log("surcharges:", self.surcharges);
			return out;
		};

		this.getTotalPrice = function () {
			var total = 0;
			var surcharges = self.getSurcharges();
			for (var i = 0; i < surcharges.length; i++) {
				total += surcharges[i].amount;
			}

			self.totalPrice = total;
			console.log("Total Price:", self.totalPrice);
			return total;
		};

		this.getTransferId = function () {
			var transfer = datacontext.registration.createTransfer(self.regId, self.current.id, self.transferListing.id, null, self.registration.participantId);
			return datacontext.saveChanges([transfer])
				.then(function () {
					return transfer.id;
				});
		};

		this.submitTransfer = function (token, total, paymentType) {
			var type = "online";
			if (config.owner.isAdmin) {
				type = "manual";
			}
			return self.getTransferId()
				.then(function (id) {

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
					return $http.post(config.apiPath + "api/transaction/transfer", source);
				});
		};

		this.getDeferralId = function () {
			var deferral = datacontext.registration.createDeferral(self.regId, self.current.id, self.registration.participantId);
			return datacontext.saveChanges([deferral])
				.then(function () {
					return deferral.id;
				});
		};

		this.submitDeferral = function (token, total, paymentType) {
			var type = "online";
			if (config.owner.isAdmin) {
				type = "manual";
			}
			return self.getDeferralId()
				.then(function (id) {

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

		this.transferAnswers = function () {
			// delete the previous answers
			var key;
			for (key in self.customAnswers) {
				self.customAnswers[key].entityAspect.setDeleted();
			}
			for (key in self.transferAnswers) {
				var ans = datacontext.question.createCustomAnswer(self.regId, self.transferAnswers[key].questionId);
				ans.answerText = self.transferAnswers[key].answerText;
				self.customAnswers.push(ans);
			}
			return self.saveAnswers();
		};

		this.saveAnswers = function () {
			return datacontext.save();
		};

		self.regId = null;
		this.load = function (regId) {
			var dd = $q.when(0);

			if (self.regId != regId) {
				self.regId = regId;
				dd = datacontext.registration.getRegistrationById(regId)
					.then(function (reg) {

						self.registration = reg;

						var defListing = datacontext.eventure.getEventureListById(reg.eventureListId)
							.then(function (list) {
								self.current = list;
								return datacontext.eventure.getEventureListsByOwnerId(config.owner.ownerId);
							})
							.then(function (listings) {
								self.possibles = [];
								console.log('boone listing next');
								console.log(listings);
								for (var k in listings) {
									if (listings[k].active && listings[k].id !== self.current.id) {
										self.possibles.push(listings[k]);
										console.log(listings[k].name);
									}
								}
								if (self.possibles.length > 0) {
									self.newListing = self.possibles[0];
								}
								return datacontext.eventure.getEventureById(self.current.eventureId);
							})
							.then(function (eventure) {
								console.log("eventure:", eventure);
							});

						//Need to get HouseId by Participant Id reg.participantId
						//Then

						var defParticipants = datacontext.participant.getParticipantsByRegistrationId(regId)
							.then(function (pts) {
								console.log('boone parts mnext');
								console.log(pts);

								self.participants = pts;
								console.log(self.participants);

								console.log('how many: ' + self.participants.length);
								for (var mike in self.participants) {
									console.log('hello');
									//console.log(self.participants.id);
								}

								//for (var mike in pts) {
								//    console.log(pts[mike].lastName);
								////    //console.log(pts[m]);
								////	console.log('pts:', pts[m].id);
								////	self.participants = [];
								////	self.participants.push(pts[m]);
								////	//console.log(self.participants[m]);
								//}
							});

						var defQuestions = datacontext.question.getCustomQuestionSetByEventureListId(reg.eventureListId)
							.then(function (qs) {
								self.customQuestions = qs;
								return datacontext.question.getCustomAnswerSetByRegistrationId(regId);
							})
							.then(function (list) {
								self.customAnswers = list;
								// make sure we have a matched set
								for (var i = 0; i < self.customQuestions.length; i++) {
									var found = false;
									for (var j = 0; j < self.customAnswers.length; j++) {
										if (self.customAnswers[j].questionId == self.customQuestions[i].id) {
											found = true;
											break;
										}
									}
									if (!found) {
										self.customAnswers.push(datacontext.question.createCustomAnswer(self.regId, self.customQuestions[i].id));
									}
								}
								return self.customAnswers;
							});

						return $q.all([defListing, defQuestions, defParticipants])
							.then(function (xx) {
								loaded = true;
								return xx;
							});
					});
			}
			return dd;
		};
	}


	angular.module("evReg").service("RegistrationEditModel", ["$q", "$http", "datacontext", "config", Service]);
})();
