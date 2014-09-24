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
            toolbar: '<a download="Coupons.xlsx" class="k-button" ng-click="vm.excel()">Export</a>',
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
                toolbar: '<a download="detailexport.xlsx" class="k-button" ng-click="vm.detailexcel()">Export</a>',
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

        function b64ToUint6 (nChr) {
          return nChr > 64 && nChr < 91 ?
              nChr - 65
            : nChr > 96 && nChr < 123 ?
              nChr - 71
            : nChr > 47 && nChr < 58 ?
              nChr + 4
            : nChr === 43 ?
              62
            : nChr === 47 ?
              63
            :
              0;

        }

        function base64DecToArr (sBase64, nBlocksSize) {

          var
            sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), nInLen = sB64Enc.length,
            nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2, taBytes = new Uint8Array(nOutLen);

          for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
            nMod4 = nInIdx & 3;
            nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
            if (nMod4 === 3 || nInLen - nInIdx === 1) {
              for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
                taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
              }
              nUint24 = 0;

            }
          }

          return taBytes;
        }

        vm.couponexcel = function() {
          var grid = vm.coupongrid;
          // use grid.dataSource.data() to export all data and not just the current page
          var data = vm.coupongrid.dataSource.data();

          var file = {
            worksheets: [{
              data: []
            }],
            creator: 'System',
            created: new Date(),
            lastModifiedBy: 'System',
            modified: new Date(),
            activeWorksheet: 0
          };

          var worksheetData = file.worksheets[0].data;
          var worksheetDataHeader = [];

          worksheetData.push(worksheetDataHeader);

          for (var ci = 0; ci < grid.columns.length; ci++) {
            var title = grid.columns[ci].title;
            worksheetDataHeader.push({
              value: title,
              autoWidth: true
            });
          }

          for (var di = 0; di < data.length; di++) {

            var dataItem = data[di];
            var worksheetDataItem = [];

            for (ci = 0; ci < grid.columns.length; ci++) {

              var column = grid.columns[ci];
              worksheetDataItem.push({

                value: dataItem.get(column.field)
              });
            }

            worksheetData.push(worksheetDataItem);
          }

          var result = xlsx(file);

          if (navigator.msSaveBlob) {
             var blob = new Blob([base64DecToArr(result.base64)]);

             navigator.msSaveBlob(blob, this.getAttribute("download"));
          } else {
            window.location.href = result.href();
          }

        };


        vm.detailexcel = function() {
          var grid = vm.detailgrid;
          // use grid.dataSource.data() to export all data and not just the current page
          var data = vm.detailgrid.dataSource.data();

          var file = {
            worksheets: [{
              data: []
            }],
            creator: 'System',
            created: new Date(),
            lastModifiedBy: 'System',
            modified: new Date(),
            activeWorksheet: 0
          };

          var worksheetData = file.worksheets[0].data;
          var worksheetDataHeader = [];

          worksheetData.push(worksheetDataHeader);

          for (var ci = 0; ci < grid.columns.length; ci++) {
            var title = grid.columns[ci].title;
            worksheetDataHeader.push({
              value: title,
              autoWidth: true
            });
          }

          for (var di = 0; di < data.length; di++) {

            var dataItem = data[di];
            var worksheetDataItem = [];

            for (ci = 0; ci < grid.columns.length; ci++) {

              var column = grid.columns[ci];
              worksheetDataItem.push({

                value: dataItem.get(column.field)
              });
            }

            worksheetData.push(worksheetDataItem);
          }

          var result = xlsx(file);

          if (navigator.msSaveBlob) {
             var blob = new Blob([base64DecToArr(result.base64)]);

             navigator.msSaveBlob(blob, this.getAttribute("download"));
          } else {
            window.location.href = result.href();
          }

        };

    }
})();
