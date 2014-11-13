(function(){
	
	var controllerId = "EventureController";

    function controller($scope, $location, $anchorScroll, config, datacontext, cartModel, common) {
        
		$scope.cart = cartModel;
		
        var all = [];
        var viewLength = 12;
        var currentPage = 0;
        //alert('heryhr');
        //datacontext.getEventuresByOwnerId(config.owner.ownerId)
		
		var promises = [];
		promises.push(
	        datacontext.eventure.getEventuresByOwnerId(config.owner.ownerId)
		        .then(function(list){
		            all = list;
		            $scope.eventures = all.slice(0, viewLength);
		        })
		);
		
		common.activateController(promises, controllerId);

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

    angular.module("evReg").controller(controllerId, ["$scope", "$location", "$anchorScroll", "config", "datacontext", "CartModel", "common", controller]);

})();
