(function(){
	
	var controllerId = "Header";

    function controller($scope, $location, cartModel, common){

        $scope.cart = cartModel;
		
		$scope.checkout = function(){
			$location.path("/confirm");
			$scope.hidePopover();
		};
				
		$scope.removeItem = function(item){
			cartModel.removeRegistration(item);
		};
    }

    angular.module("evReg").controller(controllerId, ["$scope", "$location", "CartModel", "common", controller]);

})();
