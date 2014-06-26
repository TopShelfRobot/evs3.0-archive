(function(){

    function controller($scope, $location, cartModel){

        $scope.cart = cartModel;
		
		$scope.checkout = function(){
			console.log("checkout");
			// cartModel.checkout();
			$location.path("/payment/");
			
		}
				
		$scope.removeItem = function(item){
			console.log("removing item:", item);
			cartModel.removeRegistration(item);
		};
    }

    angular.module("evReg").controller("Header", ["$scope", "$location", "CartModel", controller]);

})();
