(function () {
	'use strict';

	var controllerId = 'shell';   

	function Controller($rootScope, $timeout, $css, common, config, authService, cart, datacontext) {
		var self = this;
		var logSuccess = common.logger.getLogFn(controllerId, 'success!!!');
		var events = config.events;
		
		this.busyMessage = 'Please wait ...';
		this.isBusy = true;
		this.showSplash = true;
		this.progBar = 22;
		this.spinnerOptions = {
			radius: 40,
			lines: 7,
			length: 20,
			width: 15,
			speed: 1.7,
			corners: 1.0,
			trail: 100,
			color: '#F58A00'
		};
		this.resolved = false;

		function activate() {
			var isDefault = false;

			if(isDefault) {
				$css.add('Content/custom-colors.css');
			}

			self.showSplash = true;
			self.progBar = 30;
			
			var promises = [];
			
			if(authService.authentication.userName){
	            promises.push(
	                datacontext.participant.getParticipantByEmailAddress(authService.authentication.userName, config.owner.ownerId)
	                    .then(function (data) {
	                        cart.houseId = data.id;
							self.progBar += 20;
							return data;
	                    })
	            );
			}
			
			promises.push(
				datacontext.owner.setOwnerSettings(config.owner.ownerId)
				.then(function(data){
					self.progBar += 20;
					return data;
				})
			);
			
			common.activateController(promises, controllerId)
				.then(function () {
					self.progBar = 90;
					self.resolved = true;
					$timeout(function(){
						self.showSplash = false;
					}, 300);
				});
		}

		function toggleSpinner(on) {
			self.isBusy = on;
		}
		
		activate();
		toggleSpinner(true);

		$rootScope.$on('$routeChangeStart', function (event, next, last) {
				// toggleSpinner(true);
			}
		);

		$rootScope.$on(events.controllerActivateSuccess, function (data) {
				toggleSpinner(false);
			}
		);

		$rootScope.$on(events.spinnerToggle, function (scope, on) {
				toggleSpinner(on);
			}
		);

	};
	
	angular.module('evReg').controller(controllerId, ['$rootScope', '$timeout', '$css', 'common', 'config', 'authService', 'CartModel', 'datacontext', Controller]);
})();
