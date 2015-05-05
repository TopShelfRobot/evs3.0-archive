(function() {
	'use strict';
	var controllerId = 'enterpriseeventure';
	angular.module('app').controller(controllerId, ['$routeParams', '$http', 'common', 'datacontext', 'config', enterpriseeventure]);

	function enterpriseeventure($routeParams, $http, common, datacontext, config) {
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		var vm = this;
		vm.eventureId = $routeParams.eventureId;
		var ownerId = 1;
		var status = [{
			"value": true,
			"text": "Active",
		}, {
			"value": false,
			"text": "Inactive"
		}];

		vm.chartOptions = {
			theme: 'material',
			legend: {
				visible: false
			},
			tooltip: {
				visible: true
			}
		};

		//APIs
		var ownerByEventApi = config.remoteApiName + 'widget/getEventureGraph/' + vm.eventureId;
		var serviceApi = config.remoteApiName + 'widget/getEventureServiceByEventureId/' + vm.eventureId;
		var listApi = config.remoteApiName + 'widget/getEventureListsByEventureId/' + vm.eventureId;
		var genderApi = config.remoteApiName + 'widget/getGenderInfoByEventureId/' + vm.eventureId;
		var revByListApi = config.remoteApiName + 'widget/getRevenueByListByEventureId/' + vm.eventureId;

		activate();

		function activate() {
			common.activateController(getEventure(), getGender(), controllerId)
				.then(function() {});
		}

		function getEventure() {
			return datacontext.eventure.getEventureById(vm.eventureId)
				.then(function(data) {
					vm.eventure = data;
					return vm.eventure;
				});
		}

		function getGender() {
			$http.get(genderApi).then(function(gender) {
				vm.male=gender.data[1].amount;
				vm.female=gender.data[0].amount;
				vm.genderTotal = vm.male + vm.female;
			});
		}

		vm.regRev = new kendo.data.DataSource({
			transport: {
				read: {
					url: ownerByEventApi,
					dataType: 'json'
				}
			}
		});

		vm.revByList = new kendo.data.DataSource({
			transport: {
				read: {
					url: revByListApi,
					dataType: 'json'
				}
			}
		});

		vm.listGridOptions = {
			toolbar: ['excel'],
			excel: {
				fileName: 'Listings.xlsx',
				filterable: true,
				allPages: true
			},
			dataSource: {
				type: "json",
				transport: {
					read: listApi
				},
				schema: {
					model: {
						fields: {
							active: {
								type: "boolean"
							},
							dateEventureList: {
								type: "date"
							},
							dateBeginReg: {
								type: "date"
							},
							dateEndReg: {
								type: "date"
							},
							id: {
								type: "number"
							},
							name: {
								type: "string"
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
			columns: [{
				title: "Listing",
				template: '<a href="\\\#elistcenter/#=id#">#=name#</a>'
			}, {
				field: "dateEventureList",
				title: "Date",
				width: "220px",
				format: "{0:MM/dd/yyyy}"
			}, {
				field: "dateBeginReg",
				title: "Registration Begins",
				width: "220px",
				format: "{0:MM/dd/yyyy}"
			}, {
				field: "dateEndReg",
				title: "Registration Ends",
				width: "220px",
				format: "{0:MM/dd/yyyy}"
			}, {
				field: "active",
				width: "100px",
				values: status
			}, {
				title: "",
				width: "120px",
				template: '<a class="btn btn-default btn-block" href="\\\#setlist/#=id#"><em class="glyphicon glyphicon-edit"></em>&nbsp;Edit</a>'
			}]
		};

		vm.servicesGridOptions = {
			toolbar: ['excel'],
			excel: {
				fileName: 'Services.xlsx',
				filterable: true,
				allPages: true
			},
			dataSource: {
				transport: {
					read: serviceApi
				},
				schema: {
					model: {
						fields: {
							dateDue: {
								type: "date"
							}
						}
					}
				},
				pageSize: 10,
				serverPaging: false,
				serverFiltering: false,
				serverSorting: true
			},
			filterable: {
				extra: false,
				operators: {
					string: {
						contains: "Contains",
						startswith: "Starts with",
						eq: "Equal to"
					}
				}
			},
			sortable: true,
			pageable: true,
			dataBound: function() {},
			columns: [{
				field: "resourceServiceText",
				title: "Service",
				width: "225px"
			}, {
				field: "amount",
				title: "Amount",
				format: "{0:c}",
				width: "175px"
			}, {
				field: "isVariable",
				title: "Variable Cost",
				width: "275px"
			}]
		};
	}
})();
