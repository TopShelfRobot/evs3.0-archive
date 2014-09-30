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
      
        vm.saveAndNav = function() {
            return datacontext.save()
                .then(complete);

            function complete() {
                $location.path("/resourcedetail/" + vm.resourceId);
            }
        };

	}
})();




//define(['services/logger', 'services/datacontext', 'config'],   //, 'viewmodels/shared/debug'
//
//    function (logger, datacontext, config) {
// 
//        var categories = ko.observableArray();
//        var resources = ko.observableArray();
//        var resourceItem = ko.observable();
//        
//        var localresourceId = 0;
//        var resourceItemId = 0;
//        
//        var activate = function (routeData) {
//            resourceItemId = parseInt(routeData.riid);
//            localresourceId = parseInt(routeData.rid);
//            //logger.log('resourceItemId: ' + resourceItemId, null, 'test', true);
//            //logger.log('resourceId: ' + localresourceId, null, 'test', true);
//            
//            datacontext.getResourcesByOwnerId(config.ownerId, resources);
//            datacontext.getResourceItemCategoriesByOwnerId(config.ownerId, true, categories);
//
//            if (isNaN(resourceItemId))
//                return resourceItem(datacontext.createResourceItem(localresourceId));
//            else {
//                return datacontext.getResourceItemById(resourceItemId, resourceItem);
//                }
//        };
//
//        var saveResourceItem = function () {
//            //logger.log('called save', null, 'test', true);
//
//            return datacontext.save()
//                .fin(complete);
//
//            function complete() {
//                //isSaving(false);
//                //logger.log('saved!', null, 'test', true);
//                parent.$.fancybox.close(true);
//            }
//        };
//
//        var viewAttached = function () {
//            //logger.log('view attached', null, 'test', true);
//        };
//
//        var vm = {
//            activate: activate,
//            saveResourceItem: saveResourceItem,
//            categories: categories,
//            resources: resources,
//            resourceItem: resourceItem,
//            viewAttached: viewAttached
//        };
//        return vm;
//    });
//
