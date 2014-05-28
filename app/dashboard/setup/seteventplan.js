define(['services/logger', 'services/datacontext', 'config'],

    function (logger, datacontext, config) {

        var planItem = ko.observable();
        var resources = ko.observableArray();
        var eventureId = 0;
        var planItemId;

        var activate = function (routeData) {
            planItemId = parseInt(routeData.id);
            eventureId = parseInt(routeData.eid);
            logger.log('create plan planItemId: ' + planItemId, null, 'plan', true);
            logger.log('create plan eventureId: ' + eventureId, null, 'plan', true);


           
            datacontext.getResourcesByOwnerId(config.ownerId, resources);
            
            if (isNaN(planItemId)) {
                logger.log('should nto go here', null, 'plan', true);
                return planItem(datacontext.createPlanItem(eventureId));
            }
            else {
                logger.log('int here', null, 'plan', true);
                return datacontext.getPlanItemById(planItemId, planItem);
            }
        };

        var clickSave = function () {
            save();
        };

        var save = function () {
            //isSaving(true);
            //logger.log('called save', null, 'test', true);
            return datacontext.saveChanges(planItem)
                .then(complete);
            //.fin(fin1);

            function complete() {
                //isSaving(false);
                parent.$.fancybox.close(true);
            }
        };

        var viewAttached = function (view) {
            //logger.log('view attached', null, 'test', true);
            // bindEventToList(view, '.events', gotoDetails);
        };

        var vm = {
            activate: activate,
            clickSave: clickSave,
            planItem: planItem,
            resources: resources,
            viewAttached: viewAttached
        };
        return vm;
    });

