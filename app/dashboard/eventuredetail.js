(function () {
    'use strict';

    var controllerId = 'eventuredetail';
    angular.module('app').controller(controllerId, ['$routeParams', 'common', 'datacontext', 'config', eventuredetail]);

    function eventuredetail($routeParams, common, datacontext, config) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Eventure Detail';
        vm.eventure = {};
        vm.registrations = {};
        vm.capacity = {};
        vm.gauge = {};
        vm.eventureId = $routeParams.eventureId;

        activate();

        function activate() {
          var promises = [getEventure(), Registrations(), Capacity(), ListingsGrid(), ExpenseGrid(), EventPlanGrid(), ParticipantGrid()];

          common.activateController(promises, controllerId)
              .then(function() { log('Activated Eventure Detail View'); }); }

        function getEventure() {
          return datacontext.eventure.getEventureById(vm.eventureId)
            .then(function (data) {
                return vm.eventure = data;
            });
        }

        function Registrations() {
          var regapi = config.remoteApiName +'Registrations/GetEventureGraph/' + vm.eventureId;

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
          return datacontext.getCapacityByEventureId(vm.eventureId)
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

          var eventurelistapi = config.remoteApiName + 'EventureLists/getEventureListsByEventureId/' + vm.eventureId;
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
                            DateEventureList: { type: "date" },
                            DateBeginReg: { type: "date" },
                            DateEndReg: { type: "date" },
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
                field: "DateEventureList",
                title: "Date",
                width: "220px",
                format: "{0:MM/dd/yyyy}"
            },{
                field: "DateBeginReg",
                title: "Registration Begins",
                width: "220px",
                format: "{0:MM/dd/yyyy}"
            },{
                field: "DateEndReg",
                title: "Registration Ends",
                width: "220px",
                format: "{0:MM/dd/yyyy}"
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

          var expenseapi = config.remoteApiName + 'Resources/GetExpensesByEventureId/' + vm.eventureId;
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

          var eventplanapi = config.remoteApiName + 'Resources/GetNotificationsByEventureId/' + vm.eventureId;
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

          var participantapi = config.remoteApiName + 'Participants/GetRegisteredParticipantsByEventureId/' + vm.eventureId;
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
