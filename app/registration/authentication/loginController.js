(function () {

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

		$scope.login = function () {
				authService.login($scope.loginData)
					.then(function (response) {
						$scope.authentication = authService.authentication;
						if (requestPath === '/dash.html') {
							datacontext.participant.getEmployeeByEmailAddress($scope.authentication.userName, cart.ownerId)
								.then(function (data) {
									cart.employeeId = data.id;
									$location.path('/eventurecenter');
								});
						} else {
							datacontext.participant.getParticipantByEmailAddress($scope.authentication.userName, cart.ownerId)
								.then(function (data) {
									if (data === null || typeof data === 'undefined') {
										$location.path('/new-user/add');
									} else {
										cart.houseId = data.id;
										userAgent.logAgentInfo(config.owner.ownerId, data.id, 'requestToken'); //log browner/ip
										$location.path(cart.navUrl);
									}
								});
						}
					});
			},
			function (err) {
				$scope.message = err.error_description;
			};

		$scope.authExternalProvider = function (provider) {
			var redirectUri = location.protocol + '//' + location.host + '/app/registration/authentication/authcomplete.html';
			//console.log(redirectUri);
			//console.log(provider);
			//console.log(ngAuthSettings.clientId);

			var externalProviderUrl = config.apiPath +
				'api/Account/ExternalLogin?provider=' + provider +
				'&response_type=token&client_id=' + ngAuthSettings.clientId +
				'&redirect_uri=' + redirectUri;

			window.$windowScope = $scope;
			var oauthWindow = window.open(externalProviderUrl, 'Authenticate Account', 'location=0,status=0,width=600,height=750');
		};

		$scope.facebookLogin = function (provider) {
		    //console.log(provider);

		    //var deferred = $q.defer();

		    FB.getLoginStatus(function (response) {
		        if (response.status === 'connected') {
		            console.log('Logged in.');
		        } else {
		            FB.login(function (response) {
		                console.log('a');
		                console.log(response);
		                FB.api('/me', {
		                    fields: 'email'
		                }, function (graphApi) {
		                    //console.log('b');
		                    //console.log(graphApi);
		                    //console.log(provider);
		                    //console.log(response);

		                    //$http.get(config.apiPath + 'api/Account/GetLocalAccount/' + graphApi.email + '/')
                            //  .then(function (result) {

                                  //console.log(result);
                                  var externalAuthData = {
                                      provider: 'Facebook',
                                      email: graphApi.email,
                                      accessToken: response.authResponse.accessToken,
                                      hasLocalAccount: false   //result.data.exists
                                  };
                                  console.log(externalAuthData);
		                    //deferred.resolve(result);
                                  $scope.authCompletedCB(externalAuthData);

                              //});
		                });
		                //return deferred.promise;
		            })
                    //    .then(function () {
		               
		            //});
		        }
		    });
            //    .then(function () {
		    //    $scope.authCompletedCB(externalAuthData);
		    //});
                //.then(function (provider) {
			    //FB.api('/me', {
			    //    fields: 'email'
			    //}, function (email, provider, response) {
			    //    console.log(email);
			    //    console.log(provider);
			    //    console.log(response);
			    //    //post to api for hasRegistered flag
			    //    $http.post(config.apiPath + 'api/account/GetLocalAccount', email)
                //        .success(function (result) {
                //            var externalAuthData = {
                //                provider: provider,
                //                email: email,
                //                accessToken: response.authResponse.accessToken,
                //                hasLocalAccount: result
                //            };
                //            $scope.authCompleteCB(externalAuthData);
                //        }).error(function (err) {
                //            $scope.message = err.error_description;
                //        });
			    //});
			//});
		};

		$scope.authCompletedCB = function (externalAuthData) {
			console.log('External', externalAuthData);
			$scope.$apply(function () {
				if (externalAuthData.hasLocalAccount === false) {
					authService.logOut();

					authService.externalAuthData = {
						provider: externalAuthData.provider,
						userName: externalAuthData.email,
						externalAccessToken: externalAuthData.accessToken
					};
					console.log(authService.externalAuthData);

					authService.registerExternal(authService.externalAuthData)
						.success(function (response) {
							//console.log('hererererererer');
							console.table(response);
							authService.startTimer(authService.externalAuthData);
						}).error(function (err) {
							console.log('trying to defer error');
							console.log(err);
							//console.table(response);
							authService.startTimer(authService.externalAuthData);
						});
				} else {
					//Obtain access token and redirect to orders
					var externalData = {
						provider: externalAuthData.provider,
						externalAccessToken: externalAuthData.accessToken
					};
					authService.obtainAccessToken(externalData).then(function (response) {
							$location.path('/orders');
						},
						function (err) {
							$scope.message = err.error_description;
						});
				}
			});
		};
	}

	angular.module('evReg').controller(controllerId, ['$scope', '$http', '$location', '$routeParams', '$q', 'UserAgent', 'authService', 'datacontext', 'common', 'CartModel', 'config', 'ngAuthSettings', controller]);
})();
