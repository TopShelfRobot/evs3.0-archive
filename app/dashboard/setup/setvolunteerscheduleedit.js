(function () {
    'use strict';

    var controllerId = 'setvolunteerschedule';
    angular.module('app').controller(controllerId, ['$q', '$routeParams', '$upload', '$http', '$timeout', '$location', 'common', 'datacontext', 'config', setvolunteerschedule]);

    function setvolunteerschedule($q, $routeParams, $upload, $http, $timeout, $location, common, datacontext, config) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.volunteerschedule = {};
        vm.volunteerId = $routeParams.volunteerId || 0;

        activate();

        function activate() {
            common.activateController(getVolunteerSchedule(), controllerId)
                .then(function () { log('Activated Volunteer Schedule Edit'); });
        }

        function getVolunteerSchedule() {
                return datacontext.volunteer.getVolunteerScheduleById(vm.volunteerId)
                    .then(function(data) {
                        //applyFilter();
                        return vm.volunteerschedule = data;
                    });
        }
      
        vm.cancel = function() {
          return datacontext.cancel()
            .then(complete);
          
            function complete() {
              $location.path("/volunteercenter");
            }
        };

        vm.saveAndNav = function() {
            return datacontext.save(vm.volunteerschedule)
                .then(complete);

            function complete() {
                $location.path("/volunteercenter");
            }
        };

    }
})();
