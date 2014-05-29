(function () {
    'use strict';

    var controllerId = 'eventuredetail';
    angular.module('app').controller(controllerId, ['common', 'datacontext', eventuredetail]);

    function eventuredetail(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Eventure Detail';
        vm.eventure = {};
        vm.bar = {};
        vm.capacity = {};
        vm.gauge = {};

        activate();

        function activate() {
          var promises = [getEventure(), Registrations(), Capacity(), ListingsGrid()];

          common.activateController(promises, controllerId)
              .then(function() { log('Activated Eventure Detail'); }); }

        function getEventure() {
          return datacontext.getEventureById(62)
            .then(function (data) {
                return vm.eventure = data;
            });
        }

        function Registrations() {
          var regapi = 'http://test30.eventuresports.info/kendo/Registrations/GetEventureGraph/62';

          vm.bar = {
            theme: "bootstrap",
            dataSource: {
              transport: {
                  read: {
                      url: regapi,
                      dataType: "json"
                  }
              }
            },
            title: {
              text: "Registrations YTD"
            },
            legend: {
              position: "bottom"
            },
            series: [{
              name: "Registrations",
              field: "Regs",
              colorField: "userColor",
              axis: "registrations",
              tooltip: { visible: true }
            }],
            valueAxis: {
              name: "registrations",
              labels: {
                  format: "{0:n0}"
              }
            },
            categoryAxis: {
              baseUnit: "months",
              field: "Month",
              majorGridLines: {
                  visible: false
              }
            }
          };
        }

        function Capacity() {
          return datacontext.getCapacityByEventureId(62)
            .then(function (data) {
              return vm.capacity = data;
            });
        }

        function ListingsGrid() {

          var status = [{
            "value": true,
            "text": "Active",
          },{
            "value": false,
            "text": "Inactive"
          }];

          var eventurelistapi = 'http://test30.eventuresports.info/kendo/EventureLists/getEventureListsByEventureId/62';
          vm.eventureListGridOptions = {
            dataSource: {
                type: "json",
                transport: {
                    read: eventurelistapi
                },
                schema: {
                    model: {
                        fields: {
                            Active: { type: "boolean" },
                            DisplayDate: { type: "text" },
                            Id: { type: "number" },
                            Name: { type: "string" }
                        }
                    }
                },
                pageSize: 10,
                serverPaging: false,
                serverSorting: false
            },
            sortable: true,
            pageable: true,
            columns: [{
                title: "Listing",
                template: '<a href="\\\#elistcenter/#=Id#">#=Name#</a>'
            },{
                field: "DisplayDate",
                title: "Date",
                width: "220px"
            },{
                field: "Active",
                width: "100px",
                values: status
            },{
                title: "",
                width: "120px",
                template:'<a class="btn btn-default btn-block" href="\\\#setlist/#=Id#">Edit</a>'
            }]
          };
        }


    }

})();
