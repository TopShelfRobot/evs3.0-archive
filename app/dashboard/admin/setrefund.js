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

		vm.source = {
			amount: vm.order.amount,
			eventureOrderId: $routeParams.orderId,
			description: 'order',
			dateCreated: new Date(),
			registrationId: $routeParams.regId
		}


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
					return vm.registration = reg;
				});
		}

		function getOrderById() {
			return datacontext.registration.getOrderById(vm.orderId)
				.then(function (order) {
					vm.source.amount = order.amount;
					return vm.order = order;
				});
		}

	  $scope.$watch('vm.source.description', function(newValue, oldValue) {
			switch (newValue) {
				case 'order':
					vm.source.amount = vm.order.amount;
					break;
				case 'reg':
					vm.source.amount = vm.registration.totalAmount;
					break;
				case 'partial':
					vm.source.amount = 0;
					break;
			}
		});

		vm.refund = function () {
			vm.refundDisabled = true;
			console.log(vm.source);
			console.log(vm.source.amount);

			$http.post(config.apiPath + 'api/transaction/refund', vm.source)
				.success(function (result) {
					console.log('Success', result);
					vm.refundErrors = '';
					//$location.path('/partcenter/');
				})
				.error(function (data, status, headers, config) {
					//alert('err');
					vm.refundErrors = "There was an error processing this refund(E1)";
				})
				.finally(function () {
					//alert('fin');
					vm.refundDisabled = false;
				});

		};

	}
})();
