(function () {
    'use strict';

    var controllerId = 'listingdetail';
    angular.module('app').controller(controllerId, ['common', 'datacontext', listingdetail]);

    function listingdetail(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Listing Detail';
        vm.listing = {};
        vm.registrations = {};
        vm.capacity = {};
        vm.fees = {};

        vm.listingId = 141;

        activate();

        function activate() {
          var promises = [getListing(), Registrations(), Capacity(), FeeSchedule(), Groups(), ParticipantGrid()];

          common.activateController(promises, controllerId)
              .then(function() { log('Activated Listing Detail View'); }); }

        function getListing() {
          return datacontext.getEventureListById(vm.listingId)
            .then(function (data) {
                return vm.listing = data;
            });
        }

        function Capacity() {
          return datacontext.getCapacityByEventureListId(vm.listingId)
            .then(function (data) {
              return vm.capacity = data;
            });
        }
        function FeeSchedule() {
          return datacontext.getFeeSchedulesByEventureListId(vm.listingId)
            .then(function (data) {
              return vm.fees = data;
            });
        }

        function Registrations() {
          var regapi = 'http://test30.eventuresports.info/kendo/Registrations/GetEventureListGraph/' + vm.listingId;

          vm.registrations = {
            theme: "bootstrap",
            dataSource: {
              transport: {
                  read: {
                      url: regapi,
                      dataType: "json"
                  }
              }
            },
            title: {
              text: "Registrations by Month"
            },
            legend: {
              position: "bottom"
            },
            series: [{
              name: "Registrations",
              field: "Regs",
              colorField: "userColor",
              axis: "registrations",
              tooltip: { visible: true }
            }],
            valueAxis: {
              name: "registrations",
              labels: {
                  format: "{0:n0}"
              }
            },
            categoryAxis: {
              baseUnit: "months",
              field: "Month",
              majorGridLines: {
                  visible: false
              }
            },
            tooltip: {
                visible: true,
                format: "{0}%",
                template: "#= series.name #: #= value #"
            }
          };
        }

        function Groups() {
          var groupapi = 'http://test30.eventuresports.info/kendo/Registrations/GetEventureGroupGraphByList/' + vm.listingId;

          vm.groups = {
            theme: "bootstrap",
            dataSource: {
              transport: {
                  read: {
                      url: groupapi,
                      dataType: "json"
                  }
              }
            },
            title: {
              text: "Registrations by Group"
            },
            legend: {
              position: "bottom"
            },
            series: [{
              name: "Group Count",
              field: "regCount",
              colorField: "userColor",
              tooltip: { visible: true }
            }],
            seriesClick: function(e) {
              var url = '#partcenter/group/' + e.dataItem.id;
              log('url' + url);
            },
            valueAxis: {
              name: "regCount",
              labels: {
                  format: "{0}"
              }
            },
            categoryAxis: {
              field: "groupName",
              majorGridLines: {
                  visible: false
              }
            },
            tooltip: {
                visible: true,
                format: "{0}%",
                template: "#= series.name #: #= value #"
            }
          };
        }

        function ListingsGrid() {

          var status = [{
            "value": true,
            "text": "Active",
          },{
            "value": false,
            "text": "Inactive"
          }];

          var eventurelistapi = 'http://test30.eventuresports.info/kendo/EventureLists/getEventureListsByEventureId/62';
          vm.eventureListGridOptions = {
            dataSource: {
                type: "json",
                transport: {
                    read: eventurelistapi
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
            columns: [{
                title: "Listing",
                template: '<a href="\\\#elistcenter/#=Id#">#=Name#</a>'
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
                template:'<a class="btn btn-default btn-block" href="\\\#setlist/#=Id#">Edit</a>'
            }]
          };
        }

        function ParticipantGrid() {

          var participantapi = 'http://test30.eventuresports.info/kendo/Participants/GetRegisteredParticipantsByEventureListId/' + vm.listingId;
          vm.participantGridOptions = {
            dataSource: {
                type: "json",
                transport: {
                    read: participantapi
                },
                pageSize: 10,
                serverPaging: false,
                serverSorting: false
            },
            sortable: true,
            pageable: true,
            columns: [{
                        field: "FirstName",
                        title: "First Name",
                    },
                    {
                        field: "LastName",
                        title: "Last Name",
                    },
                    {
                        field: "Email",
                        title: "Email Address",
                    },
                    {
                        field: "City",
                        title: "City",
                        width: 200
                    },
                    {
                        field: "State",
                        title: "State",
                        width: 80
                    },
                    {
                        title: "",
                        width: 100,
                        filterable: false,
                        template: '<a href="\\\#partedit/#=Id#" class="btn btn-default btn-block ">Edit</a>'
            }]
          };
        }





    }

})();
