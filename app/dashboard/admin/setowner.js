(function () {
    'use strict';
    var controllerId = 'ownerController';
    angular.module('app').controller(controllerId, ['$upload', '$timeout', 'config', 'common', 'datacontext', ownerController]);

    function ownerController($upload, $timeout, config, common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;

        vm.title = 'app';

        vm.ownerId = config.owner.ownerId;
        vm.owner = {};


        activate();

        function activate() {
            var promises = [getOwnerById()];
            common.activateController(promises, controllerId)
                .then(function () {
                    //log('Activated Set Owner View');
                });
        }

        function getOwnerById() {
            return datacontext.participant.getOwnerById(vm.ownerId)
                    .then(function(data) {
                        //applyFilter();
						vm.owner = data;
                        return vm.owner;
                    });
        }

        vm.stripeConnect = function () {
            if (confirm('Are you sure you wish to proceed?')) {
                console.log('PRODUCTION');
                //Not sure if you can use $location. Might have to use window.location
                //$location('https://connect.stripe.com/oauth/authorize?response_type=code&scope=read_write&stripe_landing=login&client_id=ca_2JOTAhBu2gVayLgbZaYy8KQXBm2GveXD');
                window.location.href = 'https://connect.stripe.com/oauth/authorize?response_type=code&scope=read_write&stripe_landing=login&client_id=ca_2JOTAhBu2gVayLgbZaYy8KQXBm2GveXD';
            } else {
                // Do nothing!
                console.log('false');
            }
        };

        vm.stripeDevConnect = function () {
            if (confirm('Are you sure you wish to proceed?')) {
                console.log('dev');
                //Not sure if you can use $location. Might have to use window.location
                //$location('https://connect.stripe.com/oauth/authorize?response_type=code&scope=read_write&stripe_landing=login&client_id=ca_2JOTjDvfxSx9tzuIN9f5ZCLELpfdgJdn');
                window.location.href = 'https://connect.stripe.com/oauth/authorize?response_type=code&scope=read_write&stripe_landing=login&client_id=ca_2JOTjDvfxSx9tzuIN9f5ZCLELpfdgJdn';
            } else {
                // Do nothing!
                console.log('false');
            }
        };

        vm.upload = function (file) {
          vm.owner.logoImageName = file[0].name;
          file.upload = $upload.upload({
            url: config.remoteApiName + 'image',
            method: 'POST',
            headers: {
              'my-header' : 'my-header-value'
            },
            data: {aaa:'aaa'},
            sendObjectsAsJsonBlob: false,
            file: file,
            fileFormDataName: 'myFile',
          });

          file.upload.then(function(response) {
            $timeout(function() {
              file.result = response.data;
            });
          }, function(response) {
            if (response.status > 0) {
              vm.errorMsg = response.status + ': ' + response.data;
            }
          });

          file.upload.progress(function(evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
          });

          file.upload.xhr(function(xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
          });
        };


        vm.saveAndNav = function() {
            return datacontext.save()
                .then(complete);

            function complete() {
                //alert("Changes have been saved.");
            }
        };
    }
})();
