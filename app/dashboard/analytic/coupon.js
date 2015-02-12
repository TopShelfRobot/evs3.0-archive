(function () {
	'use strict';
	var controllerId = 'couponAnalytics';
	angular.module('app').controller(controllerId, ['$routeParams', 'config', 'common', 'datacontext', couponAnalytics]);

	function couponAnalytics($routeParams, config, common, datacontext) {
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		var vm = this;

		vm.coupons = [];
		vm.ownerId = config.owner.ownerId;

		activate();

		function activate() {
			var promises = [couponInfo()];

			common.activateController(promises, controllerId)
				.then(function () {
					//log('Activated Coupon Addon Center View');
				});
		}

		function getListing() {
			return datacontext.surcharge.getCouponTotalsByOwnerId(vm.ownerId)
				.then(function (data) {
						return vm.couponTotals = data;
				});
		}

		function couponInfo() {

			var couponUseApi = config.remoteApiName +
				'analytic/GetCouponUsePieChartByOwnerId/' +
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

			var couponapi = config.remoteApiName + 'widget/GetCouponsByOwnerId/' + vm.ownerId;
			vm.couponGridOptions = {
				toolbar: ['excel'],
				excel: {
					fileName: 'AllCoupons.xlsx',
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
					title: 'Coupon',
					template: '<a href="\\\#coupondetail/#=id#">#=code#</a>',
					width: '400px'
        }, {
					field: 'amount',
					title: 'Amount',
					width: '220px'
        }, {
					field: 'active',
					width: '100px',
					values: status
        }, {
					title: '',
					width: '120px',
					template: '<a class="btn btn-default btn-block" href="\\#setcoupon/#=id#"><em class="glyphicon glyphicon-edit"></em>&nbsp;Edit</a>'
        }]
			};
		}

	}
})();
