; (function () {

    function Service($http, datacontext) {
        this.logAgentInfo = function (ownerId, participantId) {

            var vm = this;
            vm.userAgent = datacontext.participant.createUserAgent(ownerId);
            vm.userAgent.participantId = participantId;
            vm.userAgent.ownerId = ownerId;

            vm.userAgent.browserCodeName = navigator.appCodeName;
            vm.userAgent.browserName = navigator.appName;
            vm.userAgent.browserVersion = navigator.appVersion;
            vm.userAgent.cookiesEnabled = navigator.cookieEnabled || false;
            vm.userAgent.platform = navigator.platform;
            vm.userAgent.header = navigator.userAgent;
            vm.userAgent.systemLanguage = navigator.systemLanguage;

           $http.jsonp('http://ipinfo.io/?callback=JSON_CALLBACK')
                .success(function (data) {
                    vm.userAgent.ip = data.ip;
                    vm.userAgent.hostname = data.hostname;
                    vm.userAgent.latitude = data.loc.split(',')[0]; //Latitude and Longitude
                    vm.userAgent.longitude = data.loc.split(',')[1]; //Latitude and Longitude
                    vm.userAgent.org = data.org; //organization
                    vm.userAgent.city = data.city;
                    vm.userAgent.region = data.region; //state
                    vm.userAgent.country = data.country;
                    vm.userAgent.phone = data.phone; //city area code
                }).error(function () {
                    console.log('no ip info');
                }).finally(function () {
                    datacontext.save(vm.userAgent);
                    return vm.userAgent;
                });
        };
    }

    angular.module('common').service('UserAgent',['$http', 'datacontext', Service]);
})();
