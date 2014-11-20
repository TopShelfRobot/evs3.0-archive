(function() {
	'use strict';

	var controllerId = 'setcoupon';
	angular.module('app').controller(controllerId, ['$q', '$routeParams', '$upload', '$http', '$timeout', '$location', '$scope', 'common', 'datacontext', 'config', setcoupon]);

	function setcoupon($q, $routeParams, $upload, $http, $timeout, $location, $scope, common, datacontext, config) {

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
			//alert('dedsrty?????');
			
			common.activateController(getCoupon(), getEventures(), getEventureLists(), controllerId)
				.then(function() {
				    //log('Activated set coupon');
				    onDestroy();
				});
		}

		function getCoupon() {

			if (vm.couponId > 0) {
				return datacontext.surcharge.getCouponById(vm.couponId)
					.then(function(data) {
						//applyFilter();
						return vm.coupon = data;
					});
			} else {
				return vm.coupon = datacontext.surcharge.createCoupon();
			}
		}

		function onDestroy() {
			//alert('destroy my contextttttttt!!!!');
			$scope.$on('$destroy', function () {
			    //alert('destroymy contextttttttt!!!!!!!');
				//autoStoreWip(true);
				datacontext.cancel();
			});
		}

		function getEventures() {
			return datacontext.eventure.getEventuresByOwnerId(vm.ownerId)
				.then(function(data) {
					//applyFilter();
					return vm.eventures = data;
				});
		}

		function getEventureLists() {
			return datacontext.eventure.getEventureListsByOwnerId(vm.ownerId)
				.then(function(data) {
					//applyFilter();
					return vm.listings = data;
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
		  return datacontext.cancel()
			.then(complete);
		  
			function complete() {
			  $location.path("/discounts");
			}
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