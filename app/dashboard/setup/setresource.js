(function () {
    'use strict';
    
    var controllerId = 'setresource';
    angular.module('dashboard').controller(controllerId, ['common', 'datacontext', setresource]);
    
    function setresource(common, datacontext) {
        //logger.log('made it ehre!');
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'set resource';
        
        activate();

        function activate() {
            common.activateController(createResource(), controllerId)
                .then(function () { log('Activated set resource'); });
        }
        
        function createResource() {
            return datacontext.createResource()
                .then(function (data) {
                    vm.resource = data;
                    //applyFilter();
                    return vm.resource;
                });
        }

    }
})();