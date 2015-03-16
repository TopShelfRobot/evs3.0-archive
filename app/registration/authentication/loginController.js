(function () {

    'use strict';

    var controllerId = 'loginController';

    function controller($scope, $location, $routeParams, userAgent, authService, datacontext, common, cart, config, ngAuthSettings) {

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

        //$scope.loginData.useRefreshTokens = true;

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
            //var redirectUri = location.protocol + '//' + location.host + cart.navUrl;

            //alert(redirectUri);
            console.log('logging innnnnnnnnnnnnnnnnnnnnnnn');
            console.log(redirectUri);
            console.log(provider);
            console.log(ngAuthSettings.clientId);

            var externalProviderUrl = config.apiPath + 'api/Account/ExternalLogin?provider=' + provider + '&response_type=token&client_id=' + ngAuthSettings.clientId + '&redirect_uri=' + redirectUri;
            window.$windowScope = $scope;
            var oauthWindow = window.open(externalProviderUrl, 'Authenticate Account', 'location=0,status=0,width=600,height=750');
        };

        $scope.authCompletedCB = function (fragment) {
            //console.log('hello woerld');
            //alert('hello woerld');
            $scope.$apply(function () {
                if (fragment.haslocalaccount == 'False') {
                    authService.logOut();

                    //console.log('hello woerld farge');
                    //console.table(fragment);
                    //alert('fragmetn');

                    authService.externalAuthData = {
                        provider: fragment.provider,
                        userName: fragment.username,
                        externalAccessToken: fragment.external_access_token
                    };
                    console.log(authService.externalAuthData);

                    authService.registerExternal(authService.externalAuthData)
                    .then(function (response) {
                        //console.log('hererererererer');
                        //console.table(response);
                        authService.startTimer(authService.externalAuthData);
                    });
                } else {
                    //Obtain access token and redirect to orders
                    var externalData = {
                        provider: fragment.provider,
                        externalAccessToken: fragment.external_access_token
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
    angular.module('evReg').controller(controllerId, ['$scope', '$location', '$routeParams', 'UserAgent', 'authService', 'datacontext', 'common', 'CartModel', 'config', 'ngAuthSettings', controller]);
})();
