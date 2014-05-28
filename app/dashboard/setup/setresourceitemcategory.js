define(['services/logger', 'services/datacontext', 'config'],

    function (logger, datacontext, config) {

        var categories = ko.observableArray();

        var activate = function () {
            return datacontext.getResourceItemCategoriesByOwnerId(config.ownerId, false,  categories);
        };

        var viewAttached = function () {};

        var clickAddCategory = function () {
            var newCategory = ko.observable(datacontext.createResourceItemCategory());

            newCategory().ownerId(config.ownerId);
            newCategory().name('');
            categories.push(newCategory);
        };
        
        var clickSave = function () {
            //isSaving(true);
            return datacontext.saveChanges()
                .fin(complete);

            function complete() {
                parent.$.fancybox.close(true);
                //isSaving(false);
                //logger.log('saved!', null, 'test', true);
            }
        };

        var vm = {
            activate: activate,
            clickAddCategory: clickAddCategory,
            categories: categories,
            clickSave: clickSave,
            viewAttached: viewAttached
        };
        return vm;
    });

