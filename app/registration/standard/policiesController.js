;
(function () {

	var controllerId = 'policiesController';

	function Controller($scope, cartModel, common) {

		$scope.regSettings = cartModel.regSettings;

		var promises = [];

		common.activateController(promises, controllerId);
	}

	angular.module('evReg').controller(controllerId, ['$scope', 'CartModel', 'common', Controller]);
})();