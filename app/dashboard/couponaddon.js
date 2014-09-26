(function () {
    'use strict';
    var controllerId = 'couponaddon';
    angular.module('app').controller(controllerId, ['config', 'common', 'datacontext', 'ExcelService', couponaddon]);

    function couponaddon(config, common, datacontext, excel) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;

        vm.title = 'app';

        vm.couponGridOptions = {};

        vm.addonGridOptions = {};

        vm.ownerId = 1;

        activate();

        function activate() {
            var promises = [CouponGrid(), AddonGrid()];
            common.activateController(promises, controllerId)
                .then(function () {
                    //log('Activated Coupon Addon Center View');
                });
        }

        function CouponGrid() {

          var status = [{
            "value": true,
            "text": "Active",
          },{
            "value": false,
            "text": "Inactive"
          }];

          var couponapi = config.remoteApiName + 'Coupon/GetCouponsByOwnerId/' + vm.ownerId;
          vm.couponGridOptions = {
            toolbar: '<a download="Coupons.xlsx" class="k-button" ng-click="vm.excel(vm.coupongrid)">Export</a>',
            dataSource: {
                type: "json",
                transport: {
                    read: couponapi
                },
                pageSize: 10,
                serverPaging: false,
                serverSorting: false
            },
            sortable: true,
            pageable: true,
            filterable: true,
            detailTemplate: kendo.template($("#template").html()),
            columns: [{
                field: "Code",
                title: "Coupon",
                width: "400px"
            },{
                field: "Amount",
                title: "Amount",
                width: "220px"
            },{
                field: "Active",
                width: "100px",
                values: status
            },{
                title: "",
                width: "120px",
                template:'<a class="btn btn-default btn-block" href="\\\#setcoupon/#=Id#">Edit</a>'
            }]
          };

          vm.detailGridOptions = function(e) {
            var couponuseapi = config.remoteApiName + 'GetCouponUseByCouponId/' + e.Id;

            return {
                toolbar: '<a download="detailexport.xlsx" class="k-button" ng-click="vm.detailexcel(vm.detailgrid)">Export</a>',
                dataSource: {
                    type: "json",
                    transport: {
                        read: couponuseapi
                    },
                    serverPaging: false,
                    serverSorting: false,
                    serverFiltering: false,
                    pageSize: 5
                },
                sortable: true,
                pageable: true,
                columns: [
                   {
                       field: "Name",
                       title: "List",
                       width: 300
                   }, {
                       field: "Amount",
                       title: "Amount",
                       format: "{0:c}",
                       width: 150
                   }, {
                       field: "Description",
                       title: "Coupon",
                       width: 225
                   }, {
                       field: "FirstName",
                       title: "First Name"
                   }, {
                       field: "LastName",
                       title: "Last Name"
                   }]
            };
        };

        }

        function AddonGrid() {

          var status = [{
            "value": true,
            "text": "Active",
          },{
            "value": false,
            "text": "Inactive"
          }];

          var addonapi = config.remoteApiName + 'Addon/GetAddonsByOwnerId/' + vm.ownerId;

          vm.addonGridOptions = {
            toolbar: '<a download="Coupons.xlsx" class="k-button" ng-click="vm.excel(vm.addongrid)">Export</a>',
            dataSource: {
                type: "json",
                transport: {
                    read: addonapi
                },
                pageSize: 10,
                serverPaging: false,
                serverSorting: false
            },
            sortable: true,
            pageable: true,
            filterable: true,
            columns: [{
                field: "AddonDesc",
                title: "Addon",
                width: "400px"
            },{
                field: "Amount",
                title: "Amount",
                width: "220px"
            },{
                field: "Active",
                width: "100px",
                values: status
            },{
                title: "",
                width: "120px",
                template:'<a class="btn btn-default btn-block" href="\\\#setaddon/#=Id#">Edit</a>'
            }]
          };

        }
        
        vm.excel = function(data) {
          var gridname = data;
          excel.export(gridname);
        };

    }
})();
