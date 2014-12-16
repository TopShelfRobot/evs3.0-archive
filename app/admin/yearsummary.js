(function () {
    'use strict';
    var controllerId = 'yearsummary';
    angular.module('app').controller(controllerId, ['$routeParams', 'config', 'common', 'datacontext', yearsummary]);

    function yearsummary($routeParams, config, common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;

        vm.title = 'app';

        vm.eventureId = $routeParams.eventureId;

        vm.chart = {
            startYear: 2013,
            endYear: 2014,
            //eventureId: 1,
            type: 0
        };

        vm.eventures = [];

        vm.ownerId = config.owner.ownerId;

        activate();

        function activate() {
            var promises = [getEventures(), Chart()];
            //var promises = [];
            common.activateController(promises, controllerId)
                .then(function () {
                    //log('Activated Coupon Addon Center View');
                });
        }

        var min = vm.min = moment('2000-01-01');
        var max = vm.max = moment(new Date()); // Defaults to now

        vm.years = [];

        for (var i=max.years(); i>=min.years(); i--) {
            vm.years.push(i);
        }

        function getEventures() {
            return datacontext.eventure.getEventuresByOwnerId(vm.ownerId)
                .then(function(data) {
                    //applyFilter();
                    vm.eventures = data;
                    return vm.eventures;
                });
        }

        vm.generateChart = function () {
                    
            var chart = vm.summaryChart;
            
            var dataSource = new kendo.data.DataSource({
                 transport: {
                     read: {
                         url: function () {
                             return config.remoteApiName + 'analytic/GetYearOverYearData/' + vm.ownerId + '/' + vm.eventureId  + '/' + vm.chart.startYear  + '/' + vm.chart.endYear  + '/' + vm.chart.type;
                         },
                         dataType: "json"
                     }
                 },
                 group: {
                     field: "year"
                 },
                 sort: {
                     field: "month",
                     dir: "asc"
                 },
                 schema: {
                     model: {
                         fields: {
                             month: {
                                 type: "date"
                             }
                         }
                     }
                 }
               });
            
            chart.setDataSource(dataSource);
           
            //.refresh();
        };

         function Chart() {

            //var yearapi = config.remoteApiName + 'analytic/GetYearOverYearData/1/1/2013/2014/0';

             var yearapi = config.remoteApiName + 'analytic/GetYearOverYearData/' + vm.ownerId + '/' + vm.eventureId + '/' + vm.chart.startYear + '/' + vm.chart.endYear + '/' + vm.chart.type;

            vm.yearOverYear = {
                theme: "material",
                 dataSource: {
                     transport: {
                         read: yearapi,
                         dataType: "json"
                     },
                     group: {
                        field: "year"
                     },
                     sort: {
                         field: "month",
                         dir: "asc"
                     },
                     schema: {
                         model: {
                             fields: {
                                 month: {
                                     type: "date"
                                 }
                             }
                         }
                     }
                 },
                 
                legend: {
                    position: "bottom"
                },
                series: [{
                    type: "column",
                    field: "registrations"   //,
                    //name: "#= group.value # (close)"   //tool tips
                }],
                valueAxis: {
                    line: {
                        visible: false
                    }
                },
                categoryAxis: {
                    field: "month",
                    labels: {
                        format: "MMM"
                    }
                }
            };
        }
    }
})();
