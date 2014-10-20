(function () {
    'use strict';
    var controllerId = 'teamcenter';
    angular.module('app').controller(controllerId, ['common', 'datacontext', 'config', 'ExcelService', teamcenter]);

    function teamcenter(common, datacontext, config, excel) {
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
            toolbar: '<a download="Teams.xlsx" class="k-button" ng-click="vm.excel(vm.teamgrid)"><em class="glyphicon glyphicon-save"></em>&nbsp;Export</a>',
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
                format: "{0:c}",
                template: kendo.template($("#balanceTemplate").html())
            }, {
                title: "",
                width: "120px",
                template:'<a class="btn btn-default btn-block" href="\\\#/editteam/#=Id#"><em class="glyphicon glyphicon-edit"></em>&nbsp;Edit</a>'
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
                toolbar: '<a download="detailexport.xlsx" class="k-button" ng-click="vm.excel(vm.detailgrid)"><em class="glyphicon glyphicon-save"></em>&nbsp;Export</a>',
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
                        template: '<button ng-click="vm.resend()" class="btn btn-success btn-block"><em class="glyphicon glyphicon-send"></em>&nbsp;Resend Invitation</button>',
                        width: 180
                    },{
                        field: '',
                        title: '',
                        template: '<button ng-click="vm.remove()" class="btn btn-danger btn-block"><em class="glyphicon glyphicon-remove"></em>&nbsp;Remove</button>',
                        width: 100
                    }]
            };
          };

        }
      
        vm.excel = function(data) {
          var gridname = data;
          excel.export(gridname);
        };
    }
})();
