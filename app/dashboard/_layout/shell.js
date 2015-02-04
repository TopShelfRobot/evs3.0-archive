(function () {
	'use strict';

	var controllerId = 'shell'; //mjb test push

	function Controller($rootScope, $location, $timeout, common, cart, config, authService, datacontext) {
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

		function toggleSpinner(on) {
			self.isBusy = on;
		}

		function activate() {

			toggleSpinner(true);
			self.showSplash = true;
			self.progBar = 30;

			var promises = [];

			promises.push(
				datacontext.owner.setOwnerSettings(config.owner.ownerId)
				.then(function (data) {
					self.progBar += 20;


					//Dynamic CSS

					var sheets = document.styleSheets; //get stylesheets as an array
					var sheet = document.styleSheets[2]; //get first stylesheet

					var sheet = (function () {
						// Create the <style> tag
						var style = document.createElement("style");

						// WebKit hack :(
						style.appendChild(document.createTextNode(""));

						// Add the <style> element to the page
						document.head.appendChild(style);

						return style.sheet;
					})();

					function addCSSRule(sheet, selector, rules, index) {
						if ("insertRule" in sheet) {
							sheet.insertRule(selector + "{" + rules + "}", index);
						} else if ("addRule" in sheet) {
							sheet.addRule(selector, rules, index);
						}
					}

					var mainColor = cart.regSettings.mainColor;
					var hoverColor = cart.regSettings.hoverColor;
					var highlightColor = cart.regSettings.highlightColor;
					var navTextColor = cart.regSettings.navTextColor;

					// Apply Colors
					addCSSRule(sheet, '.navbar-inverse', 'background-color:' + mainColor);
					addCSSRule(sheet, '.navbar-inverse', 'border-color:' + hoverColor);
					addCSSRule(sheet, '.navbar-inverse .navbar-nav>li>a:hover', 'background-color:' + hoverColor);
					addCSSRule(sheet, '.navbar-inverse .navbar-toggle .icon-bar', 'background-color:' + highlightColor);
					addCSSRule(sheet, '#cart-list > .table > tbody > tr > td > button.close.remove-item', 'color:' + highlightColor + '!imporant');
					addCSSRule(sheet, '.navbar-inverse .navbar-nav > li > a:hover', 'color:' + highlightColor);
					addCSSRule(sheet, '.badge', 'background-color:' + highlightColor);
					addCSSRule(sheet, '.grid figcaption', 'border-top-color:' + mainColor);
					addCSSRule(sheet, '.grid figcaption h4', 'color:' + hoverColor);
					addCSSRule(sheet, '.list-tile', 'border-top-color:' + mainColor);
					addCSSRule(sheet, '.list-desc-box h4', 'color:' + hoverColor);
					addCSSRule(sheet, '.navbar-inverse .navbar-nav > li > a', 'color:' + navTextColor);
					addCSSRule(sheet, '.navbar-inverse .navbar-brand', 'color:' + navTextColor);
					addCSSRule(sheet, '.navbar-inverse .navbar-brand:hover', 'color:' + highlightColor);
					addCSSRule(sheet, '#sidebar', 'border-right-color:' + mainColor);
					addCSSRule(sheet, '#sidebar .nav li > a:hover', 'border-left-color:' + highlightColor);
					addCSSRule(sheet, '.menu-collapse:hover', 'color:' + highlightColor);


					//Dynamic CSS ends

					return data;
				})
			);

			common.activateController(promises, controllerId)
				.then(function () {
					self.resolved = true;
					self.progBar = 90;
					if (!authService.authentication.isAuth) {
						$location.path("/login");
					}
					$timeout(function () {
						self.progBar = 100;
						self.showSplash = false;
					}, 300);
				})
				.then(function () {

				});
		}

		$rootScope.$on('$routeChangeStart', function (event, next, last) {
			// toggleSpinner(true);
		});

		$rootScope.$on(events.controllerActivateSuccess, function (data) {
			toggleSpinner(false);
		});

		$rootScope.$on(events.spinnerToggle, function (scope, on) {
			toggleSpinner(on);
		});

		activate();
	}

	angular.module('app').controller(controllerId, ['$rootScope', '$location', '$timeout', 'common', 'CartModel', 'config', 'authService', 'datacontext', Controller]);
})();
