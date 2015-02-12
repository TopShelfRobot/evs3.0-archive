(function () {
  'use strict';
  var controllerId = 'couponDetailAnalytics';
  angular.module('app').controller(controllerId, ['$routeParams', 'config', 'common', 'datacontext', couponDetailAnalytics]);

  function couponDetailAnalytics($routeParams, config, common, datacontext) {
    var getLogFn = common.logger.getLogFn;
    var log = getLogFn(controllerId);

    var vm = this;

    vm.coupons = [];
    vm.ownerId = config.owner.ownerId;
    vm.couponId = $routeParams.couponId;

    activate();

    function activate() {
      var promises = [couponInfo()];

      common.activateController(promises, controllerId)
        .then(function () {
          //log('Activated Coupon Addon Center View');
        });
    }

    function getCouponTotals() {
      return datacontext.surcharge.getCouponTotalsByCouponId(vm.couponId)
        .then(function (data) {
            vm.couponTotals = data;
            return vm.couponTotals;
        });
    }

    function couponInfo() {

      var couponUseApi = config.remoteApiName +
        'analytic/GetCouponUsePieChartByCouponId/' +
        vm.ownerId;

      vm.couponUse = new kendo.data.DataSource({
        transport: {
          read: {
            url: couponUseApi,
            dataType: 'json'
          }
        }
      });

      var status = [{
        'value': true,
        'text': 'Active',
      }, {
        'value': false,
        'text': 'Inactive'
      }];

      var couponapi = config.remoteApiName + 'widget/GetPartsByCouponId/' + vm.ownerId;
      vm.couponGridOptions = {
        toolbar: ['excel'],
        excel: {
          fileName: 'Coupon-Parts.xlsx',
          filterable: true,
          allPages: true
        },
        dataSource: {
          type: 'json',
          transport: {
            read: couponapi
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
        columns: [{
          field: 'name',
          title: 'Name',
          width: '400px'
        }, {
          field: 'email',
          title: 'Email Address'
        }, {
          field: 'amount',
          title: 'Amount',
          width: '220px'
        }, {
          field: 'couponUsed',
          title: 'DateUsed',
          width: '100px',
          values: status
        }]
      };
      
    }
  }
})();
