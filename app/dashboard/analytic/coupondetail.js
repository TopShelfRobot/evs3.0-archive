(function() {
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
		var status = [{
			'value': true,
			'text': 'Active',
		}, {
			'value': false,
			'text': 'Inactive'
		}];
		//Apis
		var couponPartsApi = config.remoteApiName + 'widget/getPartsByCouponId/' + vm.ownerId;
		var couponUseEventApi = config.remoteApiName + 'analytic/getCouponUseByEventureId/' + vm.ownerId;

		activate();

		function activate() {
			var promises = [getCouponTotals()];

			common.activateController(promises, controllerId)
				.then(function() {
					//log('Activated Coupon Addon Center View');
				});
		}

		function getCouponTotals() {
			return datacontext.surcharge.getCouponTotalsByCouponId(vm.couponId)
				.then(function(data) {
					vm.couponTotals = data;
					return vm.couponTotals;
				});
		}

		vm.couponUse = new kendo.data.DataSource({
			transport: {
				read: {
					url: couponUseEventApi,
					dataType: 'json'
				}
			}
		});

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
					read: couponPartsApi
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
})();
