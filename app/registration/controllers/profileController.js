
;(function(){

	function Controller($scope, config, datacontext){

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

		var teamapi = config.remoteApiName + 'Participants/GetParticipantsByHouseId/' + config.owner.houseId;

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
					field: "FirstName",
					title: "Team Name",
					width: "200px"
				},{
					field: "LastName",
					title: "Eventure",
					width: "200px"
				},{
					field: "Email",
					title: "Listing",
					width: "220px"
				},{
					field: "Email",
					title: "Captain Name",
					width: "120px"
			}]
		};

		$scope.teamDetailGridOptions = function(e) {

			var teamdetailapi = config.remoteApiName + 'Registrations/GetRegistrationsByPartId/' + e.Id;

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
						field: "FirstName",
						title: "First Name"
					}, {
						field: "LastName",
						title: "Last Name"
					}
				]
			};
		}

		var captainapi = config.remoteApiName + 'Participants/GetParticipantsByHouseId/' + config.owner.houseId;

		$scope.captainGridOptions = {
			dataSource: {
				type: "json",
				transport: {
					read: captainapi
				},
				pageSize: 10,
				serverPaging: false,
				serverSorting: false
			},
			sortable: true,
			pageable: true,
			filterable: true,
			detailTemplate: kendo.template($("#captaintemplate").html()),
			columns: [{
					field: "FirstName",
					title: "Team Name",
					width: "200px"
				},{
					field: "LastName",
					title: "Eventure",
					width: "200px"
				},{
					field: "Email",
					title: "Listing",
					width: "220px"
				},{
					field: "Email",
					title: "Captain Name",
					width: "220px"
				},{
					title: "",
					width: "120px",
					template:'<a class="btn btn-default btn-block" href="\\\#profile/#=Id#">Edit</a>'
				}]
		};

		$scope.captainDetailGridOptions = function(e) {

			var captaindetailapi = config.remoteApiName + 'Registrations/GetRegistrationsByPartId/' + e.Id;

			return {
				dataSource: {
					type: "json",
					transport: {
						read: captaindetailapi
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
						title: "First Name",
						width: 200
					}, {
						field: "TotalAmount",
						title: "Last Name",
						format: "{0:c}",
						width: 200
					}, {
						field: "Quantity",
						title: "Email",
						width: 250
					}, {
						field: "Quantity",
						title: "Paid",
						width: 75
					},{
						field: '',
						title: '',
						template: '<a href="\\\#viewreceipt/#=EventureOrderId#" class="btn btn-success btn-block">Resend Invitation</a>',
					},{
						field: '',
						title: '',
						template: '<a href="\\\#viewreceipt/#=EventureOrderId#" class="btn btn-success btn-block">Remove</a>'
					}, {
						field: '',
						title: '',
						template: '<a href="\\\#registrationedit/#=Id#/#=StockAnswerSetId#" class="btn btn-default btn-block">Edit</a>'
					}]
			};
		}
	}

	angular.module("evReg").controller("UserProfile", ["$scope", "config", "datacontext", Controller]);
})();
