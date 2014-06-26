(function(){

    function controller($scope, $location, cartModel){

        $scope.cart = cartModel;
		
		$scope.checkout = function(){
			$location.path("/confirm");
		}
				
		$scope.removeItem = function(item){
			cartModel.removeRegistration(item);
		};
    }

    angular.module("evReg").controller("Header", ["$scope", "$location", "CartModel", controller]);

})();
