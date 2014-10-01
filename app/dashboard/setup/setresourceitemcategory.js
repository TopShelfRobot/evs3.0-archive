(function() {
	'use strict';

	var controllerId = 'setresourceitemcategory';
	angular.module('app').controller(controllerId, ['$q', '$routeParams', '$upload', '$http', '$timeout', '$location', 'common', 'datacontext', 'config', setresourceitemcategory]);

	function setresourceitemcategory($q, $routeParams, $upload, $http, $timeout, $location, common, datacontext, config) {

		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		var vm = this;
		vm.title = 'Resource Item Category';
        vm.resourceId = $routeParams.resourceId;
      
        vm.ownerId = config.owner.ownerId;
        vm.categories= [];

		activate();

		function activate() {
			common.activateController(getResourceItemCategories(), controllerId)
				.then(function() {
					//log('Activated set coupon');
				});
		}

		function getResourceItemCategories() {
				return datacontext.resource.getResourceItemCategoriesByOwnerId(vm.ownerId)
                  .then(function(data) {
                      return vm.categories = data;
                  });
		}
      
		vm.addNewCategory = function () {
		   vm.categories.push(datacontext.resource.createResourceItemCategory());
        };
      
        vm.saveAndNav = function () {
            return datacontext.save()
                .then(complete);

            function complete() {
                $location.path("/resourcedetail/" + vm.resourceId);
            }
        };

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

