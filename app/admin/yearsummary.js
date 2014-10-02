(function () {
    'use strict';
    var controllerId = 'yearsummary';
    angular.module('app').controller(controllerId, ['config', 'common', 'datacontext', yearsummary]);

    function yearsummary(config, common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;

        vm.title = 'app';



        vm.ownerId = 1;

        activate();

        function activate() {
            var promises = [Chart()];
            //var promises = [];
            common.activateController(promises, controllerId)
                .then(function () {
                    //log('Activated Coupon Addon Center View');
                });
        }

        vm.generateChart = function () {
            var dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: function () {
                            return config.remoteApiName + 'Registrations/GetYearOverYearData/2';
                        },
                        dataType: "json"
                    }
                }
            });
            vm.summaryChart.setDataSource(dataSource);
        };

         function Chart() {
            alert('called drawChart');
            var title = "Number of Registrations";
            var yearapi = config.remoteApiName + 'Registrations/GetYearOverYearData/1'; //+ vm.ownerId;

            var yearOverYearSeries = [{
                    field: "Year",
                    name: "2014"
                }, {
                    field: "Yeartwo",
                    name: "2013"
                }, {
                    field: "Yearthree",
                    name: "2012"
                }];

            vm.yearOverYear = {
                theme: "bootstrap",
                dataSource: {
                    transport: {
                        read: yearapi,
                        dataType: "json"
                    }
                },
                //dataSource: {
                //        data: yearOverYearData
                //},
                title: {
                    text: title
                },
                legend: {
                    position: "bottom"
                },
                seriesDefaults: {
                    type: "line",
                    style: "smooth",
                    labels: {
                        visible: true,
                        background: "transparent"
                    }
                },
                series: yearOverYearSeries,
                valueAxis: {
                    line: {
                        visible: false
                    }
                },
                categoryAxis: {
                    field: "Month",
                    majorGridLines: {
                        visible: false
                    }
                }
            };
            alert('drawChart is done');
        };
    }
})();
