(function(){

	var controllerId = "UserProfile";

	function Controller($scope, $routeParams, config, datacontext, common, cart){

		$scope.participant = {};

		$scope.disableEmail = true;

		$scope.participantId = $routeParams.participantId || cart.participantId;

		$scope.partButton = cart.regSettings.partButtonText

		var promises = [getParticipant(), Registrations(), Participants(), Team(), Coach()];

		common.activateController(promises, controllerId)
			.then(function(){
			});

		function getParticipant() {
			return datacontext.participant.getParticipantById($scope.participantId)
				.then(function(participant) {
					$scope.participant = participant;
					$scope.date.dateBirth = moment($scope.participant.dateBirth).format('YYYY-MM-DD');
				});
		}

		function Registrations() {
			var regapi = config.remoteApiName + 'widget/GetRegistrationsByPartId/' + $scope.participantId;

			$scope.registrationGridOptions = {
				dataSource: {
					type: "json",
					transport: {
						read: regapi
					},
					pageSize: 10,
					serverPaging: false,
					serverSorting: false
				},
				sortable: true,
				pageable: true,
				filterable: true,
				columns: [{
					field: "displayName",
					title: "Listing",
					width: 300
				}, {
					field: "totalAmount",
					title: "Amount",
					format: "{0:c}",
					width: 150
				}, {
					field: "quantity",
					title: "Quantity",
					width: 125
				}, {
					field: "dateCreated",
					title: "Registration Date",
					type: "date",
					format: "{0:MM/dd/yyyy}",
					width: 200
				},{
					field: '',
					title: '',
					template: '<a href="\\\#viewreceipt/#=eventureOrderId#" class="btn btn-success btn-block">View Receipt</a>'
				}, {
					field: '',
					title: '',
					template: '<a href="\\\#registration/#=id#" class="btn btn-default btn-block">Edit</a>'
				}]
			};
			console.log($scope.registrationGridOptions);
		}

		$scope.date = {
			dateBirth: '1993-07-03'
		};

		$scope.save = function(){
			$scope.date.dateBirth = moment($scope.date.dateBirth).toISOString();
			$scope.participant.dateBirth = $scope.date.dateBirth;
			datacontext.save()
				.then(function(){
					console.log("saved");
				});
		};

//$scope.today = function () {
//	$scope.participant.dateBirth = new Date();
//};
//
//$scope.today();
//
//$scope.open = function($event, open) {
//	$event.preventDefault();
//	$event.stopPropagation();
//	$scope[open] = true;
//};
//
//$scope.dateOptions = {
//	'year-format': "'yy'",
//	'starting-day': 1,
//	showWeeks: 'false'
//};
//
//$scope.formats = ['MM-dd-yyyy', 'yyyy/MM/dd', 'shortDate'];
//
//$scope.format = $scope.formats[0];


		function Participants() {
			var partapi = config.remoteApiName + 'widget/GetParticipantsByHouseId/' + cart.houseId;

			$scope.participantGridOptions = {
				dataSource: {
					type: "json",
					transport: {
						read: partapi
					},
					pageSize: 10,
					serverPaging: false,
					serverSorting: false
				},
				sortable: true,
				pageable: true,
				filterable: true,
				detailTemplate: kendo.template($("#parttemplate").html()),
				columns: [{
					field: "firstName",
					title: "First Name",
					width: "200px"
				},{
					field: "lastName",
					title: "Last Name",
					width: "200px"
				},{
					field: "email",
					title: "Email Address",
					width: "220px"
				},{
					title: "",
					width: "120px",
					template:'<a class="btn btn-default btn-block" href="\\\#participant/#=id#">Edit</a>'
				}]
			};

			$scope.partDetailGridOptions = function(e) {

				var regapi = config.remoteApiName + 'widget/GetRegistrationsByPartId/' + e.Id;

				return {
					dataSource: {
						type: "json",
						transport: {
							read: regapi
						},
						serverPaging: false,
						serverSorting: false,
						serverFiltering: false,
						pageSize: 5
					},
					sortable: true,
					pageable: true,
					columns: [{
						field: "name",
						title: "Listing",
						width: 300
					}, {
						field: "totalAmount",
						title: "Amount",
						format: "{0:c}",
						width: 150
					}, {
						field: "quantity",
						title: "Quantity",
						width: 125
					}, {
						field: "dateCreated",
						title: "Registration Date",
						type: "date",
						format: "{0:MM/dd/yyyy}",
						width: 200
					},{
						field: '',
						title: '',
						template: '<a href="\\\#viewreceipt/#=eventureOrderId#" class="btn btn-success btn-block">View Receipt</a>'
					}, {
						field: '',
						title: '',
						template: '<a href="\\\#registration/#=id#" class="btn btn-default btn-block">Edit</a>'
					}
					]
				};
			};
		}

		function Team() {
			var teamapi = config.remoteApiName + 'widget/GetTeamRegistrationsByHouseId/' + cart.houseId;

			$scope.teamGridOptions = {
				dataSource: {
					type: "json",
					transport: {
						read: teamapi
					},
					pageSize: 10,
					serverPaging: false,
					serverSorting: false
				},
				sortable: true,
				pageable: true,
				filterable: true,
				detailTemplate: kendo.template($("#teamtemplate").html()),
				columns: [{
					field: "name",
					title: "Team Name",
					width: "200px"
				},{
					field: "eventName",
					title: "Eventure",
					width: "200px"
				},{
					field: "listName",
					title: "Listing",
					width: "220px"
				},{
					field: "coachName",
					title: "Coach Name",
					width: "120px"
				}]
			};

			$scope.teamDetailGridOptions = function(e) {

				var teamdetailapi = config.remoteApiName + 'widget/GetTeamMembersByTeamId/' + e.Id;

				return {
					dataSource: {
						type: "json",
						transport: {
							read: teamdetailapi
						},
						serverPaging: false,
						serverSorting: false,
						serverFiltering: false,
						pageSize: 5
					},
					sortable: true,
					pageable: true,
					columns: [{
						field: "name",
						title: "Name"
					},{
						field: "email",
						title: "Email"
					}, {
						title: "",
						width: "120px",
						template:'<a class="btn btn-default btn-block" href="\\\#/editteam/#=id#"><em class="glyphicon glyphicon-edit"></em>&nbsp;Edit</a>'
					}]
				};
			};
		}

		function Coach() {
			var coachapi = config.remoteApiName + 'widget/GetTeamRegistrationsByCoachId/' + cart.houseId;

			$scope.coachGridOptions = {
				dataSource: {
					type: "json",
					transport: {
						read: coachapi
					},
					pageSize: 10,
					serverPaging: false,
					serverSorting: false
				},
				sortable: true,
				pageable: true,
				filterable: true,
				detailTemplate: kendo.template($("#coachtemplate").html()),
				columns: [{
					field: "name",
					title: "Team Name",
					width: "200px"
				}, {
					field: "eventName",
					title: "Eventure",
					width: "200px"
				}, {
					field: "listName",
					title: "Listing",
					width: "220px"
				}, {
					field: "amount",
					title: "Total Paid",
					//width: "120px",
					format: "{0:c}"
				}, {
					field: "balance",
					title: "Balance",
                    //width: "120px",
					format: "{0:c}"
				}, {
					title: "",
					width: "120px",
					template: '<a class="btn btn-default btn-block" href="\\\#/editteam/#=id#">Edit</a>'
				}]
			};

			$scope.coachDetailGridOptions = function(e) {

				var coachdetailapi = config.remoteApiName + 'widget/GetTeamMembersByTeamId/' + e.Id;

				$scope.remove = function() {
					alert('Removing: ' + e.Id );
					$scope.vm.coachgrid.refresh();
				};

				$scope.resend = function() {
					alert('Resending: ' + e.Id);
				};

				return {
					dataSource: {
						type: "json",
						transport: {
							read: coachdetailapi
						},
						serverPaging: false,
						serverSorting: false,
						serverFiltering: false,
						pageSize: 5
					},
					sortable: true,
					pageable: true,
					columns: [{
						field: "name",
						title: "Name"
					}, {
						field: "email",
						title: "Email"
					}, {
						field: "amount",
						title: "Paid",
						width: 100,
						format: "{0:c}"
					}, {
						field: '',
						title: '',
						template: '<button ng-click="resend()" class="btn btn-success btn-block">Resend Invitation</button>',
						width: 170
					}, {
						field: '',
						title: '',
						template: '<button ng-click="remove()" class="btn btn-danger btn-block">Remove</button>',
						width: 100
					}]
				};
			};
		}
	}

	angular.module("evReg").controller(controllerId, ["$scope", "$routeParams", "config", "datacontext", "common", "CartModel", Controller]);
})();
