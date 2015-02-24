(function () {

	function Controller($location, cartModel, datacontext, helpers, config) {
		var self = this;

		this.partEmail = '';
		this.partName = '';



		this.search = function () {
			self.selectedUser = null;
			if (self.partEmail) {
				// search by email
				datacontext.participant.getParticipantsBySearchingEmail(self.partEmail)
					.then(function (list) {
						self.searchResults = list;
					});
			} else if (self.partName) {
				// search by name
				datacontext.participant.getParticipantsBySearchingName(self.partName)
					.then(function (list) {
						self.searchResults = list;
					});
			} else {
				self.searchResults = [];
			}
		};

		this.ageFromBirthday = helpers.ageFromBirthday;

		this.searchResults = [];

		this.selectedUser = null;

		this.selectUser = function () {
			cartModel.houseId = self.selectedUser.houseId;
			console.log(config);
			$location.path('/eventure/');
		};

		this.createNewUser = function () {
			$location.path('/new-user/add');
		};

		//TODO whg I don't understand what this does...
		if (config.owner.newId && config.owner.houseId) {
			console.log(config);
			config.owner.newId = false;
			$location.path('/eventure/');
		}
	}
	angular.module('app').controller('ManReg', ['$location', 'CartModel', 'datacontext', 'Helpers', 'config', Controller]);
})();
