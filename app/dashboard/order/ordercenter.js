(function () {
  'use strict';

  var controllerId = 'orderCenter';
  angular.module('app').controller(controllerId, ['common', 'config', orderCenter]);

  function orderCenter(common, config) {

    var getLogFn = common.logger.getLogFn;
    var log = getLogFn(controllerId);

    var vm = this;

    vm.ownerId = config.owner.ownerId;

    activate();

    var promises = [createOrderGrid()];

    function activate() {
      common.activateController(promises, controllerId)
        .then(function () {});
    }

    function createOrderGrid() {
      var status = [{
        'value': true,
        'text': 'Active',
          }, {
        'value': false,
        'text': 'Inactive'
          }];

      var orderApi = config.remoteApiName + 'widget/GetAllOrdersByOwnerId/' + vm.ownerId;

      vm.orderGridOptions = {
        toolbar: ['excel'],
        excel: {
          fileName: 'Orders.xlsx',
          filterable: true,
          allPages: true
        },
        dataSource: {
          type: 'json',
          transport: {
            read: orderApi
          },
          schema: {
            model: {
              fields: {
                orderDate: {
                  type: 'date'
                }
              }
            }
          },
          pageSize: 10,
          serverPaging: false,
          serverSorting: false
        },
        sortable: true,
        pageable: true,
        filterable: {
          mode: 'row'
        },
        detailTemplate: kendo.template($('#template').html()),
        columns: [{
          field: 'name',
          title: 'Event',
          template: '<a href="\\\#eventuredetail/#=id#">#=name#</a>',
          width: '500px',
           }, {
          field: 'displayDate',
          title: 'Date',
           }, {
          title: '',
          template: '<a class="btn btn-default btn-block" href="\\\#seteventure/#=id#"><em class="glyphicon glyphicon-edit"></em>&nbsp;Edit</a>'
           }]
      };

      vm.orderDetailGridOptions = function (e) {

        var regApi = config.remoteApiName + 'widget/GetRegistrationsByOrderId/' + e.id;

        return {
          dataSource: {
            type: 'json',
            transport: {
              read: regApi
            },
            schema: {
              model: {
                fields: {
                  registrationDate: {
                    type: 'date'
                  }
                }
              }
            },
            serverPaging: false,
            serverSorting: false,
            serverFiltering: false,
            pageSize: 5
          },
          sortable: true,
          pageable: true,
          columns: [{
            field: 'displayName',
            title: 'Listing'
            }, {
            field: 'totalAmount',
            title: 'Amount',
            format: '{0:c}',
            width: 150
            }, {
            field: 'quantity',
            title: 'Qty',
            width: 55
            }, {
            field: 'dateCreated',
            title: 'Registration Date',
            type: 'date',
            format: '{0:MM/dd/yyyy}',
            width: 180
            }, {
            field: 'active',
            values: status
            }, {
            field: '',
            title: '',
            width: 130,
            template: '<a href="\\#setrefund/#=id#/#=eventureOrderId#" class="btn btn-danger btn-block"><em class="fa fa-warning"></em>&nbsp;&nbsp;Refund</a>'
          }]
        };
      };
    }
  }
})();