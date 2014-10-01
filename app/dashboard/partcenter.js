(function () {
    'use strict';
    var controllerId = 'partcenter';
    angular.module('app').controller(controllerId, ['common', 'datacontext', 'config', 'ExcelService', partcenter]);

    function partcenter(common, datacontext, config, excel) {
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

          var partapi = config.remoteApiName + 'Participants/GetParticipantsByOwnerId/' + vm.ownerId;

          vm.participantGridOptions = {
            toolbar: '<a download="detail.xlsx" class="k-button" ng-click="vm.excel(vm.partgrid)"><em class="glyphicon glyphicon-save"></em>&nbsp;Export</a>',
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
                template:'<a class="btn btn-default btn-block" href="\\\#profile/#=Id#"><em class="glyphicon glyphicon-edit"></em>&nbsp;Edit</a>'
            }]
          };

          vm.detailGridOptions = function(e) {

            var regapi = config.remoteApiName + 'Registrations/GetRegistrationsByPartId/' + e.Id;

            return {
                toolbar: '<a download="detail.xlsx" class="k-button" ng-click="vm.excel(vm.detailgrid)"><em class="glyphicon glyphicon-save"></em>&nbsp;Export</a>',
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
                    field: "DisplayName",
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
                    template: '<a href="\\\#viewreceipt/#=EventureOrderId#" class="btn btn-success btn-block"><em class="glyphicon glyphicon-tags"></em>&nbsp;&nbsp;View Receipt</a>'
                }, {
                    field: '',
                    title: '',
                    template: '<a href="\\\#registrationedit/#=Id#/#=StockAnswerSetId#" class="btn btn-default btn-block"><em class="glyphicon glyphicon-edit"></em>&nbsp;Edit</a>'
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
