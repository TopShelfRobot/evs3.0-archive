
;(function(){
	
	var controllerId = "AddUserProfile";

	function Controller($scope, $location, config, datacontext, cart, common){

		$scope.participant = {};

		$scope.title = 'Create Your Participant Profile';

		$scope.date = {
			dateBirth: ''
		};

		$scope.positions = [
			{
				name: 'Driver'
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

	}

	angular.module("evReg").controller(controllerId, ["$scope", "$location", "config", "datacontext", "CartModel", "common", Controller]);
})();
