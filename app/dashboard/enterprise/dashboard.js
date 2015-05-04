(function() {
	'use strict';
	var controllerId = 'dashboard';
	angular.module('app').controller(controllerId, ['$http', 'common', 'config', 'uiGmapGoogleMapApi', dashboard]);

	function dashboard($http, common, config, uiGmapGoogleMapApi) {
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		var vm = this;
		var ownerId = config.owner.ownerId;
		var year = new Date().getFullYear();
		//Graph Apis
		var genderByYearApi = config.remoteApiName + 'widget/GetGenderInfoByYear/' + year;
		var ageByYearApi = config.remoteApiName + 'widget/GetAgeInfoByYear/' + year;
		var zipByYearApi = config.remoteApiName + 'widget/GetZipHeatMapByYear/' + year;
		var capacityByYearApi = config.remoteApiName + 'widget/GetCapacityRegDialsByYear/' + year;
		var trendByOwnerApi = config.remoteApiName + 'widget/GetTrendByOwnerId/' + ownerId;
		var revenueByOwnerApi = config.remoteApiName + 'widget/GetRevenueByOwnerId/' + ownerId;
		//Set Default Chart Options
		vm.chartOptions = {
			theme: 'material',
			legend: {
				visible: false
			},
			tooltip: {
				visible: true
			}
		};
		// vm.map = {
		// 	center: {
		// 		latitude: 45,
		// 		longitude: -73
		// 	},
		// 	zoom: 8
		// };
		activate();

		function activate() {
			var promises = [CapacityByYearRadial()];

			common.activateController(promises, controllerId)
				.then(function() {
					// uiGmapGoogleMapApi.then(function(map) {
					// 	google.maps.event.trigger(map, 'resize');
					// });
				});
		}

		function CapacityByYearRadial() {
			$http.get(capacityByYearApi).then(
				function(events) {
					vm.capacityEventOne = events.data[0].capacity;
					vm.regsEventOne = events.data[0].regs;
					vm.radialEventOneName = events.data[0].name;
					vm.capacityEventTwo = events.data[1].capacity;
					vm.regsEventTwo = events.data[1].regs;
					vm.radialEventTwoName = events.data[1].name;
					vm.capacityEventThree = events.data[2].capacity;
					vm.regsEventThree = events.data[2].regs;
					vm.radialEventThreeName = events.data[2].name;
				});
		}

		vm.gender = new kendo.data.DataSource({
			transport: {
				read: {
					url: genderByYearApi,
					dataType: 'json'
				}
			}
		});

		vm.ageGroup = new kendo.data.DataSource({
			transport: {
				read: {
					url: ageByYearApi,
					dataType: 'json'
				}
			}
		});

		vm.zip = new kendo.data.DataSource({
			transport: {
				read: {
					url: zipByYearApi,
					dataType: 'json'
				}
			}
		});

		vm.trend = new kendo.data.DataSource({
			transport: {
				read: {
					url: trendByOwnerApi,
					dataType: 'json'
				}
			}
		});

		vm.revenue = new kendo.data.DataSource({
			transport: {
				read: {
					url: revenueByOwnerApi,
					dataType: 'json'
				}
			}
		});
	}
})();
