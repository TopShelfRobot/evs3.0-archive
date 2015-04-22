(function() {
	'use strict';
	var controllerId = 'dashboard';
	angular.module('app').controller(controllerId, ['$http', 'common', 'config', 'uiGmapGoogleMapApi', dashboard]);

	function dashboard($http, common, config, uiGmapGoogleMapApi) {
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		var vm = this;
		vm.title = 'app';
		vm.ownerId = config.owner.ownerId;
		vm.year = new Date().getFullYear();
		vm.chartOptions = {
			theme: 'material'
		};
		vm.map = {
			center: {
				latitude: 45,
				longitude: -73
			},
			zoom: 8
		};
		//Graph Apis
		var overviewOwnerApi = config.remoteApiName + 'widget/GetOwnerGraph/' + vm.ownerId;
		var genderByYearApi = config.remoteApiName + 'widget/GetGenderInfoByYear/' + vm.year;
		var ageByYearApi = config.remoteApiName + 'widget/GetAgeInfoByYear/' + vm.year;
		var zipByYearApi = config.remoteApiName + 'widget/GetZipHeatMapByYear/' + vm.year;
		var capacityByYearApi = config.remoteApiName + 'widget/GetCapacityRegDialsByYear/' + vm.year;
		activate();

		function activate() {
			var promises = [
				CapacityByYearRadial(),
				GenderByYearPie(),
				AmountByZipBubble()
			];

			common.activateController(promises, controllerId)
				.then(function() {
					uiGmapGoogleMapApi.then(function(map) {
						google.maps.event.trigger(map, 'resize');

					});
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

		function GenderByYearPie() {
			vm.gender = new kendo.data.DataSource({
				transport: {
					read: {
						url: genderByYearApi,
						dataType: 'json'
					}
				}
			})	
		}

		function AmountByZipBubble() {
			vm.zipDataSource = new kendo.data.DataSource({
				transport: {
					read: {
						url: zipByYearApi,
						dataType: 'json'
					}
				}
			});
		}






		function ownerOverviewChart() {}

		vm.OverviewOwnerChart = {
			theme: 'material',
			dataSource: {
				transport: {
					read: {
						url: overviewOwnerApi,
						dataType: 'json'
					}
				}
			},
			title: {
				text: 'Eventure Overview'
			},
			legend: {
				position: 'bottom'
			},
			series: [{
				type: 'column',
				field: 'Rev',
				name: 'Revenue',
				axis: 'Revenue'
			}, {
				type: 'line',
				field: 'Regs',
				name: 'Registrations',
				axis: 'Registrations'
			}],
			valueAxis: [{
				name: 'Revenue',
				title: {
					text: 'Revenue'
				}
			}, {
				name: 'Registrations',
				title: {
					text: 'Registrations'
				}
			}],
			categoryAxis: {
				field: 'Month',
				majorGridLines: {
					visible: false
				}
			},
			tooltip: {
				visible: true,
				template: '#= series.name #: #= value #'
			}
		};

	}
})();
