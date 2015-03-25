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

			var orderApi = config.remoteApiName + 'widget/GetOrdersByOwnerId/' + vm.ownerId;

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
								dateCreated: {
									type: 'date'
								}
							}
						}
					},
					sort: {
						field: 'id',
						dir: 'desc'
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
					field: 'id',
					title: 'Order Id',
					width: 220
          }, {
					title: 'Account Holder',
					field: 'lastName',
					template: '#=firstName# #=lastName#',
					width: 350,
           }, {
					field: 'dateCreated',
					title: 'Date',
					format: '{0:MM/dd/yyyy}',
					width: 300
           }, {
					field: 'amount',
					title: 'Amount',
					format: '{0:c}',
					filterable: false,
					width: 120
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
									dateCreated: {
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
						field: 'name',
						title: 'Listing',
						width: 200
						}, {
						field: 'participant',
						title: 'Participant',
						width: 200
						}, {
						field: 'listAmount',
						title: 'Amount',
						format: '{0:c}',
						width: 150
						}, {
						field: 'dateCreated',
						title: 'Registration Date',
						type: 'date',
						format: '{0:MM/dd/yyyy}',
						width: 150
						}, {
						field: 'status',
						title: 'Status',
						width: 80
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
