(function () {
    'use strict';
    var controllerId = 'ownerController';
    angular.module('app').controller(controllerId, ['config', 'common', 'datacontext', ownerController]);

    function ownerController(config, common, datacontext) {
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
                        return vm.owner = data;
                    });
        }

        vm.stripeConnect = function() {
            if (confirm('Are you sure you wish to proceed?')) {
                alert('true');
                //Not sure if you can use $location. Might have to use window.location
                //$location('https://connect.stripe.com/oauth/authorize?response_type=code&scope=read_write&stripe_landing=login&client_id=ca_2JOTAhBu2gVayLgbZaYy8KQXBm2GveXD');
            } else {
                // Do nothing!
                alert('false');
            }
        };

        vm.stripeDevConnect = function() {
            if (confirm('Are you sure you wish to proceed?')) {
                alert('true');
                //Not sure if you can use $location. Might have to use window.location
                //$location('https://connect.stripe.com/oauth/authorize?response_type=code&scope=read_write&stripe_landing=login&client_id=ca_2JOTjDvfxSx9tzuIN9f5ZCLELpfdgJdn');
            } else {
                // Do nothing!
                alert('false');
            }
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

