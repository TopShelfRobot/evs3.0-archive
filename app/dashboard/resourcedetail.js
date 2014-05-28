define(['services/logger', 'services/datacontext', 'config'],

    function (logger, datacontext, config) {

        var resourceId = 0;
        var resource = ko.observableArray();

        var activate = function (routeData) {
            resourceId = parseInt(routeData.id);
            return datacontext.getResourceById(resourceId, resource);
        };

        var viewAttached = function () {
            //logger.log('view attached', null, 'vd', true);
            createServicesGrid();

            //$(".fancyboxcreateresourceitem").fancybox({
            //    'width': 1024,
            //    'href': '#setresourceitem/' + resourceId,
            //    afterClose: function () {
            //        var grid = $("#productgrid").data("kendoGrid");
            //        grid.dataSource.read();
            //    }
            //});
            
            //$(".fancyboxcreateresourceitemcategory").fancybox({
            //    'width': 1024,
            //    'href': '#setresourceitemcategory'
            //});
            
            
            //$(".fancyboxeditresourceitem").fancybox({
            //    'width': 1024,
            //    //'href': '#setresourceitem/' + resourceId,
            //    afterClose: function () {
            //        var grid = $("#productgrid").data("kendoGrid");
            //        grid.dataSource.read();
            //    }
            //});
        };

        var clickSave = function () {
            //logger.log('next', null, 'test', true);
            alert('called save');
            //save();
            //var url = '#test';
            //router.navigateTo(url);
        };

        var createServicesGrid = function () {

            var resourceApi = '/kendo/Resources/GetResourceItemsByResourceId/' + resourceId;
            //alert(ResourceApi);

            $("#productgrid").kendoGrid({
                dataSource: {
                    type: "",
                    transport: {
                        read: resourceApi
                    },
                    //schema: {
                    //    model: {
                    //        fields: {
                    //            Active: { type: "boolean" },
                    //            DateBeginReg: { type: "date" },
                    //            DateEndReg: { type: "date" },
                    //            DateEvent: { type: "date" },
                    //            Desc: { type: "string" },
                    //            Id: { type: "number" },
                    //            //isUSAT: { type: "boolean" },
                    //            Name: { type: "string" }
                    //        }
                    //    }
                    //},
                    pageSize: 10,
                    serverPaging: false,
                    serverFiltering: false,
                    //filter: { field: "Active", operator: "eq", value: true },
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
                dataBound: function () {
                    //this.expandRow(this.tbody.find("tr.k-master-row").first());
                },
                columns: [
                    { field: "Name", title: "Item Name", width: "150px" },
                    { field: "Cost", title: "Cost", width: "70px" },
                    { field: "Category", title: "Category", width: "100px" },                                                                                     //:rid/:riid',
                    { title: "", width: 100, template: '<button class="btn btn-primary btn-small btn-block fancyboxeditresourceitem fancybox.iframe" href="\\\#setresourceitem/#=ResourceId#/#=Id#">Edit</button>' }
                    //,{ title: "", width: 100, template: '<button class="btn btn-danger btn-small btn-block fancyboxeditlist fancybox.iframe" href="\\\#setresourceitem/#=Id#">Delete</button>'} 
                ],
                editable: "popup"
            }).data("kendoGrid");

        };

        var vm = {
            activate: activate,
            resource: resource,
            clickSave: clickSave,
            viewAttached: viewAttached
        };
        return vm;
    });

