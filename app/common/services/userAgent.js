; (function () {

    function Service(http, datacontext) {
        this.logAgentInfo = function (participant) {
            //var today = new Date();
            //var birthDate = new Date(dateString);
            //var age = today.getFullYear() - birthDate.getFullYear();
            //var m = today.getMonth() - birthDate.getMonth();
            //if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            //    age--;
            //}
            //return age;


            //var logText = "<p>Browser CodeName: " + navigator.appCodeName + "</p>";
            //logText += "<p>Browser Name: " + navigator.appName + "</p>";
            //logText += "<p>Browser Version: " + navigator.appVersion + "</p>";
            //logText += "<p>Cookies Enabled: " + navigator.cookieEnabled + "</p>";
            //logText += "<p>Platform: " + navigator.platform + "</p>";
            //logText += "<p>User-agent header: " + navigator.userAgent + "</p>";
            //logText += "<p>User-agent language: " + navigator.systemLanguage + "</p>";
            //alert(logText);
            var vm = this;


            vm.userAgent = datacontext.participant.createUserAgent();

            vm.appCodeName = navigator.appName;
            vm.appVersion = navigator.appVersion
            vm.cookieEnabled = navigator.cookieEnabled
            vm.platform = navigator.platform
            vm.userAgent = navigator.userAgent
            vm.systemLanguage = navigator.systemLanguage
            

            $http.jsonp('http://ipinfo.io/?callback=JSON_CALLBACK')
                .success(function (data) {
                    vm.ip = data.ip;
                    vm.hostname = data.hostname;
                    vm.loc = data.loc; //Latitude and Longitude
                    vm.org = data.org; //organization
                    vm.city = data.city;
                    vm.region = data.region; //state
                    vm.country = data.country;
                    vm.phone = data.phone; //city area code
                }).error(function () {
                    console.log('no ip info');
                }).finally(function () {
                    //save changes
                });

        };
    }

    angular.module("common").service("UserAgent",['$http', 'datacontext', Service]);
})();