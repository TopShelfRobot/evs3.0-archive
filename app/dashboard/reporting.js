(function () {
    'use strict';
    var controllerId = 'reporting';
    angular.module('app').controller(controllerId, ['common', 'datacontext', reporting]);

    function reporting(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        
        //vm.messageCount = 0;
        //vm.people = [];
        vm.title = 'app';
        
        vm.reports = [];

        activate();

        function activate() {
            //var promises = [getMessageCount(), getPeople()];
            log('Activated reporting View11111111111111111111111');
            common.activateController(getReports(), controllerId)
                .then(function () { log('Activated reporting View'); });
        }

      function getReports() {
          return datacontext.getReportsByOwnerId(1)
              .then(function (data) {
                  vm.reports = data;
                  return vm.reports;
              });
      }
        
     

    }
})();