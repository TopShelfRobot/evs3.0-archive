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
        vm.registrations = {};
        vm.capacity = {};
        vm.gauge = {};

        activate();

        function activate() {
          var promises = [getEventure(), Registrations(), Capacity(), ListingsGrid(), ExpenseGrid(), EventPlanGrid(), ParticipantGrid()];

          common.activateController(promises, controllerId)
              .then(function() { log('Activated Eventure Detail View'); }); }

        function getEventure() {
          return datacontext.getEventureById(62)
            .then(function (data) {
                return vm.eventure = data;
            });
        }

        function Registrations() {
          var regapi = 'http://test30.eventuresports.info/kendo/Registrations/GetEventureGraph/62';

          vm.registrations = {
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

        function ExpenseGrid() {

          var expenseapi = 'http://test30.eventuresports.info/kendo/Resources/GetExpensesByEventureId/62';
          vm.expenseGridOptions = {
            dataSource: {
                type: "json",
                transport: {
                    read: expenseapi
                },
                pageSize: 10,
                serverPaging: false,
                serverSorting: false
            },
            sortable: true,
            pageable: true,
            columns: [{
                        field: "item",
                        title: "Item",
                        width: 200
                    },
                    {
                        field: "category",
                        title: "Category",
                        width: 140,
                        filterable: false
                    },
                    {
                        field: "Cost",
                        title: "Cost",
                        width: 140,
                        filterable: false
                    },
                    {
                        field: "CostType",
                        title: "Type",
                        width: 140,
                        filterable: false
                    },
                    {
                        field: "PerRegNumber",
                        title: "Formula",
                        width: 140,
                        filterable: false
            }]
          };
        }

        function EventPlanGrid() {

          var status = [{
                "value": true,
                "text": "Yes"
              },
              {
                "value": false,
                "text": "No"
              }
          ];

          var eventplanapi = 'http://test30.eventuresports.info/kendo/Resources/GetNotificationsByEventureId/62';
          vm.eventPlanGridOptions = {
            dataSource: {
                type: "json",
                transport: {
                    read: eventplanapi
                },
                pageSize: 10,
                serverPaging: false,
                serverSorting: false
            },
            sortable: true,
            pageable: true,
            columns: [{
                        field: "Task",
                        title: "Task"
                    },
                    {
                        field: "Resource",
                        title: "Resouce"
                    },
                    {
                        field: "DateDue",
                        title: "Due Date",
                        format: "{0:MM/dd/yyyy}",
                        width: 140
                    },
                    {
                        field: "IsCompleted",
                        title: "Completed",
                        width: 140,
                        values: status,
                        filterable: false
                    },
                    {
                        title: "",
                        width: 100,
                        filterable: false,
                        template: '<a class="btn btn-default btn-block" href="\\\#seteventplan/id/#=Id#">Edit</a>'
            }]
          };
        }

        function ParticipantGrid() {

          var participantapi = 'http://test30.eventuresports.info/kendo/Participants/GetRegisteredParticipantsByEventureId/62';
          vm.participantGridOptions = {
            dataSource: {
                type: "json",
                transport: {
                    read: participantapi
                },
                pageSize: 10,
                serverPaging: false,
                serverSorting: false
            },
            sortable: true,
            pageable: true,
            columns: [{
                        field: "FirstName",
                        title: "First Name",
                    },
                    {
                        field: "LastName",
                        title: "Last Name",
                    },
                    {
                        field: "Email",
                        title: "Email Address",
                    },
                    {
                        field: "City",
                        title: "City",
                        width: 200
                    },
                    {
                        field: "State",
                        title: "State",
                        width: 80
                    },
                    {
                        title: "",
                        width: 100,
                        filterable: false,
                        template: '<a href="\\\#partedit/#=Id#" class="btn btn-default btn-block ">Edit</a>'
            }]
          };
        }





    }

})();
