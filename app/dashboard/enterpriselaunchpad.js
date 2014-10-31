(function () {
    'use strict';
    var controllerId = 'enterpriselaunchpad';
    angular.module('app').controller(controllerId, ['common', 'datacontext', 'config', 'ExcelService', enterpriselaunchpad]);

    function enterpriselaunchpad(common, datacontext, config, excel) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;

        vm.title = 'app';

        vm.EventureGridOptions = {};

        vm.ownerId = 1;


        activate();

        function activate() {
            common.activateController(EventureGrid(), PieCharts(), Overview(), NotificationGrid(), controllerId)
                .then(function () {
                  //log('Activated Eventure Center View');
                });
        }

        function EventureGrid() {

          var status = [{
            "value": true,
            "text": "Active",
          },{
            "value": false,
            "text": "Inactive"
          }];

          var eventureapi = config.remoteApiName + 'eventures/GetAllEventuresByOwnerId/' + vm.ownerId;
          vm.eventureGridOptions = {
            toolbar: '<a download="download.xlsx" class="k-button" ng-click="vm.excel(vm.eventureGrid)"><em class="glyphicon glyphicon-save"></em>&nbsp;Export</a>',
            dataSource: {
                type: "json",
                transport: {
                    read: eventureapi
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
            filterable: true,
            columns: [{
                field: "Name",
                title: "Event",
                template: '<a href="\\\#enterpriseeventure/#=Id#">#=Name#</a>',
                width: "400px"
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
                template:'<a class="btn btn-default btn-block" href="\\\#seteventure/#=Id#"><em class="glyphicon glyphicon-edit"></em>&nbsp;Edit</a>'
            }]
          };

        }

        function PieCharts() {

          var revapi = config.remoteApiName + 'Registrations/GetRevenuePerEvent/' + vm.ownerId;
          vm.revByEvent = {
            theme: "flat",
            dataSource: {
                transport: {
                    read: {
                        url: revapi,
                        dataType: "json"
                    }
                }
            },
            title: {
                position: "top",
                text: "Revenue By Event",
                font: 14
            },
            legend: {
                visible: false
            },
            chartArea: {
                height: 200
            },
            seriesDefaults: {
                type: "pie",
                labels: {
                    visible: false,
                    background: "transparent",
                    template: "#= category #: $#= value#"
                }
            },
            series: [{
                field: "RevenuePercent",
                padding: 0,
                categoryField: "Eventure"
            }],
            tooltip: {
                visible: true,
                template: "#= category #: $#= value#"
            }
          };

          var expapi = config.remoteApiName + 'Registrations/GetExpensePerCategory/' + vm.ownerId;

          vm.expenseByCategory = {
              theme: "flat",
              dataSource: {
                  transport: {
                      read: {
                          //url: expapi,
                          dataType: "json"
                      }
                  }
              },
              title: {
                  position: "top",
                  text: "Expense By Category",
                  font: 14
              },
              legend: {
                  visible: false
              },
              chartArea: {
                  height: 200
              },
              seriesDefaults: {
                  type: "pie",
                  labels: {
                      visible: false,
                      background: "transparent",
                      template: "#= category #: $#= value#"
                  }
              },
              series: [{
                  field: "ExpensePercent",
                  data: [20, 40, 45, 33],
                  padding: 0,
                  categoryField: "Eventure"
              }],
              tooltip: {
                  visible: true,
                  template: "#= category #: $#= value#"
              }
          };
        }

        function Overview() {
          var overviewapi = config.remoteApiName +'Registrations/GetEventureGraph/' + vm.ownerId;

          vm.overviewByOwner = {
            theme: "flat",
                title: {
                    text: "Eventure Sports Overview"
                },
                legend: {
                    position: "bottom"
                },
                series: [{
                    type: "column",
                    data: [20, 40, 45, 33],
                    stack: true,
                    name: "Profit"
                }, {
                    type: "bar",
                    data: [20, 30, 35, 22],
                    stack: true,
                    name: "Expense"
                }, {
                    type: "line",
                    data: [30, 38, 40, 33],
                    name: "Registrations"
                }],
                valueAxes: [{
                    title: { text: "Profit" }
                }, {
                    name: "Expense",
                    title: { text: "Expense" }
                }, {
                    name: "Revenue",
                    title: { text: "Revenue" }
                }, {
                    name: "Registrations",
                    title: { text: "Registrations" }
                }],
                categoryAxis: {
                    categories: ["Glow Go 5k", "Republic Bank Big...", "Run For...", "Buckhead Border..."],
                    axisCrossingValues: [0, 0, 10, 10]
                }
          };
        }

        vm.overview = function() {
          vm.overviewChart.redraw();
        };

        function NotificationGrid() {
          var notifApi = config.remoteApiName + 'Resources/GetNotificationsByOwnerId/' + vm.ownerId;
          vm.notificationGridOptions = {
            toolbar: '<a download="download.xlsx" class="k-button" ng-click="vm.excel(vm.notificationGrid)"><em class="glyphicon glyphicon-save"></em>&nbsp;Export</a>',
            dataSource: {
                    transport: {
                        read: notifApi
                    },
                    schema: {
                        model: {
                            fields: {
                                DateDue: { type: "date" }
                            }
                        }
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
                //rowTemplate: kendo.template($("#rowTemplate").html()),
                dataBound: function () {
                },
                columns: [
                    { field: "Task", title: "Task", width: "100px" },    //template is controlling this now //mjb
                    { field: "Resource", title: "Resource", width: "80px" },
                    { field: "Eventure", title: "Event", width: "80px" },
                    { field: "DateDue", title: "Due Date", format: "{0:MM/dd/yyyy}", width: "70px" }
                ]
          };
        }

        vm.excel = function(data) {
          var gridname = data;
          excel.export(gridname);
        };

    }
})();
