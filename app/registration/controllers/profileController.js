
;(function(){

	function Controller($scope, config, datacontext){

		$scope.participant = {};

		datacontext.participant.getParticipantById(config.owner.houseId)
			.then(function(participant){
				$scope.participant = participant;

			});

		$scope.save = function(){
			datacontext.saveChanges()
				.then(function(){
					console.log("saved");
				});
		};

		$scope.today = function () {
			$scope.participant.dateBirth = new Date();
			console.log('participant: ' + $scope.participant.id);
		};

		$scope.today();

		$scope.open = function($event, open) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope[open] = true;
		};

		$scope.dateOptions = {
			'year-format': "'yy'",
			'starting-day': 1
		};

		$scope.formats = ['MM-dd-yyyy', 'yyyy/MM/dd', 'shortDate'];

		$scope.format = $scope.formats[0];

		var regapi = config.remoteApiName + 'Registrations/GetRegistrationsByPartId/' + $scope.participant.id;

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
					field: "Name",
					title: "Listing",
					width: 300
				}, {
					field: "TotalAmount",
					title: "Amount",
					format: "{0:c}",
					width: 150
				}, {
					field: "Quantity",
					title: "Quantity",
					width: 125
				}, {
					field: "DateCreated",
					title: "Registration Date",
					type: "date",
					format: "{0:MM/dd/yyyy}",
					width: 200
				},{
					field: '',
					title: '',
					template: '<a href="\\\#viewreceipt/#=EventureOrderId#" class="btn btn-success btn-block">View Receipt</a>'
				}, {
					field: '',
					title: '',
					template: '<a href="\\\#registrationedit/#=Id#/#=StockAnswerSetId#" class="btn btn-default btn-block">Edit</a>'
				}]
		};

		var partapi = config.remoteApiName + 'Participants/GetParticipantsByHouseId/' + config.owner.houseId;

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
					field: "FirstName",
					title: "First Name",
					width: "200px"
				},{
					field: "LastName",
					title: "Last Name",
					width: "200px"
				},{
					field: "Email",
					title: "Email Address",
					width: "220px"
				},{
					title: "",
					width: "120px",
					template:'<a class="btn btn-default btn-block" href="\\\#participant/#=Id#">Edit</a>'
			}]
		};

		$scope.partDetailGridOptions = function(e) {

			var regapi = config.remoteApiName + 'Registrations/GetRegistrationsByPartId/' + e.Id;

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
						field: "Name",
						title: "Listing",
						width: 300
					}, {
						field: "TotalAmount",
						title: "Amount",
						format: "{0:c}",
						width: 150
					}, {
						field: "Quantity",
						title: "Quantity",
						width: 125
					}, {
						field: "DateCreated",
						title: "Registration Date",
						type: "date",
						format: "{0:MM/dd/yyyy}",
						width: 200
					},{
						field: '',
						title: '',
						template: '<a href="\\\#viewreceipt/#=EventureOrderId#" class="btn btn-success btn-block">View Receipt</a>'
					}, {
						field: '',
						title: '',
						template: '<a href="\\\#registrationedit/#=Id#/#=StockAnswerSetId#" class="btn btn-default btn-block">Edit</a>'
					}
				]
			};
		}

		var teamapi = config.remoteApiName + 'Teams/GetTeamRegistrationsByHouseId/' + config.owner.houseId;

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
					field: "Name",
					title: "Team Name",
					width: "200px"
				},{
					field: "EventName",
					title: "Eventure",
					width: "200px"
				},{
					field: "ListName",
					title: "Listing",
					width: "220px"
				},{
					field: "CoachName",
					title: "Coach Name",
					width: "120px"
			}]
		};

		$scope.teamDetailGridOptions = function(e) {

			var teamdetailapi = config.remoteApiName + 'Teams/GetTeamMembersByTeamId/' + e.Id;

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
						field: "Name",
						title: "Name"
					},{
						field: "Email",
						title: "Email"
					}
				]
			};
		}

		var coachapi = config.remoteApiName + 'Teams/GetTeamRegistrationsByCoachId/' + config.owner.houseId;

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
					field: "Name",
					title: "Team Name",
					width: "200px"
				},{
					field: "EventName",
					title: "Eventure",
					width: "200px"
				},{
					field: "ListName",
					title: "Listing",
					width: "220px"
				},{
					field: "CoachName",
					title: "Coach Name",
					width: "220px"
				},{
					title: "",
					width: "120px",
					template:'<a class="btn btn-default btn-block" href="\\\editteam/#=Id#">Edit</a>'
				}]
		};

		$scope.coachDetailGridOptions = function(e) {

			var coachdetailapi = config.remoteApiName + 'Teams/GetTeamMembersByTeamId/' + e.Id;

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
						field: "Name",
						title: "Name"
					}, {
						field: "Email",
						title: "Email"
					}, {
						field: "Amount",
						title: "Paid",
						width: 100
					},{
						field: '',
						title: '',
						template: '<button ng-click="resend()" class="btn btn-success btn-block">Resend Invitation</button>',
						width: 170
					},{
						field: '',
						title: '',
						template: '<button ng-click="remove()" class="btn btn-danger btn-block">Remove</button>',
						width: 100
					}]
			};
		};


	}

	angular.module("evReg").controller("UserProfile", ["$scope", "config", "datacontext", Controller]);
})();
