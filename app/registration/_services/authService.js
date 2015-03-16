//var testRoles = ['user', 'admin', 'super-user', 'money'];

angular.module('evReg').factory('authService', ['$http', '$q', "$timeout", "$location", 'UserAgent', 'localStorageService', 'ngAuthSettings', "datacontext", 'CartModel', 'config',
    function ($http, $q, $timeout, $location, userAgent, localStorageService, ngAuthSettings, datacontext, cart, config) {

        'use strict';

        //var serviceBase = ngAuthSettings.apiServiceBaseUri;
        var serviceBase = config.apiPath;
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

        var _saveRegistration = function (registration, logout) {
            if (logout) {
                _logOut();
            }
            return $http.post(serviceBase + 'api/account/register', registration)
                .then(function (response) {
                    return response;
                });
        };

        var _forgotPassword = function (registration) {
            _logOut();

            return $http.post(serviceBase + 'api/account/ForgotPassword', registration)
                .then(function (response) { //, registration
                    return response;
                });
        };

        var _resetPassword = function (registration) {
            //_logOut();
            return $http.post(serviceBase + 'api/account/ResetPassword', registration)
                .then(function (response) { //
                    return response;
                });
        };

        var _login = function (loginData) {
            var roles;
            var deferred = $q.defer();
            var data = 'grant_type=password&username=' + loginData.userName + '&password=' + loginData.password;

            if (loginData.useRefreshTokens) {
                data = data + '&client_id=' + ngAuthSettings.clientId;
            }

            $http.get(config.remoteApiName + 'Account/GetUserRolesByUserIdInArray/' + loginData.userName + '/')
              .then(function (returnedRoles) {
                  roles = returnedRoles.data;

                  $http.post(serviceBase + 'token', data, {
                      headers: {
                          'Content-Type': 'application/x-www-form-urlencoded'
                      }
                  }).success(function (response) {
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
                      _logOut();
                      deferred.reject(err);
                  });
              });
            return deferred.promise;

        };

        var _logOut = function () {

            localStorageService.remove('authorizationData');

            //alert('unauthed');

            _authentication.isAuth = false;
            _authentication.userName = '';
            _authentication.useRefreshTokens = false;
            _authentication.roles = [];

        };

        var _fillAuthData = function () {

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
                _authentication.useRefreshTokens = authData.useRefreshTokens;
                _authentication.roles = authData.roles;
            }

        };

        var _refreshToken = function () {
            var deferred = $q.defer();
            var roles;

            var authData = localStorageService.get('authorizationData');

            if (authData) {

                if (authData.useRefreshTokens) {

                    var data = 'grant_type=refresh_token&refresh_token=' + authData.refreshToken + '&client_id=' + ngAuthSettings.clientId;

                    localStorageService.remove('authorizationData');

                    $http.get(config.remoteApiName + 'Account/GetUserRolesByUserIdInArray/' + loginData.userName + '/')
                 .then(function (returnedRoles) {
                     roles = returnedRoles.data;

                     $http.post(serviceBase + 'token', data, {
                         headers: {
                             'Content-Type': 'application/x-www-form-urlencoded'
                         }
                     }).success(function (response) {

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

                     }).error(function (err, status) {
                         _logOut();
                         deferred.reject(err);
                     });
                 });
                }
            }

            return deferred.promise;
        };

        var _obtainAccessToken = function (externalData) {

            var deferred = $q.defer();
            var roles;

            //$http.get(config.remoteApiName + 'Account/GetUserRolesByUserIdInArray/' + externalData.userName + '/')
            //    .then(function (returnedRoles) {
            //        roles = returnedRoles.data;

                    $http.get(serviceBase + 'api/account/ObtainLocalAccessToken', {
                        params: {
                            provider: externalData.provider,
                            externalAccessToken: externalData.externalAccessToken
                        }
                    }).success(function (response) {

                        //TODO: remove this
                        //response.roles = testRoles;

                        localStorageService.set('authorizationData', {
                            token: response.access_token,
                            userName: response.userName,
                            refreshToken: '',
                            useRefreshTokens: false,
                            roles:roles
                        });

                        _authentication.isAuth = true;
                        _authentication.userName = response.userName;
                        _authentication.useRefreshTokens = false;
                        _authentication.roles = roles;

                        deferred.resolve(response);

                    }).error(function (err, status) {
                        _logOut();
                        deferred.reject(err);
                    });
                //});
            return deferred.promise;

        };

        var _startTimer = function (regObject) {
            var returnMessage;
            var timer = $timeout(function () {
                $timeout.cancel(timer);
                //authService.login($scope.registration).then(function () {
                _login(regObject).then(function () {
                    //$scope.authentication = authService.authentication;

                    datacontext.participant.getParticipantByEmailAddress(_authentication.userName, cart.ownerId)
                      .then(function (data) {
                          console.log('after part call');
                          console.table(data);
                          if (data === null || typeof data === 'undefined') {
                              $location.path('/new-user/add');
                          } else {
                              cart.houseId = data.id;
                              $location.path(cart.navUrl);
                          }
                      });
                },
                  function (err) {
                      returnMessage = err.error_description;
                  });
            }, 2000);
            return returnMessage;
        };

        var _registerExternal = function (registerExternalData) {

            var deferred = $q.defer();
            var roles;

            //$http.get(config.remoteApiName + 'Account/GetUserRolesByUserIdInArray/' + registerExternalData.userName + '/')
            //    .then(function (returnedRoles) {
            //        roles = returnedRoles.data;

            console.table(registerExternalData);

            $http.post(serviceBase + 'api/account/RegisterExternal', registerExternalData).success(function (response) {

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

                    }).error(function (err, status) {
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
    }]);
