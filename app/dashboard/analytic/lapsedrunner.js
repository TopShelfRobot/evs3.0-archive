(function() {
	'use strict';
	var controllerId = 'lapsedRunner';
	angular.module('app').controller(controllerId, ['$routeParams', 'config', 'common', lapsedRunner]);

	function lapsedRunner($routeParams, config, common) {
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		var vm = this;
		vm.eventureId = $routeParams.eventureId;
		//Apis
		var lapsedRunnerApi = config.remoteApiName + 'analytic/getLapsedRunnersByEventureId/' + vm.eventureId +'/54321';

		activate();

		function activate() {
			var promises = [];

			common.activateController(promises, controllerId)
				.then(function() {
				});
		}

		vm.lapsedGridOptions = {
			toolbar: ['excel'],
			excel: {
				fileName: 'Lapsed-Runners.xlsx',
				filterable: true,
				allPages: true
			},
			dataSource: {
				type: 'json',
				transport: {
					read: lapsedRunnerApi
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
			}]
		};
	}
})();
