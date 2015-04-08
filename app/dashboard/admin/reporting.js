(function() {
	'use strict';
	var controllerId = 'reporting';
	angular.module('app').controller(controllerId, ['common', 'datacontext', 'config', reporting]);

	function reporting(common, datacontext, config) {
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		var vm = this;
		vm.title = 'app';
		vm.reports = [];
		vm.ownerId = config.owner.ownerId;

		activate();

		function activate() {
			var promises = [paymentGrid(), rosterGrid()];
			common.activateController(promises, controllerId)
				.then(function() {
					//log('Activated reporting View');
				});
		}

		function paymentGrid() {
			var teamPaymentReportApi = config.remoteApiName + 'widget/getTeamPaymentInfoByEventureId/2';
			vm.paymentGridOptions = {
				toolbar: ['excel'],
				excel: {
					fileName: 'TeamPayments.xlsx',
					filterable: true
				},
				dataSource: {
					type: 'json',
					transport: {
						read: teamPaymentReportApi
					},
					schema: {
						model: {
							fields: {
								name: {
									type: 'string'
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
					mode: "row"
				},
				columns: [{
					field: 'teamName',
					title: 'Team Name',
					width: 250
				}, {
					field: 'amountPaid',
					title: 'Amount Paid',
					width: 100,
					format: '{0:c}'
				}, {
					field: 'captain',
					title: 'Captain',
					width: 250
				}, {
					field: 'email',
					title: 'Email',
					width: 250
				}, {
					field: 'balance',
					title: 'Balance',
					width: 100,
					format: '{0:c}'
				}, {
					field: 'amountOwed',
					title: 'Amount Owed',
					width: 100,
					format: '{0:c}'
				}]
			};
		}

		function rosterGrid() {
			var teamRosterReportApi = config.remoteApiName + 'widget/GetTeamRosterInfoByEventureId/2';
			vm.rosterGridOptions = {
				toolbar: ['excel'],
				excel: {
					fileName: 'TeamRoster.xlsx',
					filterable: true
				},
				dataSource: {
					type: 'json',
					transport: {
						read: teamRosterReportApi
					},
					pageSize: 10,
					serverPaging: false,
					serverSorting: false
				},
				sortable: true,
				pageable: true,
				filterable: {
					mode: "row"
				},
				columns: [{
					title: 'Member Name',
          template: kendo.template($("#rosterNameTemplate").html())
					width: 250
				}, {
					field: 'email',
					title: 'Email',
					width: 250
				}, {
					field: 'phoneMobile',
					title: 'Phone',
					width: 150
				}, {
					field: 'teamName',
					title: 'Team Name',
					width: 250
				}, {
					field: 'postion',
					title: 'Team Role',
					width: 150
				}, {
					field: 'shirtSize',
					title: 'Shirt Size',
					width: 100
				}, {
					field: 'emergencyContact',
					title: 'Emergency Contact',
					width: 200
				}, {
					field: 'emergencyPhone',
					title: 'Emergency Phone',
					width: 150
				}]
			};
		}



	}
})();
