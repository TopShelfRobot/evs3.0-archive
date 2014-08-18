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

          var teamapi = config.remoteApiName + 'Participants/GetParticipantsByOwnerId/' + vm.ownerId;

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
                field: "FirstName",
                title: "Team Name",
                width: "200px"
            },{
                field: "LastName",
                title: "Eventure",
                width: "200px"
            },{
                field: "Email",
                title: "Listing",
                width: "220px"
            },{
                field: "Email",
                title: "Captain Name",
                width: "220px"
            },{
                title: "",
                width: "120px",
                template:'<a class="btn btn-default btn-block" href="\\\#profile/#=Id#">Edit</a>'
            }]
          };

          vm.detailGridOptions = function(e) {

            var regapi = config.remoteApiName + 'Registrations/GetRegistrationsByPartId/' + e.Id;

            return {
                dataSource: {
                    type: "json",
                    transport: {
                        read: regapi
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
                    title: "First Name",
                    width: 200
                }, {
                    field: "TotalAmount",
                    title: "Last Name",
                    format: "{0:c}",
                    width: 200
                }, {
                    field: "Quantity",
                    title: "Email",
                    width: 250
                }, {
                    field: "Quantity",
                    title: "Paid",
                    width: 75
                },{
                    field: '',
                    title: '',
                    template: '<a href="\\\#viewreceipt/#=EventureOrderId#" class="btn btn-success btn-block">Resend Invitation</a>',
                },{
                    field: '',
                    title: '',
                    template: '<a href="\\\#viewreceipt/#=EventureOrderId#" class="btn btn-success btn-block">Remove</a>'
                }, {
                    field: '',
                    title: '',
                    template: '<a href="\\\#registrationedit/#=Id#/#=StockAnswerSetId#" class="btn btn-default btn-block">Edit</a>'
                }]
            };
          };

        }

    }
})();
