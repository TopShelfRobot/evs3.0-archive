
(function () {

    'use strict';

    var controllerId = "loginController";


    function controller($scope, $location, $routeParams, authService, datacontext, common, cart, ngAuthSettings) {

        $scope.loginData = {
            userName: "",
            password: "",
            useRefreshTokens: false
        };

        $scope.requestPath = $routeParams.requestPath;
        $scope.isDash = false;

        var requestPath = window.location.pathname;

        if (requestPath === '/dash.html') {
            $scope.isDash = true;
        }

        //$scope.loginData.useRefreshTokens = true;

        $scope.message = "";

        common.activateController(controllerId);

        $scope.login = function () {
            authService.login($scope.loginData).then(function (response) {
                datacontext.participant.getParticipantByEmailAddress($scope.loginData.userName, cart.ownerId)
                   .then(function (data) {
                       console.log(data);
                   });
                if (requestPath === '/dash.html') {
                    $location.path('/eventurecenter');
                }
                else {
                    if (typeof $scope.requestPath === 'undefined') {
                        $location.path('/eventure');
                    }
                    else {
                        window.location.href = $scope.requestPath;
                    }
                }
            },
                 function (err) {
                     $scope.message = err.error_description;
                 });
        };

        $scope.authExternalProvider = function (provider) {
            var redirectUri = location.protocol + '//' + location.host + '/authcomplete.html';
            alert(redirectUri);
            var externalProviderUrl = config.apiPath + "api/Account/ExternalLogin?provider=" + provider + "&response_type=token&client_id=" + ngAuthSettings.clientId + "&redirect_uri=" + redirectUri;
            window.$windowScope = $scope;
            var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
        };

        $scope.authCompletedCB = function (fragment) {
            $scope.$apply(function () {
                if (fragment.haslocalaccount == 'False') {
                    authService.logOut();

                    authService.externalAuthData = {
                        provider: fragment.provider,
                        userName: fragment.external_user_name,
                        externalAccessToken: fragment.external_access_token
                    };
                    $location.path('/associate');
                }
                else {
                    //Obtain access token and redirect to orders
                    var externalData = { provider: fragment.provider, externalAccessToken: fragment.external_access_token };
                    authService.obtainAccessToken(externalData).then(function (response) {

                        $location.path('/orders');
                    },
                 function (err) {
                     $scope.message = err.error_description;
                 });
                }
            });
        }
    }
    angular.module("evReg").controller(controllerId, ["$scope", "$location", "$routeParams", "authService", "datacontext", "common", "CartModel", "ngAuthSettings", controller]);
})();
