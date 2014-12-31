(function () {
    'use strict';
    var controllerId = 'demographics';
    angular.module('app').controller(controllerId, ['$routeParams', 'common', 'datacontext', 'config', demographics]);

    function demographics($routeParams, common, datacontext, config) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;

        vm.title = 'app';

        vm.eventureId = $routeParams.eventureId;

        vm.ownerId = 1;


        activate();

        function activate() {
            common.activateController(getEventure(), controllerId)
                .then(function () {
                    //log('Activated Eventure Center View');
                });
        }

        function getEventure() {
            return datacontext.eventure.getEventureById(vm.eventureId)
                .then(function (data) {
                    return vm.eventure = data;
                });
        }

        vm.chartOptions = {
            theme: 'material',
            tooltip: {
                visible: true,
                format: '{0}%',
                template: '#= value #'
            }
        };

        var ageApi = config.remoteApiName + 'analytic/GetAgePieChartByEventureId/' + vm.ownerId + '/' + vm.eventureId;

        vm.age= new kendo.data.DataSource({
            transport: {
                read: {
                    url: ageApi,
                    dataType: 'json'
                }
            }
        });

        var genderApi = config.remoteApiName + 'analytic/GetGenderPieChartByEventureId/' + vm.ownerId + '/' + vm.eventureId;

        vm.gender= new kendo.data.DataSource({
            transport: {
                read: {
                    url: genderApi,
                    dataType: 'json'
                }
            }
        });

        var zipApi = config.remoteApiName + 'analytic/GetZipCodeBarChartByEventureId/' + vm.ownerId + '/' + vm.eventureId;

        vm.zip = new kendo.data.DataSource({
            transport: {
                read: {
                    url: zipApi,
                    dataType: "json"
                }
            }
        });

        var stateApi = config.remoteApiName + 'analytic/GetStateColumnChartByEventureId/' + vm.ownerId + '/' + vm.eventureId;

        vm.state = new kendo.data.DataSource({
            transport: {
                read: {
                    url: stateApi,
                    dataType: "json"
                }
            }
        });

    }
})();