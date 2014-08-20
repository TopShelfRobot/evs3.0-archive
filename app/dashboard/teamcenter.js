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
                .then(function () { log('Activated Team Center View'); });
        }

        function teamGrid() {

          var teamapi = config.remoteApiName + 'Teams/GetTeamRegistrationsByOwnerId/' + vm.ownerId;

          vm.teamGridOptions = {
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
            },{
                title: "",
                width: "120px",
                template:'<a class="btn btn-default btn-block" href="\\\#profile/#=Id#">Edit</a>'
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
                        width: 100
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

    }
})();
