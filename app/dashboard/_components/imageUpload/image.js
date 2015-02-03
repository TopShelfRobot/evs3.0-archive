(function () {
    'use strict';

    angular
        .module('imageUpload')
        .controller('image', images); 

    images.$inject = ['imageManager'];

    function images(imageManager) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'image manager';
        vm.images = imageManager.images;
        vm.uploading = false;
        vm.previewimage;        
        vm.remove = imageManager.remove;
        vm.setPreviewimage = setPreviewimage;        

        activate();

        function activate() {
            imageManager.load();
        }

        function setPreviewimage(image) {         
            vm.previewimage = image         
        }

        function remove(image) {
            imageManager.remove(image).then(function () {
                setPreviewimage();
            });
        }
    }
})();
