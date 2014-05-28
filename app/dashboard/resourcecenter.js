(function () {
    'use strict';
    var controllerId = 'resourcecenter';
    angular.module('app').controller(controllerId, ['common', 'datacontext', resourcecenter]);

    function resourcecenter(common) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'app';

        activate();

        function activate() {
            //var promises = [getMessageCount(), getPeople()];
            common.activateController(createResourceGrid(), controllerId)
                .then(function() { log('Activated reporting View'); });
        }

        function createResourceGrid() {

            var resourceApi = '/kendo/Resources/GetResourcesByOwnerId/' + config.ownerId;

            vm.resourceGridOptions = {
                dataSource: {
                    type: "json",
                    transport: {
                        read: resourceApi
                    },
                    pageSize: 6,
                    serverPaging: true,
                    serverSorting: true
                },
                height: 430,
                change: onChange,
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
                    //this.expandRow(this.tbody.find("tr.k-master-row").first());
                    //alert(this.tbody.find("tr.k-master-row").first());
                },
                columns: [//{ field: "Name", title: "Resource", width: "325px" },
                    { field: "Name", title: "Resource", width: "325px", template: '<a href="\\\#resourcedetail/#=Id#">#=Name#</a>' },
                    { field: "Email", title: "Email", width: "225px" },
                    { field: "Phone", title: "Phone", width: "175px" },
                    { field: "ResourceType", title: "Type", width: "175px" }
                    //{ field: "Website", title: "Website", width: "275px" }   //,
                            // { field: "Id", title: "Id", width: "55px" },
                   //{ template: '<a href="\\\#Resourcedetail/#=Id#">#=Id#</a>' },
                    // {  template: '<button href="\\\#Resourcedetail/#=Id#" class="btn btn-primary btn-small btn-block">Edit</button>' }
                           //template: '<a href="\\\#eventuredetail/#=Id#">#=DisplayHeading#</a>',
                ]
            };
            vm.detailGridOptions = function(dataitem) {
                var resourceApi = '/kendo/Resources/GetResourceItemsByResourceId/' + e.data.Id;
                return {
                    dataSource: {
                        type: "json",
                        transport: {
                            read: resourceApi
                        },
                        pageSize: 10,
                        serverPaging: false,
                        serverFiltering: false,
                        //filter: { field: "ResourceId", operator: "eq", value: e.data.Id },
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
                    //height:450,
                    dataBound: function() {
                        //this.expandRow(this.tbody.find("tr.k-master-row").first());
                    },
                    columns: [
                        { field: "Name", title: "Item Name", width: "150px" },
                        { field: "Cost", title: "Cost", width: "70px" },
                        { field: "Category", title: "Category", width: "100px" },
                        { title: "", width: 100, template: '<button class="btn btn-primary btn-small btn-block fancyboxeditlist fancybox.iframe" href="\\\#setresourceitem/#=Id#">Edit</button>' }
                        //,{ title: "", width: 100, template: '<button class="btn btn-danger btn-small btn-block fancyboxeditlist fancybox.iframe" href="\\\#setresourceitem/#=Id#">Delete</button>'} 
                    ]
                };
            };
        }
    }
})();