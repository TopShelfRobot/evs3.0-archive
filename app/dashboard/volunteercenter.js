(function () {
    'use strict';
    var controllerId = 'volunteercenter';
    angular.module('app').controller(controllerId, ['common', 'datacontext', 'config', 'ExcelService', volunteercenter]);

    function volunteercenter(common, datacontext, config, excel) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;

        vm.title = 'app';

        vm.participantGridOptions = {};

        vm.ownerId = 1;


        activate();

        function activate() {
            common.activateController(volunteerGrid(), controllerId)
                .then(function () {
                    //log('Activated Team Center View');
                });
        }

        function volunteerGrid() {

          var volunteerapi = config.remoteApiName + 'Participants/GetVolunteersByOwnerId/' + vm.ownerId;

          vm.volunteerGridOptions = {
            toolbar: '<a download="Teams.xlsx" class="k-button" ng-click="vm.excel(vm.volunteergrid)"><em class="glyphicon glyphicon-save"></em>&nbsp;Export</a>',
            dataSource: {
                type: "json",
                transport: {
                    read: volunteerapi
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
                    width: 225
                },
                    {
                        field: "LastName",
                        title: "Last Name",
                        width: 225
                    }, {
                        field: "Email",
                        title: "Email Address",
                        width: 300
                    }, {
                        field: "PhoneMobile",
                        title: "Phone",
                        width: 300
                    }]
          };

          vm.detailGridOptions = function(e) {

            var volunteerapi = config.remoteApiName + 'Participants/GetVolunteerScheduleByVolunteerId' + e.Id;
            
            return {
                toolbar: '<a download="detailexport.xlsx" class="k-button" ng-click="vm.excel(vm.detailgrid)"><em class="glyphicon glyphicon-save"></em>&nbsp;Export</a>',
                dataSource: {
                    type: "json",
                    transport: {
                        read: volunteerapi
                    },
                    serverPaging: false,
                    serverSorting: false,
                    serverFiltering: false,
                    pageSize: 5
                },
                schema: {
                  model: {
                    fields: {
                        TimeBegin: { type: "date" },
                        TimeEnd: { type: "date" }
                    }
                  }
                },
                sortable: true,
                pageable: true,
                columns: [{
                        field: "JobName",
                        title: "Job Name",
                        width: 200
                   }, {
                       field: "EventName",
                       title: "Event",
                       width: 300
                    }, {
                        field: "TimeBegin",
                        title: "Shift Begin",
                        type: "date",
                        //format: "{0:h:mm tt}",
                        template: "#=moment(TimeBegin).format('h:mm a')#",
                        width: 125
                    }, {
                        field: "TimeEnd",
                        title: "Shift End",
                        type: "date",
                        format: "{0:h:mm tt}"
                        , width: 125
                    }, {
                        title: "",
                        width: "120px",
                        template:'<a class="btn btn-default btn-block" href="\\\#/volunteerscheduleedit/#=Id#"><em class="glyphicon glyphicon-edit"></em>&nbsp;Edit</a>'
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