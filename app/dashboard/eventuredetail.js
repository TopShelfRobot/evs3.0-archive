(function () {
    'use strict';

    var controllerId = 'eventuredetail';
    angular.module('app').controller(controllerId, ['$routeParams', 'common', 'datacontext', 'config', 'ExcelService', "$q", "$timeout", eventuredetail]);

    function eventuredetail($routeParams, common, datacontext, config, excel, $q, $timeout) {
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
          var promises = [getEventure(), Registrations(), Capacity(), ListingsGrid(), ExpenseGrid(), EventPlanGrid(), ParticipantGrid(), VolunteerGrid()];

          common.activateController(promises, controllerId)
              .then(function () {
                  //log('Activated Eventure Detail View');
              });
      }

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
          return datacontext.analytic.getCapacityByEventureId(vm.eventureId)
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
            toolbar: '<a download="download.xlsx" class="k-button" ng-click="vm.excel(vm.listinggrid)">Export</a>',
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
            toolbar: '<a download="download.xlsx" class="k-button" ng-click="vm.excel(vm.expensegrid)">Export</a>',
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
            toolbar: '<a download="download.xlsx" class="k-button" ng-click="vm.excel(vm.plangrid)">Export</a>',
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
            toolbar: '<a download="download.xlsx" class="k-button" ng-click="vm.excel(vm.partgrid)">Export</a>',
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

        function VolunteerGrid() {
            var volJobApi = config.remoteApiName + 'Participants/GetVolunteerDataByEventureId/' + vm.eventureId;

            vm.volunteerGridOptions = {
                toolbar: '<a download="download.xlsx" class="k-button" ng-click="vm.excel(vm.volunteergrid)">Export</a>',
                dataSource: {
                    type: "json",
                    transport: {
                        read: volJobApi
                    },
                    pageSize: 10,
                    serverPaging: true,
                    serverSorting: true
                },
                selectable: "single cell",
                sortable: true,
                pageable: true,
                serverFiltering: true,
                detailTemplate: kendo.template($("#template").html()),
                filterable: {
                    extra: false,
                    operators: {
                        string: {
                            startswith: "Starts with",
                            eq: "Is equal to",
                            neq: "Is not equal to"
                        }
                    }
                },
                dataBound: function() {
                },
                columns:[{
                    field: "Name",
                    title: "Job Name",
                    width: 350
                }, {
                    field: "Shifts",
                    title: "Shifts",
                    width: 200
                }, {
                    field: "Capacity",
                    title: "Capacity",
                    width: 200
                }, {
                    field: "MaxCapacity",
                    title: "MaxCapacity",
                    width: 200
                }, {
                    field: '', title: '',
                    template: '<a href="\\\#setvolunteerjob/#=Id#" class="btn btn-primary btn-small btn-block">Edit</a>'
                }]
            };
          
            vm.volunteerDetailGridOptions = function(e) {

                var volunteerApi = config.remoteApiName + 'Participants/GetVolunteersByVolunteerJobId/' + e.Id;

                return {
                  toolbar: '<a download="download.xlsx" class="k-button" ng-click="vm.excel(vm.detailgrid)">Export</a>',
                    dataSource: {
                        type: "json",
                        transport: {
                            read: volunteerApi
                        },
                        pageSize: 10,
                        serverPaging: false,
                        serverFiltering: false,
                        serverSorting: true
                    },
                    filterable: {
                        extra: false,
                        operators: {
                            string: {
                                contains: "Contains",
                                startswith: "Starts with",
                                eq: "Equal to"
                            }
                        }
                    },
                    sortable: true,
                    pageable: true,
                    dataBound: function() {
                    },
                    columns: [{
                    field: "FirstName",
                    title: "First Name",
                    width: 150
                }, {
                    field: "LastName",
                    title: "Last Name",
                    width: 150
                }, {
                    field: "Email",
                    title: "Email Address",
                    width: 275
                }, {
                    field: "TimeBegin",
                    title: "Start Time",
                    format: "{0:h:mm tt}"
                }, {
                    field: "TimeEnd",
                    title: "End Time",
                    format: "{0:h:mm tt}"
                }, { title: "",
                     width: 100,
                     template: '<a class="btn btn-primary btn-small btn-block" href="\\\#setvolunteerscheduleedit/#=ScheduleId#">Edit</a>' }
                    ]
                };
            };
          
        }
      
        vm.excel = function(data) {
          var gridname = data;
          excel.export(gridname);
        };





    }

})();
