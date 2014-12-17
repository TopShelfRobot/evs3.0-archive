(function () {

	var controllerId = 'MemberPaymentController';

	function Controller($scope, $routeParams, $q, $http, $location, datacontext, stripe, cartModel, common, config, common) {
		var controller = {};
		$scope.allowZeroPayment = cartModel.allowZeroPayment;
		$scope.waiverSigned = false;
		$scope.userPaying = $scope.suggested;
		$scope.teamMemberGuid = $routeParams.teamMemberGuid;
		$scope.teamGuid = $routeParams.teamGuid;
		$scope.participant = {};
		$scope.isSuggestPayVisible = false;
		$scope.isIndividualVisible = false;
		$scope.isSponsorPayVisible = false;
		$scope.tryoutFee = 150;

		$scope.participant = {
		    city: null,
		    dateBirth: null,
		    email: null,
		    firstName: null,
		    gender: null,
		    houseId: cartModel.houseId,
		    lastName: null,
		    ownerId: cartModel.ownerId,
		    phoneMobile: null,
		    state: null,
		    street1: null,
		    zip: null,
		};

		$scope.date = {
		    dateBirth: ''
		};

		function getTeamInfo() {
			return $q.all([datacontext.team.getTeamMemberPaymentInfoByTeamMemberGuid($scope.teamMemberGuid),
				datacontext.team.getNotPaidTeamMemberCountByTeamGuid($scope.teamGuid),
				datacontext.team.getTeamMemberPaymentSumByTeamGuid($scope.teamGuid),
			    datacontext.participant.createProfile()])
				.then(function (data) {
					if (data) {
						var payment = data[0];
						var count = data[1];
						var sum = data[2];
						$scope.participant = data[3];
						cartModel.teamMemberId = payment.teamMemberId;
						cartModel.teamId = payment.teamId;
						$scope.teamName = payment.name;
						$scope.listName = payment.listName;
						console.log("listingType: ", payment.eventureListTypeId);
						switch (payment.eventureListTypeId) {
							case 2:
								//team sponsor
								$scope.isSponsorPayVisible = true;
								//$scope.userPaying = payment.currentFee;
								break;
							case 3:
								//team suggest
								$scope.isSuggestPayVisible = true;
								$scope.remaining = payment.regAmount - sum;
								$scope.suggested = $scope.remaining / count;
								break;
							case 4:
								//team all pays the same
								$scope.isIndividualVisible = true;
								console.log("here: ", payment.eventureListTypeId);
								//$scope.suggested = payment.CurrentFee;
								$scope.userPaying = payment.currentFee;
								break;
							default:
						}
					} else {
						alert("Invalid Team Id! Please contact your team's coach.");
					}
				});
		}

		var promises = [
			getTeamInfo()
		];
		common.activateController(promises, controllerId);

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


		$scope.checkout = function () {

			alert($scope.participant.lastName);

			//var newPart = datacontext.participant.createParticipant($scope.participant.ownerId, $scope.participant.houseId, $scope.participant.email)
			//$scope.participant = datacontext.participant.createProfile($scope.participant.email);
			//newPart.lastName = $scope.participant.lastName;
			//newPart.firstName = $scope.participant.lastName;


			$scope.date.dateBirth = moment($scope.date.dateBirth).toISOString();
			$scope.participant.dateBirth = $scope.date.dateBirth;
			
			datacontext.save()

			alert('Thanks for registering');

			//if ($scope.isSponsorPayVisible == true) {
			//    alert('Thanks for joining');
			//    $location.path("/eventure/");
			//    return;
			//}
			//var cartOrder = cartModel.order($scope.tryoutFee, $scope.participant);   //mjb fix this hard coded

			//stripe.checkout(cartOrder.orderAmount)
			//    .then(function (res) {
			//        console.log(res);
			//        cartOrder.stripeToken = res.id;
			//        console.log(cartOrder);
			//        $http.post(config.apiPath + "/api/Payment/Post", cartOrder)
			//           .success(function (result) {
			//               $location.path("/receipt/" + result);
			//           })
			//            .error(function (err) {
			//                console.error("ERROR:", err.toString());
			//            })
			//            .finally(function () {
			//                $.unblockUI();
			//            });
			//    });
		};
		return controller;
	}
	
	angular.module("evReg").controller(controllerId,
		["$scope", "$routeParams", "$q", "$http", "$location", "datacontext", "StripeService", "MemberCartModel", "common", "config", "common", Controller]);
})();
