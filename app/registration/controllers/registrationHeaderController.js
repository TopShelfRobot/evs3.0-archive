(function(){

    function controller($scope, cartModel){

        $scope.cart = cartModel;
		$scope.cart.butts = "heads";
		$scope.cart.test = function(){
			console.log("butts");
			
			return "butt heads";
		}
		
		$scope.test = function(){
			return "ass hole";
		}
		
		$scope.checkout = function(){
			console.log("checkout");
		}
				
		$scope.cart.removeItem = function(item){
			return function(){
				console.log("removing item:", item);
				cartModel.removeRegistration(item);
			}
		};

    }

    angular.module("evReg").controller("Header", ["$scope", "CartModel", controller]);

})();
