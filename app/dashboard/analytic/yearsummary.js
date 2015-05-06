(function() {
	'use strict';
	var controllerId = 'yearsummary';
	angular.module('app').controller(controllerId, ['$routeParams', 'config', 'common', 'datacontext', yearsummary]);

	function yearsummary($routeParams, config, common, datacontext) {
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		var vm = this;

		vm.title = 'app';

		vm.eventureId = $routeParams.eventureId;

		vm.chart = {
			startYear: 2012,
			endYear: 2014,
			//eventureId: 1,
			type: 0
		};
		vm.chartOptions = {
			theme: 'material',
			legend: {
				position: 'bottom'
			},
			tooltip: {
				visible: true
			},
			categoryAxis: {
				field: 'month',
				labels: {
					format: 'MMM'
				}
			}

		};
		vm.eventures = [];
		vm.ownerId = config.owner.ownerId;
		var yearSummaryApi = config.remoteApiName + 'analytic/GetYearOverYearData/' + vm.ownerId + '/' + vm.eventureId + '/' + vm.chart.startYear + '/' + vm.chart.endYear + '/' + vm.chart.type;
		activate();

		function activate() {
			var promises = [getEventures()];
			common.activateController(promises, controllerId)
				.then(function() {});
		}

		var min = vm.min = moment('2000-01-01');
		var max = vm.max = moment(new Date());
		vm.years = [];

		for (var i = max.year(); i >= min.year(); i--) {
			vm.years.push(i);
		}

		function getEventures() {
			return datacontext.eventure.getEventuresByOwnerId(vm.ownerId)
				.then(function(data) {
					//applyFilter();
					vm.eventures = data;
					return vm.eventures;
				});
		}

		vm.generateChart = function() {
			var chart = vm.summaryChart;
			var dataSource = new kendo.data.DataSource({
				transport: {
					read: {
						url: function() {
							return config.remoteApiName + 'analytic/GetYearOverYearData/' + vm.ownerId + '/' + vm.eventureId + '/' + vm.chart.startYear + '/' + vm.chart.endYear + '/' + vm.chart.type;
							//return 'http://dev30.eventuresports.info/' + 'analytic/GetYearOverYearData/' + vm.ownerId + '/' + vm.eventureId + '/' + vm.chart.startYear + '/' + vm.chart.endYear + '/' + vm.chart.type;
						},
						dataType: "json"
					}
				},
				group: {
					field: "year"
				},
				sort: {
					field: "month",
					dir: "asc"
				},
				schema: {
					model: {
						fields: {
							month: {
								type: "date"
							}
						}
					}
				}
			});
			chart.setDataSource(dataSource);
		};

		vm.yearSummary = new kendo.data.DataSource({
			transport: {
				read: {
					url: yearSummaryApi,
					dataType: 'json'
				}
			},
			group: {
				field: 'year'
			},
			sort: {
				field: 'month',
				dir: 'asc'
			}
		});
	}
})();
