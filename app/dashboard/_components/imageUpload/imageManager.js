(function () {
    'use strict';

    angular
        .module('imageUpload')
        .factory('imageManager', imageManager);

    imageManager.$inject = ['$q', 'imageManagerClient', 'appInfo'];

    function imageManager($q, imageManagerClient, appInfo) {
        var service = {
            images: [],
            load: load,
            upload: upload,
            remove: remove,
            imageExists: imageExists,
            status: {
                uploading: false
            }
        };

        return service;

        function load() {
            appInfo.setInfo({busy:true, message:"loading image"})
            
            service.images.length = 0;

            return imageManagerClient.query()
                                .$promise
                                .then(function (result) {                                    
                                    result.images
                                            .forEach(function (image) {
                                                    service.images.push(image);
                                                });

                                    appInfo.setInfo({message: "image loaded successfully"});

                                    return result.$promise;
                                },
                                function (result) {
                                    appInfo.setInfo({message: "something went wrong: " + result.data.message});
                                    return $q.reject(result);
                                })                   
                                ['finally'](
                                function () {
                                    appInfo.setInfo({busy: false});
                                });
        }

        function upload(images)
        {
            service.status.uploading = true;
            appInfo.setInfo({ busy: true, message: "uploading images" });            

            var formData = new FormData();

            angular.forEach(images, function (image) {
                formData.append(image.name, image);
            });

            return imageManagerClient.save(formData)
                                        .$promise
                                        .then(function (result) {
                                            if (result && result.images) {
                                                result.images.forEach(function (image) {
                                                    if (!imageExists(image.name)) {
                                                        service.images.push(image);
                                                    }
                                                });
                                            }

                                            appInfo.setInfo({message: "image uploaded successfully"});

                                            return result.$promise;
                                        },
                                        function (result) {
                                            appInfo.setInfo({message: "something went wrong: " + result.data.message});
                                            return $q.reject(result);
                                        })
                                        ['finally'](
                                        function () {
                                            appInfo.setInfo({ busy: false });                                            
                                            service.status.uploading = false;
                                        });
        }

        function remove(image) {
            appInfo.setInfo({ busy: true, message: "deleting image " + image.name });            

            return imageManagerClient.remove({fileName: image.name})
                                        .$promise
                                        .then(function (result) {
                                            //if the image was deleted successfully remove it from the images array
                                            var i = service.images.indexOf(image);
                                            service.images.splice(i, 1);

                                            appInfo.setInfo({message: "images deleted"});

                                            return result.$promise;
                                        },
                                        function (result) {
                                            appInfo.setInfo({message: "something went wrong: " + result.data.message});
                                            return $q.reject(result);
                                        })
                                        ['finally'](
                                        function () {
                                            appInfo.setInfo({busy: false});
                                        });
        }

        function imageExists(imageName) {
            var res = false
            service.images.forEach(function (image) {
                if (image.name === imageName) {
                    res = true;
                }
            });

            return res;
        }
    }
})();