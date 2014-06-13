(function () {
    'use strict';
    var controllerId = 'couponaddon';
    angular.module('app').controller(controllerId, ['config', 'common', 'datacontext', couponaddon]);

    function couponaddon(config, common, datacontext) {
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
                .then(function () { log('Activated Coupon Addon Center View'); });
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
            columns: [{
                field: "Name",
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

    }
})();
