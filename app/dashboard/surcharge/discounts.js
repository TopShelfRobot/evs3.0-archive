(function () {
	'use strict';
	var controllerId = 'discounts';
	angular.module('app').controller(controllerId, ['config', 'common', 'datacontext', discounts]);

	function discounts(config, common, datacontext) {
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		var vm = this;

		vm.title = 'app';

		vm.couponGridOptions = {};

		vm.ownerId = config.owner.ownerId;

		vm.owner = {};

		activate();

		function activate() {
			var promises = [couponGrid(), addonGrid(), getOwner(), getAmountTypes()];
			common.activateController(promises, controllerId)
				.then(function () {
					//log('Activated Coupon Addon Center View');
				});
		}

		function couponGrid() {

			var status = [{
				'value': true,
				'text': 'Active',
          }, {
				'value': false,
				'text': 'Inactive'
          }];

			var couponApi = config.remoteApiName + 'widget/GetCouponsByOwnerId/' + config.owner.ownerId;
			vm.couponGridOptions = {
				toolbar: ['excel'],
				excel: {
					fileName: 'Coupons.xlsx',
					filterable: true,
					allPages: true
				},
				dataSource: {
					type: 'json',
					transport: {
						read: couponApi
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
				detailTemplate: kendo.template($('#couponTemplate').html()),
				columns: [{
					field: 'code',
					title: 'Coupon',
					width: 400
            }, {
					field: 'amount',
					title: 'Amount',
					format: '{0:c}',
					width: 220
            }, {
					field: 'active',
					width: 100,
					values: status
            }, {
					title: '',
					width: 120,
					template: '<a class="btn btn-default btn-block" href="\\\#setcoupon/#=id#"><em class="glyphicon glyphicon-edit"></em>&nbsp;Edit</a>'
            }]
			};

			vm.detailGridOptions = function (e) {
				var couponUseApi = config.remoteApiName + 'widget/GetCouponUseByCouponId/' + e.id;

				return {
					toolbar: ['excel'],
					excel: {
						fileName: 'CouponsDetails.xlsx', //'CouponsDetails-' + e.code + '.xlsx',
						filterable: true,
						allPages: true
					},
					dataSource: {
						type: 'json',
						transport: {
							read: couponUseApi
						},
						serverPaging: false,
						serverSorting: false,
						serverFiltering: false,
						pageSize: 5
					},
					sortable: true,
					pageable: true,
					columns: [
						{
							field: 'name',
							title: 'List',
							width: 300
                   }, {
							field: 'amount',
							title: 'Amount',
							format: '{0:c}',
							width: 150
                   }, {
							field: 'description',
							title: 'Coupon',
							width: 225
                   }, {
							field: 'firstName',
							title: 'First Name'
                   }, {
							field: 'lastName',
							title: 'Last Name'
                   }]
				};
			};
		}

		function addonGrid() {

			var addonApi = config.remoteApiName + 'widget/GetAddonsByOwnerId/' + config.owner.ownerId;
			vm.addonGridOptions = {
				toolbar: ['excel'],
				excel: {
					fileName: 'Addons.xlsx',
					filterable: true,
					allPages: true
				},
				dataSource: {
					type: 'json',
					transport: {
						read: addonApi
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
				detailTemplate: kendo.template($('#addonTemplate').html()),
				columns: [{
					field: 'name',
					title: 'Addon',
					width: 250
            }, {
					field: 'eventureName',
					title: 'Eventure',
					width: 250
            }, {
					field: 'addonType',
					title: 'Addon Type',
					width: 110
            }, {
					field: 'amount',
					title: 'Amount',
					width: 110,
					format: '{0:c}'
            }, {
					title: '',
					width: 90,
					template: '<a class="btn btn-default btn-block" href="\\\#setaddon/#=id#"><em class="glyphicon glyphicon-edit"></em>&nbsp;Edit</a>'
            }]
			};

			vm.addonDetailGridOptions = function (e) {
				var addonUseApi = config.remoteApiName + 'widget/GetAddonsUseByAddonId/' + e.id;

				return {
					toolbar: ['excel'],
					excel: {
						fileName: 'AddonsDetails.xlsx',
						filterable: true,
						allPages: true
					},
					dataSource: {
						type: 'json',
						transport: {
							read: addonUseApi
						},
						serverPaging: false,
						serverSorting: false,
						serverFiltering: false,
						pageSize: 5
					},
					sortable: true,
					pageable: true,
					columns: [{
						field: 'participant',
						title: 'Participant'
                 }, {
						field: 'eventureName',
						title: 'Eventure'
                 }, {
						field: 'qty',
						title: 'Qty',
						width: 120
                 }, {
						field: 'eventureOrderId',
						title: 'Order Id',
						width: 150
                 }, {
						field: 'amount',
						title: 'Amount',
						format: '{0:c}',
						width: 150
         }]
				};
			};
		}

		function getOwner() {
			return datacontext.participant.getOwnerById(vm.ownerId)
				.then(function (data) {
					vm.owner = data;
					return vm.owner;
				});
		}

		function getAmountTypes() {
			return datacontext.participant.getAmountTypes()
				.then(function (data) {
					vm.amountTypes = data;
					return vm.amountTypes;
				});
		}

		vm.saveDiscounts = function () {
			datacontext.save()
				.then(function () {
					console.log('saved');
				});
		};

	}
})();
