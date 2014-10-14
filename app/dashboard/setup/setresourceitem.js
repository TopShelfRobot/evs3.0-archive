(function() {
	'use strict';

	var controllerId = 'setresourceitem';
	angular.module('app').controller(controllerId, ['$q', '$routeParams', '$upload', '$http', '$timeout', '$location', 'common', 'datacontext', 'config', setresourceitem]);

	function setresourceitem($q, $routeParams, $upload, $http, $timeout, $location, common, datacontext, config) {

		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		var vm = this;
		vm.title = 'Resource Item';
		vm.itemId = $routeParams.itemId || 0;
        vm.resourceId = $routeParams.resourceId;
      
        vm.ownerId = config.owner.ownerId;

        vm.item = {};
        vm.categories = [];

		activate();

		function activate() {
			common.activateController(getResourceItem(), getResourceCategories(), getResources(), controllerId)
				.then(function() {
					//log('Activated set coupon');
				});
		}

		function getResourceItem() {

			if (vm.itemId > 0) {
				return datacontext.resource.getResourceItemById(vm.itemId)
					.then(function(data) {
						//applyFilter();
						return vm.item = data;
					});
			} else {
				return vm.item = datacontext.resource.createResourceItem(vm.resourceId);
			}
		}

        function getResourceCategories() {
            return datacontext.resource.getResourceItemCategoriesByOwnerId(vm.ownerId)
                .then(function(data) {
                    //applyFilter();
                    return vm.categories = data;
                });
        }

        function getResources() {
            return datacontext.resource.getResourcesByOwnerId(vm.ownerId)
                .then(function(data) {
                    //applyFilter();
                    return vm.resources = data;
                });
        }
      
        vm.cancel = function() {
          return datacontext.cancel()
            .then(complete);
          
            function complete() {
              $location.path("/resourcedetail/" + vm.resourceId);
            }
        };
      
        vm.saveAndNav = function() {
            return datacontext.save()
                .then(complete);

            function complete() {
                $location.path("/resourcedetail/" + vm.resourceId);
            }
        };

	}
})();