(function() {
	'use strict';
	var controllerId = 'couponDetailAnalytics';
	angular.module('app').controller(controllerId, ['$routeParams', '$http', 'config', 'common', 'datacontext', couponDetailAnalytics]);

	function couponDetailAnalytics($routeParams, $http, config, common, datacontext) {
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		var vm = this;

		vm.coupons = [];
		vm.couponTotal = {};
		vm.ownerId = config.owner.ownerId;
		vm.eventureId = $routeParams.eventureId;
		vm.chartOptions = {
			theme: 'material',
			legend: {
				visible: false
			}
		};
		//Apis
		var couponPartsApi = config.remoteApiName + 'analytic/getCouponsByEventureId/' + vm.eventureId;
		var couponUseEventApi = config.remoteApiName + 'analytic/getCouponGroupingsByEventureId/' + vm.eventureId;
		var couponTotalsApi = config.remoteApiName + 'analytic/getCouponTotalsByEventureId/' + vm.eventureId;

		activate();

		function activate() {
			var promises = [getCouponTotals()];

			common.activateController(promises, controllerId)
				.then(function() {
					//log('Activated Coupon Addon Center View');
				});
		}

		function getCouponTotals() {
			$http.get(couponTotalsApi).then(function(totals) {
				vm.couponTotal.amount = Math.abs(totals.data[0].amount);
				vm.couponTotal.count = totals.data[0].count;
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
				schema: {
					model: {
						fields: {
							dateCouponRedeemed: {
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
			columns: [{
				field: 'lastName',
				title: 'Name',
				template: '#= firstName # #= lastName #',
				width: 300
			}, {
				field: 'email',
				title: 'Email Address',
				width: 200
			}, {
				field: 'couponAmount',
				title: 'Amount',
				width: 120,
				format: '{0:c}'
			}, {
				field: 'code',
				title: 'Coupon',
				width: '170px',
			}]
		};
	}
})();
