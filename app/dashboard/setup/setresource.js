(function () {
    'use strict';

    var controllerId = 'setresource';
    angular.module('app').controller(controllerId, ['$q', '$routeParams', '$upload', '$http', '$timeout', '$location', 'common', 'datacontext', 'config', setresource]);

    function setresource($q, $routeParams, $upload, $http, $timeout, $location, common, datacontext, config) {
        //logger.log('made it ehre!');
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'set resource';
        vm.resource = {};
        vm.resourceId = $routeParams.resourceId || 0;

        activate();

        function activate() {
            common.activateController(getResource(), controllerId)
                .then(function () { 
                  //log('Activated set resource'); 
                });
        }

        function getResource() {

            if (vm.resourceId > 0) {
                return datacontext.resource.getResourceById(vm.resourceId)
                    .then(function(data) {
                        //applyFilter();
                        return vm.resource = data;
                    });
            } else {
                return vm.resource = datacontext.resource.createResource();
            }
        }
      
        vm.cancel = function() {
          return datacontext.cancel()
            .then(complete);
          
            function complete() {
              $location.path("/resourcecenter");
            }
        };

        vm.saveAndNav = function() {
            return datacontext.save(vm.resource)
                .then(complete);

            function complete() {
                $location.path("/resourcecenter");
            }
        };

    }
})();
