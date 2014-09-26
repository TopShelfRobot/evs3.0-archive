(function () {
    'use strict';
    var controllerId = 'resourcecenter';
    angular.module('app').controller(controllerId, ['common', 'config', 'ExcelService', resourcecenter]);

    function resourcecenter(common, config, excel) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'app';
        vm.ownerId = config.owner.ownerId;

        activate();

        function activate() {
            //var promises = [getMessageCount(), getPeople()];
            common.activateController(createResourceGrid(), controllerId)
                .then(function() { log('Activated reporting View'); });
        }

        function createResourceGrid() {

            //var resourceApi = '/kendo/Resources/GetResourcesByOwnerId/' + vm.ownerId;
            var resourceApi = config.remoteApiName + 'Resources/GetResourcesByOwnerId/' + vm.ownerId;

            vm.resourceGridOptions = {
              toolbar: '<a download="download.xlsx" class="k-button" ng-click="vm.excel(vm.resourcegrid)">Export</a>',
                dataSource: {
                    type: "json",
                    transport: {
                        read: resourceApi
                    },
                    pageSize: 6,
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
                columns: [//{ field: "Name", title: "Resource", width: "325px" },
                    { field: "Name", title: "Resource", width: "325px", template: '<a href="\\\#resourcedetail/#=Id#">#=Name#</a>' },
                    { field: "Email", title: "Email", width: "225px" },
                    { field: "Phone", title: "Phone", width: "175px" },
                    { field: "ResourceType", title: "Type", width: "175px" }
                ]
            };
          
            vm.detailGridOptions = function(e) {
                var resourceApi = config.remoteApiName + 'Resources/GetResourceItemsByResourceId/' + e.Id;

                return {
                  toolbar: '<a download="download.xlsx" class="k-button" ng-click="vm.excel(vm.detailgrid)">Export</a>',
                    dataSource: {
                        type: "json",
                        transport: {
                            read: resourceApi
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
                    columns: [
                        { field: "Name", title: "Item Name", width: "150px" },
                        { field: "Cost", title: "Cost", width: "70px" },
                        { field: "Category", title: "Category", width: "100px" },
                        { title: "", width: 100, template: '<button class="btn btn-primary btn-small btn-block" href="\\\#setresourceitem/#=Id#">Edit</button>' }
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
