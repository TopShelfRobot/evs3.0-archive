(function () {
    'use strict';
    var controllerId = 'resourcedetail';
    angular.module('app').controller(controllerId, ['$routeParams','common', 'datacontext','config', resourcedetail]);

    function resourcedetail($routeParams, common, datacontext, config) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'app';
        vm.ownerId = config.owner.ownerId;
        vm.resourceId = 0;
        vm.resource = {};
        vm.resourceId = $routeParams.resourceId;
        log(vm.resourceId);

        activate();

        function activate() {
            var promises = [createresourceDetailGrid(), getResource()];
            common.activateController(promises, controllerId)
                .then(function() { log('Activated reporting View'); });
        }

        function getResource () {
        //    resourceId = parseInt(routeData.id);
            return datacontext.getResourceById(vm.resourceId)
                .then(function(data) {
                    return vm.resource = data;
                });
        };


        vm.clickSave = function () {
            //logger.log('next', null, 'test', true);
            alert('called save');
            //save();
            //var url = '#test';
            //router.navigateTo(url);
        };

        function createresourceDetailGrid() {

            var resourceApi = config.remoteApiName + 'Resources/GetResourceItemsByResourceId/' + vm.resourceId;
            //alert(ResourceApi);

            vm.resourceDetailGridOptions = {
                dataSource: {
                    type: "",
                    transport: {
                        read: resourceApi
                    },
                    pageSize: 10,
                    serverPaging: false,
                    serverFiltering: false,
                    serverSorting: true
                },
                sortable: true,
                pageable: true,
                columns: [
                    { field: "Name", title: "Item Name", width: "150px" },
                    { field: "Cost", title: "Cost", width: "70px" },
                    { field: "Category", title: "Category", width: "100px" }                                                                                 //:rid/:riid',
                ]
            };
        }
    }
})();
