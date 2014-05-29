define(['services/logger', 'services/datacontext', 'config'],   //, 'viewmodels/shared/debug'

    function (logger, datacontext, config) {
 
        var categories = ko.observableArray();
        var resources = ko.observableArray();
        var resourceItem = ko.observable();
        
        var localresourceId = 0;
        var resourceItemId = 0;
        
        var activate = function (routeData) {
            resourceItemId = parseInt(routeData.riid);
            localresourceId = parseInt(routeData.rid);
            //logger.log('resourceItemId: ' + resourceItemId, null, 'test', true);
            //logger.log('resourceId: ' + localresourceId, null, 'test', true);
            
            datacontext.getResourcesByOwnerId(config.ownerId, resources);
            datacontext.getResourceItemCategoriesByOwnerId(config.ownerId, true, categories);

            if (isNaN(resourceItemId))
                return resourceItem(datacontext.createResourceItem(localresourceId));
            else {
                return datacontext.getResourceItemById(resourceItemId, resourceItem);
                }
        };

        var saveResourceItem = function () {
            //logger.log('called save', null, 'test', true);

            return datacontext.saveChanges()
                .fin(complete);

            function complete() {
                //isSaving(false);
                //logger.log('saved!', null, 'test', true);
                parent.$.fancybox.close(true);
            }
        };

        var viewAttached = function () {
            //logger.log('view attached', null, 'test', true);
        };

        var vm = {
            activate: activate,
            saveResourceItem: saveResourceItem,
            categories: categories,
            resources: resources,
            resourceItem: resourceItem,
            viewAttached: viewAttached
        };
        return vm;
    });

