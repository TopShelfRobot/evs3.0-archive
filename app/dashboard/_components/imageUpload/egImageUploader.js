(function () {
    'use strict';

    angular
        .module('imageUpload')
        .directive('egImageUploader', egImageUploader);

    egImageUploader.$inject = ['appInfo','imageManager'];

    function egImageUploader(appInfo, imageManager) {

        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/dashboard/_components/imageUpload/egImageUploader.html',
            scope: true
        };
        return directive;

        function link(scope, element, attrs) {
            scope.hasFiles = false;
            scope.images = [];            
            scope.upload = imageManager.upload;
            scope.appStatus = appInfo.status;
            scope.imageManagerStatus = imageManager.status;
        }
    }
})();