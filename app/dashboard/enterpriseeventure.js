(function () {
    'use strict';
    var controllerId = 'enterpriseeventure';
    angular.module('app').controller(controllerId, ['$routeParams', 'common', 'datacontext', 'config', 'ExcelService', enterpriseeventure]);

    function enterpriseeventure($routeParams, common, datacontext, config, excel) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;

        vm.title = 'app';

        vm.eventureId = $routeParams.eventureId;

        vm.ownerId = 1;


        activate();

        function activate() {
            common.activateController(getEventure(), ListingGrid(), PieChart(), Overview(), ServicesGrid(), controllerId)
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

        function ListingGrid() {

          var status = [{
            "value": true,
            "text": "Active",
          },{
            "value": false,
            "text": "Inactive"
          }];

          var listapi = config.remoteApiName + 'EventureLists/getEventureListsByEventureId/' + vm.eventureId;
          vm.listGridOptions = {
            toolbar: '<a download="download.xlsx" class="k-button" ng-click="vm.excel(vm.listGrid)"><em class="glyphicon glyphicon-save"></em>&nbsp;Export</a>',
            dataSource: {
                type: "json",
                transport: {
                    read: listapi
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
                template:'<a class="btn btn-default btn-block" href="\\\#setlist/#=Id#"><em class="glyphicon glyphicon-edit"></em>&nbsp;Edit</a>'
            }]
          };

        }

        function PieChart() {

          var revapi = config.remoteApiName + 'Registrations/GetRevenuePerEvent/' + vm.ownerId;
          vm.revByList = {
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
                text: "Revenue By Listing",
                font: 14,
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
                data: [20, 40, 45, 33],
                padding: 0,
                categoryField: "Listing"
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
                    text: "Eventure Overview"
                },
                legend: {
                    position: "top"
                },
                series: [{
                    type: "bar",
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

        function ServicesGrid() {
          var serviceApi = config.remoteApiName + 'Resources/GetEventureServiceByEventureId/' + vm.eventureId;
          vm.servicesGridOptions = {
            toolbar: '<a download="download.xlsx" class="k-button" ng-click="vm.excel(vm.serviceGrid)"><em class="glyphicon glyphicon-save"></em>&nbsp;Export</a>',
            dataSource: {
                    transport: {
                        read: serviceApi
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
                dataBound: function () {
                },
                columns: [
                  { field: "ResourceServiceText", title: "Service", width: "225px" },
                  { field: "Amount", title: "Amount", format: "{0:c}", width: "175px" },
                  { field: "IsVariable", title: "Variable Cost", width: "275px" }
                ]
          };
        }

        vm.excel = function(data) {
          var gridname = data;
          excel.export(gridname);
        };

    }
})();
