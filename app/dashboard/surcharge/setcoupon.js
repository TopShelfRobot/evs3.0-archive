(function() {
	'use strict';

	var controllerId = 'setcoupon';
	angular.module('app').controller(controllerId, ['$routeParams','$location', '$scope', 'common', 'datacontext', setcoupon]);

	function setcoupon($routeParams, $location, $scope, common, datacontext) {

		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		var vm = this;
		vm.title = 'Eventure';
		vm.couponId = $routeParams.couponId || 0;

		vm.ownerId = 1;

		vm.coupon = {};
		vm.eventures = [];
		vm.listings = [];

		activate();

		function activate() {
			onDestroy();
			common.activateController(getCoupon(), getEventures(), getEventureLists(), getAmountTypes(), controllerId)
				.then(function() {
				    //log('Activated set coupon');
				});
		}

		function getAmountTypes() {
			return datacontext.participant.getAmountTypes()
				.then(function(data) {
					vm.amountTypes = data;
					return vm.amountTypes;
				});
		}

		function getCoupon() {

			if (vm.couponId > 0) {
				return datacontext.surcharge.getCouponById(vm.couponId)
					.then(function(data) {
						//applyFilter();
						vm.coupon = data;
						return vm.coupon;
					});
			} else {
				vm.coupon = datacontext.surcharge.createCoupon();
				return vm.coupon;
			}
		}

		function onDestroy() {
			$scope.$on('$destroy', function () {
			    //autoStoreWip(true);
				datacontext.cancel();
			});
		}

		function getEventures() {
			return datacontext.eventure.getEventuresByOwnerId(vm.ownerId)
				.then(function(data) {
					//applyFilter();
					vm.eventures = data;
					return vm.eventures;
				});
		}

		function getEventureLists() {
			return datacontext.eventure.getEventureListsByOwnerId(vm.ownerId)
				.then(function(data) {
					//applyFilter();
					vm.listings = data;
					return vm.listings;
				});
		}

		vm.today = function () {
		   vm.coupon.dateStart = new Date();
		   vm.coupon.dateEnd = new Date();
		};

		vm.today();

		vm.open = function($event, open) {
			$event.preventDefault();
			$event.stopPropagation();
			vm[open] = true;
		};

		vm.dateOptions = {
			'year-format': "'yy'",
			'starting-day': 1
		};

		vm.formats = ['MM-dd-yyyy', 'yyyy/MM/dd', 'shortDate'];

		vm.format = vm.formats[0];

		vm.cancel = function() {
			$location.path("/discounts");
		};
	  
		vm.saveAndNav = function() {
			return datacontext.save(vm.coupon)
				.then(complete);

			function complete() {
				$location.path("/discounts");
			}
		};

	}
})();