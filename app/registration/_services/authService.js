//var testRoles = ['user', 'admin', 'super-user', 'money'];

angular.module('evReg').factory('authService', ['$http', '$q', "$timeout", "$location", 'UserAgent', 'localStorageService', 'ngAuthSettings', "datacontext", 'CartModel', 'config',
	function($http, $q, $timeout, $location, userAgent, localStorageService, ngAuthSettings, datacontext, cart, config) {

		'use strict';

		//var serviceBase = ngAuthSettings.apiServiceBaseUri;
		//var serviceBase = config.apiPath;
		var authServiceFactory = {};

		var _authentication = {
			isAuth: false,
			userName: '',
			useRefreshTokens: false,
			roles: []
		};

		var _externalAuthData = {
			provider: '',
			userName: '',
			externalAccessToken: ''
		};

		var _saveRegistration = function(registration, logout) {
			if (logout) {
				_logOut();
			}
			return $http.post(config.apiPath + 'api/account/register', registration)
				.then(function(response) {
					return response;
				});
		};

		var _forgotPassword = function(registration) {
			_logOut();

			return $http.post(config.apiPath + 'api/account/ForgotPassword', registration)
				.then(function(response) { //, registration
					return response;
				});
		};

		var _resetPassword = function(registration) {
			//_logOut();
			return $http.post(config.apiPath + 'api/account/ResetPassword', registration)
				.then(function(response) { //
					return response;
				});
		};

		var _login = function(loginData) {
			var requestPath = window.location.pathname;
			var roles;
			var deferred = $q.defer();
			var data = 'grant_type=password&username=' + loginData.userName + '&password=' + loginData.password;

			//console.log(loginData);

			if (loginData.useRefreshTokens) {
				data = data + '&client_id=' + ngAuthSettings.clientId;
			}

			if (requestPath === '/dash.html') {
				//Get Roles
				$http.get(config.remoteApiName + 'Account/GetUserRolesByUserIdInArray/' + loginData.userName + '/')
					.then(function(returnedRoles) {
						roles = returnedRoles.data;

						$http.post(config.apiPath + 'token', data, {
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'
							}
						}).success(function (response) {
						    //console.log('success');
							if (loginData.useRefreshTokens) {
								localStorageService.set('authorizationData', {
									token: response.access_token,
									userName: loginData.userName,
									refreshToken: response.refresh_token,
									useRefreshTokens: true,
									roles: roles
								});
							} else {
								localStorageService.set('authorizationData', {
									token: response.access_token,
									userName: loginData.userName,
									refreshToken: '',
									useRefreshTokens: false,
									roles: roles
								});
							}
							//alert('authed!!');
							//need to do something here incase of token login ?????  //mjb  think we are good here
							//nfig.owner.authEmail =
							_authentication.isAuth = true;
							_authentication.userName = loginData.userName;
							_authentication.useRefreshTokens = loginData.useRefreshTokens;
							_authentication.roles = roles;

							deferred.resolve(response);

						}).error(function (err, status) {
						    //console.log('password no bueno');
						    //console.log(err);
						    //console.log(status);
							_logOut();
							deferred.reject(err);
						});
					});
			} else {
				//console.log(data);
				$http.post(config.apiPath + 'token', data, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).success(function(response) {
					//console.log('what is coeming back from this thing');
					//console.log(response);
					if (loginData.useRefreshTokens) {
						//console.log('token success:  useRefreshTokens');
						localStorageService.set('authorizationData', {
							token: response.access_token,
							userName: loginData.userName,
							refreshToken: response.refresh_token,
							useRefreshTokens: true
						});
					} else {
						//console.log('token success:  ELSE useRefreshTokens');
						localStorageService.set('authorizationData', {
							token: response.access_token,
							userName: loginData.userName,
							refreshToken: '',
							useRefreshTokens: false
						});
					}
					_authentication.isAuth = true;
					_authentication.userName = loginData.userName;
					_authentication.useRefreshTokens = loginData.useRefreshTokens;
					deferred.resolve(response);
				}).error(function(err, status) {
					//console.log('bad password');
				    //TODO:  wil put in generic login failed here!!
				    //console.log('password no bueno');
				    //console.log(err);
				    //console.log(status);
				    _logOut();
				    deferred.reject(err);
				    return err;
				});
			}
			return deferred.promise;
		};

		var _logOut = function() {

			localStorageService.remove('authorizationData');

			//alert('unauthed');

			_authentication.isAuth = false;
			_authentication.userName = '';
			_authentication.useRefreshTokens = false;
			_authentication.roles = [];

		};

		var _fillAuthData = function() {

			var authData = localStorageService.get('authorizationData');
			if (authData) {
				_authentication.isAuth = true;
				_authentication.userName = authData.userName;
				_authentication.useRefreshTokens = authData.useRefreshTokens;
				_authentication.roles = authData.roles;
			}

		};

		var _refreshToken = function() {
			var deferred = $q.defer();
			var roles;

			var authData = localStorageService.get('authorizationData');

			if (authData) {

				if (authData.useRefreshTokens) {

					var data = 'grant_type=refresh_token&refresh_token=' + authData.refreshToken + '&client_id=' + ngAuthSettings.clientId;

					localStorageService.remove('authorizationData');

					$http.get(config.remoteApiName + 'Account/GetUserRolesByUserIdInArray/' + loginData.userName + '/')
						.then(function(returnedRoles) {
							roles = returnedRoles.data;

							$http.post(config.apiPath + 'token', data, {
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded'
								}
							}).success(function(response) {

								//TODO: remove this
								//response.roles = testRoles;

								localStorageService.set('authorizationData', {
									token: response.access_token,
									userName: response.userName,
									refreshToken: response.refresh_token,
									useRefreshTokens: true,
									roles: roles,
								});

								deferred.resolve(response);

							}).error(function(err, status) {
								_logOut();
								deferred.reject(err);
							});
						});
				}
			}

			return deferred.promise;
		};

		var _obtainAccessToken = function(externalData) {

			var deferred = $q.defer();
			var roles;

			//$http.get(config.remoteApiName + 'Account/GetUserRolesByUserIdInArray/' + externalData.userName + '/')
			//    .then(function (returnedRoles) {
			//        roles = returnedRoles.data;

			$http.get(config.apiPath + 'api/account/ObtainLocalAccessToken', {
				params: {
					provider: externalData.provider,
					externalAccessToken: externalData.externalAccessToken
				}
			}).success(function(response) {

				//TODO: remove this
				//response.roles = testRoles;

				localStorageService.set('authorizationData', {
					token: response.access_token,
					userName: response.userName,
					refreshToken: '',
					useRefreshTokens: false,
					roles: roles
				});

				_authentication.isAuth = true;
				_authentication.userName = response.userName;
				_authentication.useRefreshTokens = false;
				_authentication.roles = roles;

				deferred.resolve(response);

			}).error(function(err, status) {
				_logOut();
				deferred.reject(err);
			});
			//});
			return deferred.promise;

		};

		var _startTimer = function(regObject) {
			var requestPath = window.location.pathname;
			var returnMessage;

			var timer = $timeout(function() {
				//$timeout.cancel(timer);     //mjb
				//$scope.authentication = authService.authentication;


				if (requestPath === '/dash.html') {
					datacontext.participant.getEmployeeByEmailAddress(regObject.userName, cart.ownerId)
						.then(function(data) {
							cart.employeeId = data.id;
							$location.path('/eventurecenter');
						});
				} else {
					datacontext.participant.getParticipantByEmailAddress(regObject.userName, cart.ownerId)
						.then(function(data) {
								if (data === null || typeof data === 'undefined') {
									$location.path('/new-user/add');
								} else {
									cart.houseId = data.id;
									cart.participantGuid = data.participantGuid;
									userAgent.logAgentInfo(config.owner.ownerId, data.id, 'requestToken'); //log browner/ip
									$location.path(cart.navUrl);
								}
							},
							function(err) {
								returnMessage = err.error_description;
							});
				}
			}, 2000);
			return returnMessage;
		};

		var _registerExternal = function(registerExternalData) {

			var deferred = $q.defer();
			// var roles;

			//$http.get(config.remoteApiName + 'Account/GetUserRolesByUserIdInArray/' + registerExternalData.userName + '/')
			//    .then(function (returnedRoles) {
			//        roles = returnedRoles.data;
			//console.log('booononoee');
			//console.table(registerExternalData);

			$http.post(config.apiPath + 'api/account/RegisterExternal', registerExternalData)
				.success(function(response) {
					//console.log('register extranl seems to have succeeded');
					//TODO: remove this
					//response.roles = testRoles;

					localStorageService.set('authorizationData', {
						token: response.access_token,
						userName: response.userName,
						refreshToken: '',
						useRefreshTokens: false,
						// roles: roles
					});

					_authentication.isAuth = true;
					_authentication.userName = response.userName;
					_authentication.useRefreshTokens = false;
					// _authentication.roles = roles;
					//console.log('geting ready to resolve');
					deferred.resolve(response);

				}).error(function(err, status) {
					//console.log(err);
					_logOut();
					deferred.reject(err);
				});
			//});
			return deferred.promise;

		};

		authServiceFactory.saveRegistration = _saveRegistration;
		authServiceFactory.login = _login;
		authServiceFactory.logOut = _logOut;
		authServiceFactory.fillAuthData = _fillAuthData;
		authServiceFactory.authentication = _authentication;
		authServiceFactory.refreshToken = _refreshToken;
		authServiceFactory.startTimer = _startTimer;
		authServiceFactory.obtainAccessToken = _obtainAccessToken;
		authServiceFactory.externalAuthData = _externalAuthData;
		authServiceFactory.registerExternal = _registerExternal;

		authServiceFactory.forgotPassword = _forgotPassword;
		authServiceFactory.resetPassword = _resetPassword;

		return authServiceFactory;
	}
]);
