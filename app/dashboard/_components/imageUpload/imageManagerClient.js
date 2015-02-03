(function () {
    'use strict';

    angular
        .module('imageUpload')
        .factory('imageManagerClient', 'config', imageManagerClient);

    imageManagerClient.$inject = ['$resource'];

    function imageManagerClient($resource, config) {
        return $resource(config.remoteApiName + "image/:fileName",
                { id: "@fileName" },
                {
                    'query': {method:'GET'},
                    'save': { method: 'POST', transformRequest: angular.identity, headers: { 'Content-Type': undefined } },
                    'remove':{method: 'DELETE', url: config.remoteApiName + '/image/:fileName', params:{name:'@fileName'}}
                });
    }
})();