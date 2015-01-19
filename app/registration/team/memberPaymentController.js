(function () {

	var controllerId = 'MemberPaymentController';

	function Controller($scope, $routeParams, $q, $http, $location, $modal,
		datacontext, stripe, cartModel, cartRegSettings, authService, config, common ) {

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
		// $scope.tryoutFee = 150; whg not sure what this is.

		$scope.regSettings = cartRegSettings.regSettings;
		console.log($scope.regSettings);

		$scope.participant = {
			city: null,
			dateBirth: null,
			email: authService.authentication.userName,
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

		$scope.positions = [
			{
				name: 'Driver Only'
			},
			{
				name: 'Runner'
			},
			{
				name: 'Captain'
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

		$scope.stateProvince =[
			{name: 'AK'},
			{name: 'AL'},
			{name: 'AR'},
			{name: 'AZ'},
			{name: 'CA'},
			{name: 'CO'},
			{name: 'CT'},
			{name: 'DC'},
			{name: 'DE'},
			{name: 'FL'},
			{name: 'GA'},
			{name: 'HI'},
			{name: 'IA'},
			{name: 'ID'},
			{name: 'IL'},
			{name: 'IN'},
			{name: 'KS'},
			{name: 'KY'},
			{name: 'LA'},
			{name: 'MA'},
			{name: 'MD'},
			{name: 'ME'},
			{name: 'MI'},
			{name: 'MN'},
			{name: 'MO'},
			{name: 'MS'},
			{name: 'MT'},
			{name: 'NC'},
			{name: 'ND'},
			{name: 'NE'},
			{name: 'NH'},
			{name: 'NJ'},
			{name: 'NM'},
			{name: 'NV'},
			{name: 'NY'},
			{name: 'OH'},
			{name: 'OK'},
			{name: 'OR'},
			{name: 'PA'},
			{name: 'RI'},
			{name: 'SC'},
			{name: 'SD'},
			{name: 'TN'},
			{name: 'TX'},
			{name: 'UT'},
			{name: 'VA'},
			{name: 'VT'},
			{name: 'WA'},
			{name: 'WI'},
			{name: 'WV'},
			{name: 'WY'},
			{name: 'AS'},
			{name: 'GU'},
			{name: 'MP'},
			{name: 'PR'},
			{name: 'VI'},
			{name: 'CZ'},
			{name: 'AB'},
			{name: 'BC'},
			{name: 'MB'},
			{name: 'NB'},
			{name: 'NL'},
			{name: 'NT'},
			{name: 'NS'},
			{name: 'NU'},
			{name: 'ON'},
			{name: 'PE'},
			{name: 'QC'},
			{name: 'SK'},
			{name: 'YT'}
		];

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
						console.log('listingType: ', payment.eventureListType);
						switch (payment.eventureListType) {
							case "TeamSponsored": //team sponsor
							$scope.isSponsorPayVisible = true;
							$scope.userPaying = item.currentFee;
							break;
							case "TeamSuggest": //team suggest
							$scope.isSuggestPayVisible = true;
							$scope.remaining = payment.regAmount - sum;
							$scope.suggested = $scope.remaining / count
							break;
							case "TeamIndividual": //team all pays the same
							$scope.isIndividualVisible = true;
							$scope.userPaying = payment.currentFee;
							break;
							case "Lottery": //Captain pays all or nothing at registration
							$scope.isLotteryVisible = true;
							$scope.userPaying = 0;
							break;
							default:
						}
					} else {
						alert('Invalid Team Id! Please contact your team\'s coach.');
					}
				});
		}

		var promises = [
			getTeamInfo()
		];
		common.activateController(promises, controllerId);

		$scope.open = function ($event, open) {
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

		$scope.open = function () {
			var modalInstance = $modal.open({
				templateUrl: 'termsAndConditions.html',
				size: 'lg',
				backdrop: 'static',
				controller: 'TermsModalInstance'
			});

			modalInstance.result.then(function () { $scope.checkout(); });

		};

		$scope.checkout = function () {

			cartOrder.orderAmount = 0;
			alert('User elected to not pay: ' + cartOrder.orderAmount);
			$.blockUI({
				message: 'Processing order...'
			});
			// cartOrder.stripeToken = res.id;
			$http.post(config.apiPath + "api/payment/PostTeam", cartOrder)
			.success(function (result) {
				console.log("result: " + result);
				$location.path("/receipt/" + result);
			})
			.error(function (err) {
				console.error("ERROR:", err.toString());
			})
			.finally(function () {
				$.unblockUI();
			});

			//alert('Thanks for registering');

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
			//        $http.post(config.apiPath + "/api/Payment/PostTeamPayment", cartOrder)
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

	angular.module('evReg').controller(controllerId,
		['$scope', '$routeParams', '$q', '$http', '$location', '$modal',
		'datacontext', 'StripeService', 'MemberCartModel', 'CartModel', 'authService',
		'config', 'common', Controller]);
})();
