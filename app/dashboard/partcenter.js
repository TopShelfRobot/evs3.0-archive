(function () {
    'use strict';
    var controllerId = 'partcenter';
    angular.module('app').controller(controllerId, ['common', 'datacontext', partcenter]);

    function partcenter(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;

        vm.title = 'app';

        vm.participantGridOptions = {};

        vm.ownerId = 1;


        activate();

        function activate() {
            common.activateController(ParticipantGrid(), controllerId)
                .then(function () { log('Activated Participant Center View'); });
        }

        function ParticipantGrid() {

          var partapi = 'http://test30.eventuresports.info/kendo/Participants/GetParticipantsByOwnerId/' + vm.ownerId;

          vm.participantGridOptions = {
            dataSource: {
                type: "json",
                transport: {
                    read: partapi
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
                title: "First Name",
                width: "200px"
            },{
                field: "LastName",
                title: "Last Name",
                width: "200px"
            },{
                field: "Email",
                title: "Email Address",
                width: "220px"
            },{
                title: "",
                width: "120px",
                template:'<a class="btn btn-default btn-block" href="\\\#userprofile/#=Id#">Edit</a>'
            }]
          };

          vm.detailGridOptions = function(dataItem) {

            var regapi = 'http://test30.eventuresports.info/kendo/Registrations/GetRegistrationsByPartId/' + dataItem.Id;

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
                    title: "Listing",
                    width: 300
                }, {
                    field: "TotalAmount",
                    title: "Amount",
                    format: "{0:c}",
                    width: 150
                }, {
                    field: "Quantity",
                    title: "Quantity",
                    width: 125
                }, {
                    field: "DateCreated",
                    title: "Registration Date",
                    type: "date",
                    format: "{0:MM/dd/yyyy}",
                    width: 200
                },{
                    field: '',
                    title: '',
                    template: '<a href="\\\#viewreceipt/#=EventureOrderId#" class="btn btn-success btn-block">View Receipt</a>'
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
