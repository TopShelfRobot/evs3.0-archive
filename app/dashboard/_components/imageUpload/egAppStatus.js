(function() {
    'use strict';

    angular
        .module('app')
        .directive('egAppStatus', egAppStatus);

    egAppStatus.$inject = ['appInfo'];
    
    function egAppStatus(appInfo) {     
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/dashboard/_components/imageUpload/egAppStatus.html'
        };
        return directive;

        function link(scope, element, attrs) {     
            scope.status = appInfo.status;
        }
    }

})();