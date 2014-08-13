(function(){

    function controller($scope, $location, $anchorScroll, config, datacontext, cartModel) {
        
		$scope.cart = cartModel;
		
        var all = [];
        var viewLength = 10;
        var currentPage = 0;
        //alert('heryhr');
        //datacontext.getEventuresByOwnerId(config.owner.ownerId)
        datacontext.getEventuresByOwnerId(config.owner.ownerId)
	        .then(function(list){
	            all = list;
	            $scope.eventures = all.slice(0, viewLength);
	        });

        $scope.nextPage = function() {
            if (all.length >= (currentPage + 1) * viewLength) {
                currentPage++;
                $scope.eventures = all.slice(currentPage * viewLength, (currentPage + 1) * viewLength);
                $location.hash("top");
                $anchorScroll();
                $location.hash("");
            }
        };

        $scope.prevPage = function() {
            if (currentPage != 0) {
                currentPage--;
                $scope.eventures = all.slice(currentPage * viewLength, (currentPage + 1) * viewLength);
                $location.hash("top");
                $anchorScroll();
                $location.hash("");
            }
        };
    }

    angular.module("evReg").controller("EventureController", ["$scope", "$location", "$anchorScroll", "config", "datacontext", "CartModel", controller]);

})();
