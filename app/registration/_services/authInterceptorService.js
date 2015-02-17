angular.module('evReg').factory('authInterceptorService', ['$q', '$location', 'localStorageService', function ($q, $location, localStorageService) {
	'use strict';

    //angular.module('evReg').factory('authService', ['$http', '$q', 'localStorageService', 'ngAuthSettings',
    //function ($http, $q, localStorageService, ngAuthSettings) {


    var authInterceptorServiceFactory = {};

    var _request = function (config) {

        config.headers = config.headers || {};

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            config.headers.Authorization = 'Bearer ' + authData.token;
        }

        return config;
    };

    var _responseError = function (rejection) {
        if (rejection.status === 401) {
            var requestPath = window.location;
            $location.path('/login/' + requestPath);
        }
        return $q.reject(rejection);
    };

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
}]);