(function () {
    'use strict';
    var controllerId = 'eventurecenter';
    angular.module('app').controller(controllerId, ['common', 'datacontext', 'config', eventurecenter]);

    function eventurecenter(common, datacontext, config) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;

        vm.title = 'app';

        vm.EventureGridOptions = {};

        vm.ownerId = 1;


        activate();

        function activate() {
            common.activateController(EventureGrid(), controllerId)
                .then(function () { log('Activated Eventure Center View'); });
        }

        function EventureGrid() {

          var status = [{
            "value": true,
            "text": "Active",
          },{
            "value": false,
            "text": "Inactive"
          }];

          var eventureapi = config.remoteApiName + 'eventures/GetAllEventuresByOwnerId/' + vm.ownerId;
          vm.eventureGridOptions = {
            dataSource: {
                type: "json",
                transport: {
                    read: eventureapi
                },
                schema: {
                    model: {
                        fields: {
                            Active: { type: "boolean" },
                            DisplayDate: { type: "text" },
                            Id: { type: "number" },
                            Name: { type: "string" }
                        }
                    }
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
                title: "Event",
                template: '<a href="\\\#eventuredetail/#=Id#">#=Name#</a>',
                width: "400px"
            },{
                field: "DisplayDate",
                title: "Date",
                width: "220px"
            },{
                field: "Active",
                width: "100px",
                values: status
            },{
                title: "",
                width: "120px",
                template:'<a class="btn btn-default btn-block" href="\\\#seteventure/#=Id#">Edit</a>'
            }]
          };

        }

    }
})();
