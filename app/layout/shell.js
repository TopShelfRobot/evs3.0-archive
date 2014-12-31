(function () {
	'use strict';

	var controllerId = 'shell';   //mjb test push

	function Controller($rootScope, $location, common, config, $timeout, accountModel, rba) {
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
		
		rba.getRole = function(){
			var roles = accountModel.roles;
			return roles;
		};
		
		function toggleSpinner(on) {
			self.isBusy = on;
		}

		function activate() {
			toggleSpinner(true);
			self.showSplash = true;
			self.progBar = 30;
			
			var promises = [];
			promises.push(
				accountModel.init()
				.then(function(){
					self.progBar += 30;
				})
				.then(function(){
					self.progBar += 30;
					if(!accountModel.loggedIn){
						$location.path("/login");
					}
				})
			);
			
			common.activateController(promises, controllerId)
				.then(function () {
					self.resolved = true;
					self.progBar = 90;
					$timeout(function(){
						self.progBar = 100;
						self.showSplash = false;
					}, 300);		
				});
		}

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
		
		activate();  
	};
	
	angular.module('app').controller(controllerId, ['$rootScope', "$location", 'common', 'config', "$timeout", "AccountModel", "AuthService", Controller]);
})();
