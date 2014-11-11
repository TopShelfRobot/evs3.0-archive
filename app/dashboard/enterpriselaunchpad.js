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
        vm.eventures = [];

        activate();

        function activate() {
            var promises = [getEvents(), NotificationGrid(),  Overview()];
            common.activateController(promises, controllerId)
                .then(function () {
                    //log('Activated Eventure Center View');
                });
        }

        function getEvents() {
            return datacontext.eventure.getEventuresGroupedByYearByOwnerId(1)
              .then(function (data) {
                  vm.eventures = data;
                  return vm.eventures;
              });
        }

        function Overview() {
            var overviewapi = config.remoteApiName +'Registrations/GetOwnerGraph/' + vm.ownerId;

            vm.overviewByOwner = {
                theme: "flat",
                dataSource: {
                    transport: {
                        read: {
                            url: overviewapi,
                            dataType: "json"
                        }
                    }
                },
                title: {
                    text: "Eventure Overview"
                },
                legend: {
                    position: "bottom"
                },
                series: [{
                    type: "column",
                    field: "Rev",
                    name: "Revenue",
                    axis: "Revenue"
                }, {
                    type: "line",
                    field: "Regs",
                    name: "Registrations",
                    axis: "Registrations"
                }],
                valueAxis: [{
                    name: "Revenue",
                    title: { text: "Revenue" }
                }, {
                    name: "Registrations",
                    title: { text: "Registrations" }
                }],
                categoryAxis: {
                    field: "Month",
                    majorGridLines: {
                        visible: false
                    }
                },
                tooltip: {
                    visible: true,
                    template: "#= series.name #: #= value #"
                }
            };
        }

        vm.overview = function() {
            vm.overviewChart.redraw();
        };

        vm.treeviewOptions = {
            template: kendo.template($("#treeview-template").html())
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
                    { field: "Task", width: "100px" },    //template is controlling this now //mjb
                    { field: "Resource", width: "80px" },
                    { field: "Eventure", width: "80px" },
                    { field: "DateDue", format: "{0:MM/dd/yyyy}", width: "70px" }
                ]
          };
        }

        vm.excel = function(data) {
          var gridname = data;
          excel.export(gridname);
        };

    }
})();
