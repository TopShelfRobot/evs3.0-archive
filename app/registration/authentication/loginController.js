(function() {
	'use strict';
	var controllerId = 'loginController';

	function controller($scope, $http, $location, $routeParams, $q, userAgent, authService, datacontext, common, cart, config, ngAuthSettings) {

		$scope.loginData = {
			userName: '',
			password: '',
			useRefreshTokens: false
		};

		$scope.requestPath = $routeParams.requestPath;
		$scope.isDash = false;

		var requestPath = window.location.pathname;

		if (requestPath === '/dash.html') {
			$scope.isDash = true;
		}

		$scope.message = '';

		common.activateController(controllerId);

		$scope.login = function() {
			authService.login($scope.loginData)
				.then(function(response) {
					//console.log(response);
					$scope.authentication = authService.authentication;
					authService.startTimer($scope.authentication);
				});
		};

		$scope.authExternalProvider = function(provider) {
			var redirectUri = location.protocol + '//' + location.host + '/app/registration/authentication/authcomplete.html';

			var externalProviderUrl = config.apiPath +
				'api/Account/ExternalLogin?provider=' + provider +
				'&response_type=token&client_id=' + ngAuthSettings.clientId +
				'&redirect_uri=' + redirectUri +
				'&scope=email';

			window.$windowScope = $scope;
			var oauthWindow = window.open(externalProviderUrl, 'Authenticate Account', 'location=0,status=0,width=600,height=750');
		};

		$scope.authCompletedCB = function(externalAuthData) {
			//console.log(externalAuthData);
			$scope.$apply(function() {
				if (externalAuthData.haslocalaccount == 'False') {
					authService.logOut();

					authService.externalAuthData = {
						provider: externalAuthData.provider,
						userName: externalAuthData.username,
						externalAccessToken: externalAuthData.external_access_token
					};
					//console.log('authService.externalAuthData', authService.externalAuthData);

					authService.registerExternal(authService.externalAuthData)
						.then(function(response) {
							//mjb authService.startTimer(authService.externalAuthData);
							var externalData = {
								provider: externalAuthData.provider,
								userName: externalAuthData.username,
								externalAccessToken: externalAuthData.external_access_token
							};
							authService.obtainAccessToken(externalData).then(function(response) {
								authService.startTimer(externalData);
								},
								function(err) {
									$scope.message = err.error_description;
								});
						});
				} else {
					//Obtain access token and redirect
					var externalData = {
						provider: externalAuthData.provider,
						userName: externalAuthData.username,
						externalAccessToken: externalAuthData.external_access_token
					};
					authService.obtainAccessToken(externalData).then(function(response) {
						authService.startTimer(externalData);
						},
						function(err) {
							$scope.message = err.error_description;
						});
				}
			});
		};
	}
	angular.module('evReg').controller(controllerId, ['$scope', '$http', '$location', '$routeParams', '$q', 'UserAgent', 'authService', 'datacontext', 'common', 'CartModel', 'config', 'ngAuthSettings', controller]);
})();
