(function(){

    function controller($scope, cartModel){

        $scope.cart = cartModel;
		
		$scope.checkout = function(){
			console.log("checkout");
		}
				
		$scope.removeItem = function(item){
			console.log("removing item:", item);
			cartModel.removeRegistration(item);
		};
    }

    angular.module("evReg").controller("Header", ["$scope", "CartModel", controller]);

})();
