(function() {
    'use strict';

    var controllerId = 'setbundle';
    angular.module('app').controller(controllerId, ['$q', '$routeParams', '$upload', '$http', '$timeout', '$location', 'common', 'datacontext', 'config', setbundle]);

    function setbundle($q, $routeParams, $upload, $http, $timeout, $location, common, datacontext, config) {

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Eventure';
        vm.bundleId = $routeParams.bundleId || 0;

        vm.ownerId = config.owner.ownerId;

        vm.bundle = {};
        var listings = [];

        activate();

        function activate() {
            common.activateController(getEventureLists(),  controllerId)
                .then(function() {

                });
        }

        function getBundle() {

            if (vm.bundleId > 0) {
                return datacontext.surcharge.getAddonById(vm.addonId)
                    .then(function(data) {
                        //applyFilter();
                        return vm.addon = data;
                    });
            } else {
                return vm.addon = datacontext.surcharge.createAddon();
            }
        }

        function getEventureLists() {

            return datacontext.eventure.getEventureListsByOwnerId(vm.ownerId)
                .then(function(data) {
                    multiSelect(data);
                });
        }

        function multiSelect(listings) {
            vm.bundledListOptions = {
                placeholder: "Select listing...",
                dataTextField: "name",
                dataValueField: "id",
                dataSource: {
                    data: listings
                }
            };
            console.log(vm.bundledListOptions);
        }

        vm.cancel = function() {
            return datacontext.cancel()
                .then(complete);

            function complete() {
                $location.path("/#");
            }
        };

        vm.saveAndNav = function() {
            return datacontext.save(vm.addon)
                .then(complete);

            function complete() {
                $location.path("/#");
            }
        };

    }
})();