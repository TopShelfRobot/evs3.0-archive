(function () {
	'use strict';
	var controllerId = 'SetRefundController';
	angular.module('app').controller(controllerId, ['$routeParams','config', 'common', 'datacontext', SetRefundController]);

	function SetRefundController ($routeParams, config, common, datacontext) {
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		var vm = this;
		vm.refundType = 'owner';
    vm.regId = $routeParams.regId;
    vm.registration = {};
    vm.order = {};

		vm.title = 'app';

		vm.ownerId = config.owner.ownerId;
		vm.owner = {};


		activate();

		function activate () {
			var promises = [getRegistrationById(), getOrderByRegistrationId()];
			common.activateController(promises, controllerId)
				.then(function () {
					//log('Activated Set Owner View');
				});
		}

		function getRegistrationById () {
			return datacontext.registration.getRegistrationById (vm.regId)
				.then(function (reg) {
					//applyFilter();
					vm.registration = reg;
					return vm.registration;
				});
		}

    function getOrderByRegistrationId () {
      return datacontext.registration.getOrderByRegistrationId (vm.regId)
      .then(function (order) {
		  vm.order = order;
			return vm.order;
      });
    }

	}
})();
