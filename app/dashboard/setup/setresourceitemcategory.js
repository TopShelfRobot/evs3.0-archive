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
			common.activateController(getResourceItem(), getResourceCategories(), controllerId)
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
				return vm.coupon = datacontext.resource.createResourceItem(vm.resourceId);
			}
		}

        function getResourceCategories() {
            return datacontext.resources.getResourceItemCategoriesByOwnerId(vm.ownerId)
                .then(function(data) {
                    //applyFilter();
                    return vm.categories = data;
                });
        }

        function getEventureLists() {
            return datacontext.eventure.getEventureListsByOwnerId(vm.ownerId)
                .then(function(data) {
                    //applyFilter();
                    return vm.listings = data;
                });
        }

	}
})();


//define(['services/logger', 'services/datacontext', 'config'],
//
//    function (logger, datacontext, config) {
//
//        var categories = ko.observableArray();
//
//        var activate = function () {
//            return datacontext.getResourceItemCategoriesByOwnerId(config.ownerId, false,  categories);
//        };
//
//        var viewAttached = function () {};
//
//        var clickAddCategory = function () {
//            var newCategory = ko.observable(datacontext.createResourceItemCategory());
//
//            newCategory().ownerId(config.ownerId);
//            newCategory().name('');
//            categories.push(newCategory);
//        };
//        
//        var clickSave = function () {
//            //isSaving(true);
//            return datacontext.save()
//                .fin(complete);
//
//            function complete() {
//                parent.$.fancybox.close(true);
//                //isSaving(false);
//                //logger.log('saved!', null, 'test', true);
//            }
//        };
//
//        var vm = {
//            activate: activate,
//            clickAddCategory: clickAddCategory,
//            categories: categories,
//            clickSave: clickSave,
//            viewAttached: viewAttached
//        };
//        return vm;
//    });

