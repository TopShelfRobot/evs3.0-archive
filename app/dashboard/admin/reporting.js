(function() {
	'use strict';
	var controllerId = 'reporting';
	angular.module('app').controller(controllerId, ['$routeParams', 'common', 'datacontext', 'config', reporting]);

	function reporting($routeParams, common, datacontext, config) {
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		var vm = this;

		vm.title = 'app';

		vm.eventureId = $routeParams.eventureId;

		vm.ownerId = 1;

		var shirtApi = config.remoteApiName + 'analytic/getTshirtCount/0';
		var packetPickupApi = config.remoteApiName + 'analytic/getPacketPickup/0';

		activate();

		function activate() {
			common.activateController(getEventuresByOwnerId(), controllerId)
				.then(function() {});
		}

		function getEventuresByOwnerId() {
			return datacontext.eventure.getEventuresByOwnerId(1)
				.then(function(data) {
					vm.eventures = data;
				});
		}

		vm.makeGrids = function() {
			shirtApi = config.remoteApiName + 'analytic/getTshirtCount/' + vm.selectedEvent;
			packetPickupApi = config.remoteApiName + 'analytic/getPacketPickup/' + vm.selectedEvent;

			var shirtGrid = vm.shirtGrid;
			var packetPickupGrid = vm.packetPickupGrid;

			var shirtDataSource = new kendo.data.DataSource({
				transport: {
					read: {
						url: shirtApi,
						dataType: "json"
					}
				}
			});
			shirtGrid.setDataSource(shirtDataSource);

			var packetPickupDataSource = new kendo.data.DataSource({
				transport: {
					read: {
						url: packetPickupApi,
						dataType: "json"
					}
				}
			});
			packetPickupGrid.setDataSource(packetPickupdataSource);

		};

		vm.shirtGridOptions = {
			toolbar: ['excel'],
			excel: {
				fileName: 'T-shirt-Report.xlsx',
				filterable: true,
				allPages: true
			},
			dataSource: {
				type: 'json',
				transport: {
					read: shirtApi
				},
				pageSize: 15,
				serverPaging: false,
				serverSorting: false
			},
			sortable: true,
			pageable: true,
			filterable: {
				mode: 'row'
			},
			columns: [{
				field: 'listing',
				title: 'Listing',
				width: 300
			}, {
				field: 'gender',
				title: 'Gender',
				width: 200
			}, {
				field: 'shirtSize',
				title: 'Shirt Size',
				width: 200
			}, {
				field: 'shirtCount',
				title: 'Shirt Count',
				width: 200
			}]
		};

		vm.packetPickupGridOptions = {
			toolbar: ['excel'],
			excel: {
				fileName: 'Packet-Pickup-Report.xlsx',
				filterable: true,
				allPages: true
			},
			dataSource: {
				type: 'json',
				transport: {
					read: packetPickupApi
				},
				pageSize: 15,
				serverPaging: false,
				serverSorting: false
			},
			sortable: true,
			pageable: true,
			filterable: {
				mode: 'row'
			},
			columns: [{
				field: 'listing',
				title: 'Listing',
				width: 300
			}, {
				field: 'gender',
				title: 'Gender',
				width: 200
			}, {
				field: 'shirtSize',
				title: 'Shirt Size',
				width: 200
			}, {
				field: 'shirtCount',
				title: 'Shirt Count',
				width: 200
			}]
		};


	}
})();
