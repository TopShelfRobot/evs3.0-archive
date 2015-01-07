
;(function(){
	
	var controllerId = "AddUserProfile";

	function Controller($scope, $location, config, datacontext, cart, authService, common){

		$scope.participant = {};

		$scope.participant.email = authService.authentication.userName;

		$scope.title = 'Create Your Participant Profile';

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

		$scope.submit = function(){
			
			var newPart = datacontext.participant.createProfile($scope.participant.email);

			for(key in $scope.participant){
				newPart[key] = $scope.participant[key];
			}
			$scope.date.dateBirth = moment($scope.date.dateBirth).toISOString();
			newPart.dateBirth = $scope.date.dateBirth;
			datacontext.save()
				.then(function(){
					console.log("saved:", newPart);
					newPart.houseId = newPart.id;
					return datacontext.save();	
				})
				.then(function(){
					cart.houseId = newPart.houseId;
					//config.owner.newId = true;  //whg no idea what bill was doing here. also on man reg. 44 : 19, 44 : 17
					//$location.path('/eventure');
					$location.path(cart.navUrl);
				});
		};

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

	}

	angular.module("evReg").controller(controllerId, ["$scope", "$location", "config", "datacontext", "CartModel", "authService", "common", Controller]);
})();
