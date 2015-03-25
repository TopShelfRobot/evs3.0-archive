(function () {
	'use strict';
	var controllerId = 'SetRefundController';
	angular.module('app').controller(controllerId, ['$scope', '$routeParams', '$http', 'config', 'common', 'datacontext', SetRefundController]);

	function SetRefundController($scope, $routeParams, $http, config, common, datacontext) {
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		var vm = this;
		vm.orderId = $routeParams.orderId;
		vm.regId = $routeParams.regId;
		vm.registration = {};
		vm.order = {};

		vm.title = 'app';

		vm.ownerId = config.owner.ownerId;
		vm.owner = {};

		vm.success = false;
		vm.error = false;

		vm.source = {
			amount: vm.order.amount,
			eventureOrderId: $routeParams.orderId,
			refundType: 'order',
			registrationId: $routeParams.regId
		};

		activate();

		function activate() {
			var promises = [getRegistrationById(), getOrderById()];
			common.activateController(promises, controllerId)
				.then(function () {
					//log('Activated Set Owner View');
				});
		}

		function getRegistrationById() {
			return datacontext.registration.getRegistrationById(vm.regId)
				.then(function (reg) {
					//applyFilter();
					vm.registration = reg;
					return vm.registration;
				});
		}

		function getOrderById() {
			return datacontext.registration.getOrderById(vm.orderId)
				.then(function (order) {
					vm.source.amount = order.amount;
					vm.order = order;
					return vm.order;
				});
		}

		$scope.$watch('vm.source.description', function (newValue, oldValue) {
			switch (newValue) {
			case 'order':
				vm.source.amount = vm.order.amount;
				vm.source.refundType = 'order';
				break;
			case 'reg':
				vm.source.amount = vm.registration.totalAmount;
				vm.source.refundType = 'registration';
				break;
			case 'partial':
				vm.source.amount = 0;
				vm.source.refundType = 'partial';
				break;
			}
		});

		vm.refund = function () {
			vm.refundDisabled = true;
			console.log(vm.source);
			console.log(vm.source.amount);

			$http.post(config.apiPath + 'api/transaction/Refund', vm.source)
				//$http.post(config.apiPath + "api/mail/SendMassMessage", vm.source)
				.success(function (result) {
					console.log('Success', result);
					vm.success = true;
					vm.error = false;
					vm.status = result;
					//TODO Should change status to refunded.
					//This will let us lockdown multiple refunds on the same registration

					//$location.path('/partcenter/');
				})
				.error(function (result) {
					//alert('err');
					vm.success = false;
					vm.error = true;
					vm.status = 'There was an error processing this refund: ' + result;
				})
				.finally(function () {
					//alert('fin');
					vm.refundDisabled = false;
				});
		};
	}
})();
