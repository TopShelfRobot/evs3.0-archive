(function () {
    'use strict';
    var controllerId = 'teamcenter';
    angular.module('app').controller(controllerId, ['common', 'datacontext', 'config', teamcenter]);

    function teamcenter(common, datacontext, config) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;

        vm.title = 'app';

        vm.participantGridOptions = {};

        vm.ownerId = 1;


        activate();

        function activate() {
            common.activateController(teamGrid(), controllerId)
                .then(function () {
                    //log('Activated Team Center View');
                });
        }

        function teamGrid() {

          var teamapi = config.remoteApiName + 'Teams/GetTeamRegistrationsByOwnerId/' + vm.ownerId;

          vm.teamGridOptions = {
            toolbar: '<a download="Contacts.xlsx" class="k-button" ng-click="vm.excel()">Export</a>',
            dataSource: {
                type: "json",
                transport: {
                    read: teamapi
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
                field: "Name",
                title: "Team Name",
                width: "200px"
            },{
                field: "EventName",
                title: "Eventure",
                width: "200px"
            },{
                field: "ListName",
                title: "Listing",
                width: "220px"
            },{
                field: "CoachName",
                title: "Coach Name",
                width: "220px"
            }, {
                field: "Amount",
                title: "Total Paid",
                width: "120px",
                format: "{0:c}"
            }, {
                field: "Balance",
                title: "Balance",
                width: "120px",
                format: "{0:c}"
                //template: kendo.template($("#balanceTemplate").html())
            }, {
                title: "",
                width: "120px",
                template:'<a class="btn btn-default btn-block" href="\\\#/editteam/#=Id#">Edit</a>'
            }]
          };

          vm.detailGridOptions = function(e) {

            var teamapi = config.remoteApiName + 'Teams/GetTeamMembersByTeamId/' + e.Id;

            vm.remove = function() {
                alert('Removing: ' + e.Id );
                //datacontext.team.removeTeamMemberById(e.Id);
                vm.teamgrid.refresh();

            };

            vm.resend = function() {
                alert('Resending: ' + e.Id);
            };

            return {
                toolbar: '<a download="detailexport.xlsx" class="k-button" ng-click="vm.detailexcel()">Export</a>',
                dataSource: {
                    type: "json",
                    transport: {
                        read: teamapi
                    },
                    serverPaging: false,
                    serverSorting: false,
                    serverFiltering: false,
                    pageSize: 5
                },
                sortable: true,
                pageable: true,
                columns: [{
                        field: "Name",
                        title: "Name"
                    }, {
                        field: "Email",
                        title: "Email"
                    }, {
                        field: "Amount",
                        title: "Paid",
                        width: 100,
                        format: "{0:c}"
                    },{
                        field: '',
                        title: '',
                        template: '<button ng-click="vm.resend()" class="btn btn-success btn-block">Resend Invitation</button>',
                        width: 170
                    },{
                        field: '',
                        title: '',
                        template: '<button ng-click="vm.remove()" class="btn btn-danger btn-block">Remove</button>',
                        width: 100
                    }]
            };
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

        vm.excel = function() {
          var grid = vm.teamgrid;
          // use grid.dataSource.data() to export all data and not just the current page
          var data = vm.teamgrid.dataSource.data();

          var file = {
            worksheets: [{
              data: []
            }],
            creator: 'John Smith',
            created: new Date('8/16/2012'),
            lastModifiedBy: 'Larry Jones',
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
            creator: 'John Smith',
            created: new Date('8/16/2012'),
            lastModifiedBy: 'Larry Jones',
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
