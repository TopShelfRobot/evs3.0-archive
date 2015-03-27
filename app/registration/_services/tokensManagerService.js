app.factory('tokensManagerService', ['$http', 'config', function ($http, config) {
	'use strict';

    //var serviceBase = ngAuthSettings.apiServiceBaseUri;
    
    var tokenManagerServiceFactory = {};

    var _getRefreshTokens = function () {

        return $http.get(config.apiPath + 'api/refreshtokens').then(function (results) {
            return results;
        });
    };

    var _deleteRefreshTokens = function (tokenid) {

        return $http.delete(config.apiPath + 'api/refreshtokens/?tokenid=' + tokenid).then(function (results) {
            return results;
        });
    };

    tokenManagerServiceFactory.deleteRefreshTokens = _deleteRefreshTokens;
    tokenManagerServiceFactory.getRefreshTokens = _getRefreshTokens;

    return tokenManagerServiceFactory;
}]);