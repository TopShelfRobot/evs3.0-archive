(function () {
    'use strict';

    var controllerId = 'setresource';
    angular.module('app').controller(controllerId, ['common', 'datacontext', setresource]);

    function setresource(common, datacontext) {
        //logger.log('made it ehre!');
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'set resource';
        vm.resource = [];
        activate();

        function activate() {
            common.activateController(getResource(), controllerId)
                .then(function () { log('Activated set resource'); });
        }

        function getResource() {
            return datacontext.getResourceById(1)
                .then(function (data) {
                    vm.resource = data;
                    return vm.resource;
                });
        }

    }
})();
