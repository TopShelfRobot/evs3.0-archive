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

            //var chart = vm.summaryChart,
            //            categoryAxis = chart.options.categoryAxis,
            //            baseUnitInputs = $("input:radio[name=baseUnit]");

            //        categoryAxis.baseUnit = baseUnitInputs.filter(":checked").val();

            //        if(categoryAxis.baseUnit === "weeks") {
            //          chart.options.chartArea.height = 1300;
            //        } else {
            //          chart.options.chartArea.height = 475;
            //        }

                    chart.refresh();

            // var dataSource = new kendo.data.DataSource({
            //     transport: {
            //         read: {
            //             url: function () {
            //                 return config.remoteApiName + 'Registrations/GetYearOverYearData/2';
            //             },
            //             dataType: "json"
            //         }
            //     }
            // });
            // chart.setDataSource(dataSource);
        };

         function Chart() {
            var title = "Number of Registrations";
            //var yearapi = config.remoteApiName + 'Registrations/GetYearOverYearData/1'; //+ vm.ownerId;

            //var stats = [
            //        { value: 1, date: new Date("01/01/2013") },
            //        { value: 2, date: new Date("05/08/2013") },
            //        { value: 3, date: new Date("08/15/2013") },
            //        { value: 4, date: new Date("09/01/2013") },
            //        { value: 5, date: new Date("10/08/2013") },
            //        { value: 6, date: new Date("11/15/2013") },
            //        { value: 7, date: new Date("12/22/2013") },
            //        { value: 7, date: new Date("05/08/2014") },
            //        { value: 6, date: new Date("08/15/2014") },
            //        { value: 5, date: new Date("09/01/2014") },
            //        { value: 4, date: new Date("10/08/2014") }
            //    ];

            //var yearOverYearSeries = [{
            //        field: "value",
            //        name: "Event",
            //        categoryField: "date"
            //    }
             //    ];

            var yearapi = config.remoteApiName + 'analytic/GetYearOverYearData/1/1/2013/2014';//  + vm.ownerId; + "/" +

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
