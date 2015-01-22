(function () {
	'use strict';
	var controllerId = 'footerController';

	function controller($scope, cart, common) {

		$scope.cart = cart;

    common.activateController(controllerId);

	}
	angular.module('evReg').controller(controllerId, ['$scope', 'CartModel', 'common', controller]);
})();
