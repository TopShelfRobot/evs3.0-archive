(function () {

	var controllerId = "EventureController";

	function controller($scope, $location, $anchorScroll, config, datacontext, cart, common) {

		//$scope.cart = cartModel;

		var all = [];
		var viewLength = 12;
		var currentPage = 0;
		//alert('heryhr');
	    //datacontext.getEventuresByOwnerId(config.owner.ownerId)

		$scope.isPaginationVisible = false;

		$scope.eventureName = cart.regSettings.eventureName;

		//console.log(cart.ownerId);
		//console.log(cart.regSettings.eventureName);

		var promises = [];
		promises.push(
			datacontext.eventure.getEventuresByOwnerId(cart.ownerId)
				.then(function (list) {
					all = list;
					$scope.eventures = all.slice(0, viewLength);
				})
		);

		if(all.length > viewLength) {
			$scope.isPaginationVisible = true;
		}

		common.activateController(promises, controllerId);

		$scope.NavigateToList = function (listId) {
		    //#/eventure/{{eventure.id}}/list
		    //alert(listId);
		    listpath = '/eventure/' + listId + '/list';
		    cart.navUrl = listpath;
		    $location.path(listpath);
		};

		$scope.nextPage = function () {
			if (all.length >= (currentPage + 1) * viewLength) {
				currentPage++;
				$scope.eventures = all.slice(currentPage * viewLength, (currentPage + 1) * viewLength);
				$location.hash("top");
				$anchorScroll();
				$location.hash("");
			}
		};

		$scope.prevPage = function () {
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
