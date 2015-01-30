﻿
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
			color: cart.regSettings.mainColor
		};
		this.resolved = false;

		//Dynamic CSS

		var sheets = document.styleSheets; //get stylesheets as an array
		var sheet = document.styleSheets[2]; //get first stylesheet
		console.log(sheet); //what is it?
		console.log(sheet.media.mediaText); //gets media type (all or print)

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
		addCSSRule(sheet, '.navbar-inverse .navbar-nav > .active > a:hover', 'background-color:' + hoverColor);
		addCSSRule(sheet, '.navbar-inverse .navbar-toggle .icon-bar', 'background-color:' + highlightColor);
		addCSSRule(sheet, '#cart-list > .table > tbody > tr > td > button.close.remove-item', 'color:' + highlightColor + '!imporant');
		addCSSRule(sheet, '.navbar-inverse .navbar-nav > li > a:hover', 'color:' + highlightColor);
		addCSSRule(sheet, '.badge', 'background-color:' + highlightColor);
		addCSSRule(sheet, '.grid figcaption', 'border-color:' + mainColor);
		addCSSRule(sheet, '.grid figcaption h4', 'color:' + mainColor);
		addCSSRule(sheet, '.list-tile', 'border-color:' + mainColor);
		addCSSRule(sheet, '.list-desc-box h4', 'color:' + mainColor);
		addCSSRule(sheet, '.navbar-inverse .navbar-nav > li > a', 'color:' + navTextColor);

		//Dynamic CSS ends

		function activate() {
			var isDefault = false;

			if (isDefault) {
				$css.add('Content/custom-colors.css');
			}

			self.showSplash = true;
			self.progBar = 30;

			var promises = [];

			if (authService.authentication.userName) {
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
				.then(function (data) {
					self.progBar += 20;
					return data;
				})
			);

			common.activateController(promises, controllerId)
				.then(function () {
					self.progBar = 90;
					self.resolved = true;
					$timeout(function () {
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
		});

		$rootScope.$on(events.controllerActivateSuccess, function (data) {
			toggleSpinner(false);
		});

		$rootScope.$on(events.spinnerToggle, function (scope, on) {
			toggleSpinner(on);
		});

	};

	angular.module('evReg').controller(controllerId, ['$rootScope', '$timeout', '$css', 'common', 'config', 'authService', 'CartModel', 'datacontext', Controller]);
})();
