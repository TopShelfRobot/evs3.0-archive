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
            common.activateController(promises, controllerId)
                .then(function () {
                    //log('Activated Coupon Addon Center View');
                });
        }
      
        vm.generateChart = function() {
          alert('hi');
          var yearOverYearData = [
            {
                "event": "Urban Bourbon",
                "month": "November",
                "year": 10,
                "yeartwo": 20,
                "yearthree": 30
            },
            {
                "event": "Urban Bourbon",
                "month": "December",
                "year": 10,
                "yeartwo": 20,
                "yearthree": 30
            },
            {
                "event": "Urban Bourbon",
                "month": "January",
                "year": 10,
                "yeartwo": 20,
                "yearthree": 30
            }
          ];
           
        };
        
        vm.redrawChart = function() {
          alert('refreshing');
          vm.summaryChart.refresh();
        };

        function Chart() {
          var title = "Number of Registrations";
          
          var yearOverYearData = [
            {
                "event": "Urban Bourbon",
                "month": "November",
                "year": 20,
                "yeartwo": 10,
                "yearthree": 17
            },
            {
                "event": "Urban Bourbon",
                "month": "December",
                "year": 15,
                "yeartwo": 20,
                "yearthree": 37
            },
            {
                "event": "Urban Bourbon",
                "month": "January",
                "year": 10,
                "yeartwo": 50,
                "yearthree": 37
            }
          ];
          
          var yearOverYearSeries = [{
              field: "year",
              name: "2014"
          }, {
              field: "yeartwo",
              name: "2013"
          }, {
              field: "yearthree",
              name: "2012"
          }];
          
        vm.yearOverYear = {
            theme: "bootstrap",
            dataSource: {
                    data: yearOverYearData
            },
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
                    field: "month",
                    majorGridLines: {
                        visible: false
                    }
                }
          };
          
        }
    }
})();
