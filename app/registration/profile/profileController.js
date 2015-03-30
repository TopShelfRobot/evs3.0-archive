(function () {

	var controllerId = "UserProfile";

	function Controller($scope, $routeParams, $location, $http, config, datacontext, common, cart, stripe) {

		$scope.participant = {};

		$scope.disableEmail = true;

		$scope.participantId = $routeParams.participantId || cart.participantId;

		$scope.partButton = cart.regSettings.partButtonText;

		$scope.ownerId = config.owner.ownerId;

		$scope.social = {
			twitter: true,
			facebook: true,
			google: true
		};

		$scope.ambassador = {
			isActive: true
		};

		$scope.positions = [
			{
				name: 'Driver Only'
   },
			{
				name: 'Runner'
   }
  ];

		$scope.sizes = [
			{
				size: 'XS'
   },
			{
				size: 'S'
   },
			{
				size: 'M'
   },
			{
				size: 'L'
   },
			{
				size: 'XL'
   },
			{
				size: 'XXL'
   }
  ];

		$scope.genders = [
			{
				value: 'M',
				name: 'Male'
   },
			{
				value: 'F',
				name: 'Female'
   }
  ];

		var promises = [getParticipant(), Registrations(), Participants(), Team(), Coach()];

		common.activateController(promises, controllerId)
			.then(function () {});

		function getParticipant() {
			return datacontext.participant.getParticipantById($scope.participantId)
				.then(function (participant) {
					$scope.participant = participant;
					$scope.date.dateBirth = moment($scope.participant.dateBirth).format('YYYY-MM-DD');
				});
		}

		function Registrations() {

			$scope.resendReceipt = function (e) {
				console.log('Order Id: ' + e);
				$http.post(config.apiPath + "api/mail/SendConfirmMail", e) //mjb
					.success(function (result) {
						alert('Receipt Sent');
					})
					.error(function (err) {
						alert('Resend failed');
					})
					.finally(function () {
						//Do NOthing
					});
			};

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
						title: "Listing"
    },
//                  {
  //            field: "totalAmount",
  //            title: "Amount",
  //            format: "{0:c}",
  //            width: 110
  //    },
					{
						field: "quantity",
						title: "Qty",
						width: 77
    }, {
						field: "dateCreated",
						title: "Registration Date",
						type: "date",
						format: "{0:MM/dd/yyyy}",
						width: 188
    }, {
						field: '',
						title: '',
						template: '<a href="\\\#orderreceipt/#=eventureOrderId#" class="btn btn-success btn-block"><em class="glyphicon glyphicon-tags"></em>&nbsp;Receipt</a>',
						width: 150
    }, {
						field: '',
						title: '',
						template: '<button ng-click="resendReceipt(#=eventureOrderId#)" class="btn btn-success btn-block">Resend Receipt</button>',
    }
    //	, {
    //	field: '',
    //	title: '',
    //	template: '<a href="\\\#registration/#=id#" class="btn btn-default btn-block"><em class="glyphicon glyphicon-edit"></em>&nbsp;Edit</a>'
    //}
    ]
			};
		}

		$scope.date = {
			dateBirth: '1993-07-03'
		};

		$scope.save = function () {
			$scope.date.dateBirth = moment($scope.date.dateBirth).toISOString();
			$scope.participant.dateBirth = $scope.date.dateBirth;
			datacontext.save()
				.then(function () {
					console.log("saved");
				});
		};

		$scope.return = function () {
			$location.path(cart.navUrl);
		};

		$scope.stateProvince = [
			{
				name: 'AK'
      },
			{
				name: 'AL'
      },
			{
				name: 'AR'
      },
			{
				name: 'AZ'
      },
			{
				name: 'CA'
      },
			{
				name: 'CO'
      },
			{
				name: 'CT'
      },
			{
				name: 'DC'
      },
			{
				name: 'DE'
      },
			{
				name: 'FL'
      },
			{
				name: 'GA'
      },
			{
				name: 'HI'
      },
			{
				name: 'IA'
      },
			{
				name: 'ID'
      },
			{
				name: 'IL'
      },
			{
				name: 'IN'
      },
			{
				name: 'KS'
      },
			{
				name: 'KY'
      },
			{
				name: 'LA'
      },
			{
				name: 'MA'
      },
			{
				name: 'MD'
      },
			{
				name: 'ME'
      },
			{
				name: 'MI'
      },
			{
				name: 'MN'
      },
			{
				name: 'MO'
      },
			{
				name: 'MS'
      },
			{
				name: 'MT'
      },
			{
				name: 'NC'
      },
			{
				name: 'ND'
      },
			{
				name: 'NE'
      },
			{
				name: 'NH'
      },
			{
				name: 'NJ'
      },
			{
				name: 'NM'
      },
			{
				name: 'NV'
      },
			{
				name: 'NY'
      },
			{
				name: 'OH'
      },
			{
				name: 'OK'
      },
			{
				name: 'OR'
      },
			{
				name: 'PA'
      },
			{
				name: 'RI'
      },
			{
				name: 'SC'
      },
			{
				name: 'SD'
      },
			{
				name: 'TN'
      },
			{
				name: 'TX'
      },
			{
				name: 'UT'
      },
			{
				name: 'VA'
      },
			{
				name: 'VT'
      },
			{
				name: 'WA'
      },
			{
				name: 'WI'
      },
			{
				name: 'WV'
      },
			{
				name: 'WY'
      },
			{
				name: 'AS'
      },
			{
				name: 'GU'
      },
			{
				name: 'MP'
      },
			{
				name: 'PR'
      },
			{
				name: 'VI'
      },
			{
				name: 'CZ'
      },
			{
				name: 'AB'
      },
			{
				name: 'BC'
      },
			{
				name: 'MB'
      },
			{
				name: 'NB'
      },
			{
				name: 'NL'
      },
			{
				name: 'NT'
      },
			{
				name: 'NS'
      },
			{
				name: 'NU'
      },
			{
				name: 'ON'
      },
			{
				name: 'PE'
      },
			{
				name: 'QC'
      },
			{
				name: 'SK'
      },
			{
				name: 'YT'
      }
  ];

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
			var partapi = config.remoteApiName + 'widget/GetParticipantsByHouseId/' + $scope.participantId;

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
    }, {
					field: "lastName",
					title: "Last Name",
					width: "200px"
    }, {
					field: "email",
					title: "Email Address",
					width: "220px"
    }, {
					title: "",
					width: "120px",
					template: '<a class="btn btn-default btn-block" href="\\\#participant/#=id#"><em class="glyphicon glyphicon-edit"></em>&nbsp;Edit</a>'
    }]
			};

			$scope.partDetailGridOptions = function (e) {

				var regapi = config.remoteApiName + 'widget/GetRegistrationsByPartId/' + e.id;

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
							field: "displayName",
							title: "Listing",
							width: 300
     }, {
							field: "totalAmount",
							title: "Amount",
							format: "{0:c}",
							width: 100
     }, {
							field: "quantity",
							title: "Qty",
							width: 67
     }, {
							field: "dateCreated",
							title: "Registration Date",
							type: "date",
							format: "{0:MM/dd/yyyy}",
							width: 170
     }, {
							field: '',
							title: '',
							template: '<a href="\\\#viewreceipt/#=eventureOrderId#" class="btn btn-success btn-block"><em class="glyphicon glyphicon-tags"></em>&nbsp;Receipt</a>',
							width: 110
     }, {
							field: '',
							title: '',
							template: '<a href="\\\#registration/#=id#" class="btn btn-default btn-block"><em class="glyphicon glyphicon-edit"></em>&nbsp;Edit</a>'
     }
     ]
				};
			};
		}

		function Team() {
			var teamapi = config.remoteApiName + 'widget/GetTeamRegistrationsByHouseId/' + $scope.participantId;

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
    }, {
					field: "eventName",
					title: "Eventure",
					width: "200px"
    }, {
					field: "listName",
					title: "Listing",
					width: "220px"
    }, {
					field: "coachName",
					title: "Coach",
					width: "120px"
    }]
			};

			$scope.teamDetailGridOptions = function (e) {

				var teamdetailapi = config.remoteApiName + 'widget/GetTeamMembersByTeamId/' + e.id;

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
     }, {
						field: "email",
						title: "Email"
     }]
				};
			};
		}

		function Coach() {

			$scope.remove = function (memberId, teamId) {
				alert('Removing: teamMemberId ' + memberId + ' from teamId: ' + teamId);
				//TODO make it remove the participant from the team
				$scope.coachGridOptions.dataSource.read();
			};

			//	$scope.resend = function (participantId) {
			//		alert('Resending: ' + participantId);
			//	};

			$scope.checkout = function (balance, id) {

				var order = {
					amount: balance,
					teamId: id,
					participantId: $scope.participantId,
					stripeToken: '',
					ownerId: $scope.ownerId
				}

				stripe.checkout(balance)
					.then(function (res) {
						console.log(res);
						$.blockUI({
							message: 'Processing order...'
						});
						order.stripeToken = res.id;
						$http.post(config.apiPath + "api/payment/PostTeamBalance", order)
							.success(function (result) {
								console.log("result: " + result);
								$location.path("/team-receipt/" + result);
							})
							.error(function (err) {
								console.error("ERROR:", err.toString());
							})
							.finally(function () {
								$.unblockUI();
							});
					});
			};

			var coachapi = config.remoteApiName + 'widget/GetTeamRegistrationsByCoachId/' + $scope.participantId;

			$scope.coachGridOptions = {
				dataSource: new kendo.data.DataSource({
					type: "json",
					transport: {
						read: coachapi
					},
					pageSize: 10,
					serverPaging: false,
					serverSorting: false
				}),
				sortable: true,
				pageable: true,
				filterable: true,
				dataBound: function () {
					this.expandRow(this.tbody.find("tr.k-master-row").first());
				},
				detailTemplate: kendo.template($("#coachtemplate").html()),
				columns: [{
					field: "name",
					title: "Team Name",
					width: 200
    }, {
					field: "division",
					title: "Division",
					width: 150
    }, {
					field: "timeFinish",
					title: "Est. Time",
					width: 120
    }, {
					field: "balance",
					title: "Balance",
					format: "{0:c}",
					width: 100
    }, {
					title: "",
					width: 120,
					template: '<a class="btn btn-default btn-block" href="\\\#/editteam/#=id#"><em class="glyphicon glyphicon-edit"></em>&nbsp;Edit</a>'
    }, {
					title: "",
					width: 140,
					template: '<button class="btn btn-info btn-block" ng-click="checkout(#=balance#, #=id#)">Pay Balance</button>'
    }]
			};

			$scope.coachDetailGridOptions = function (e) {

				var coachdetailapi = config.remoteApiName + 'widget/GetTeamMembersByTeamId/' + e.id;
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
						field: "teamName",
						title: "Team Name",
						width: 200
     }, {
						field: "name",
						title: "Name",
						width: 200
     }, {
						field: "position",
						title: "Role",
						width: 130
		 }, {
						field: "phoneMobile",
						title: "Phone",
						width: 140
     }, {
						field: "email",
						title: "Email",
						width: 210
     }, {
						field: "emergencyContact",
						title: "Emergency Contact",
						width: 180
     }, {
						field: "emergencyPhone",
						title: "Emergency Phone",
						width: 140
     }, {
						title: "Status",
						width: 120,
						template: kendo.template($("#teamMemberTemplate").html())
		}, {
						title: "",
						width: 110,
						template: '<button class="btn btn-danger btn-block" ng-click="remove(#=id#, #=teamId#)">Remove</button>'
		}]
				};
			};
		}

	}

	angular.module("evReg").controller(controllerId, ["$scope", "$routeParams", "$location", "$http", "config", "datacontext", "common", "CartModel", "StripeService", Controller]);
})();
