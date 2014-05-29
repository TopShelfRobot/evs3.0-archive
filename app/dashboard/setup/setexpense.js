﻿define(['services/logger', 'services/datacontext', 'config'],   //, 'viewmodels/shared/debug'

    function (logger, datacontext, config) {

        var expense = ko.observable();
        var categories = ko.observableArray();
        var items = ko.observableArray();
        var selectedCategory = ko.observable('');
        var count=0;
        //var filteredItems = ko.observableArray();;
        var expenseId;
        var eventureId;
        
        var activate = function (routeData) {
            //logger.log('activate' , null, 'test', true);
            expenseId = parseInt(routeData.idfixme);
            eventureId = parseInt(routeData.eid);
            //logger.log('eventId' + eventureId, null, 'exp', true);
            //logger.log('expId' + expenseId, null, 'test', true);
            datacontext.getResourceItemsByOwnerId(config.ownerId, items);
            datacontext.getResourceItemCategoriesByOwnerId(config.ownerId, true, categories);
           
            if (isNaN(expenseId)) {
                //logger.log('creating expense' , null, 'test', true);
                return expense(datacontext.createExpense(eventureId));
            }
            else {
                return datacontext.geExpenseById(expenseId, expense);
            }
        };

       

        var clickSave = function () { 
           //expense().categoryId(selectedCategory());
            save();
           };

        var save = function () {
            //isSaving(true);
            //logger.log('called save', null, 'test', true);
            return datacontext.saveChanges(expense)
                .then(complete);

            function complete() {
                //isSaving(false);
                //logger.log('saved!', null, 'test', true);
                parent.$.fancybox.close(true);
                //close fancy
            }
        };

        var viewAttached = function () {
            //logger.log('view attached', null, 'test', true);
            
          
        };
        
        var filteredItems = ko.computed(function () {
            //logger.log('running computed', null, 'test', true);
            //var filter = selectedCategory();
            var filter;
            if (count > 0)     //this is necessary because of a race condition with durandal.  should be able to remove when upgrading to 2.0
                filter = expense().resourceItemCategoryId();  //ResourceItemCategoryId
            //logger.log('filter' + filter, null, 'test', true);
            count++;
            
           if (!filter) {
                return items();
            } else {
                return ko.utils.arrayFilter(items(), function (i) {
                    
                    return i.resourceItemCategoryId() == filter;
                });

                //var newItems = ko.observableArray();
                //logger.log('# of items: ' + items().length, null, 'test', true);
                //for (var i = 0; i < items().length; i++) {
                //    var currentItem = items()[i];
                //    if (currentItem.ItemCategoryId() == filter) {
                //        newItems.push(currentItem);
                //        //logger.log('here!!!2!', null, 'test', true);
                //    }
                //}
                //logger.log('coiunt: ' + newItems().length, null, 'test', true);
                //return newItems();
            }
        });

        
      

        var vm = {
            activate: activate,
            clickSave: clickSave,
            expense: expense,
            selectedCategory: selectedCategory,
            categories: categories,
            items: items,
            filteredItems: filteredItems,
            viewAttached: viewAttached
        };
        return vm;
    });




//var filteredItems = ko.computed(function () {
//    //logger.log('here!!!!', null, 'test', true);

//    //logger.log('expCAt1' + expense.categoryId, null, 'test', true);
//    //logger.log('expCAt2' + expense.categoryId(), null, 'test', true);
//    //logger.log('expCAt3' + expense().categoryId, null, 'test', true);
//    //logger.log('expCAt4' + expense().categoryId(), null, 'test', true);


//    //var filter = selectedCategory();
//    var filter = expense().categoryId;
//    //logger.log('filter: ' + filter, null, 'test', true);
//    if (!filter) {
//        //logger.log('here!!!!1', null, 'test', true);
//        return items();
//    } else {
//        return ko.utils.arrayFilter(items(), function (i) {
//            //logger.log('here!!!2!', null, 'test', true);
//            return i.ItemCategoryId() == filter;
//        });

//        //var newItems = ko.observableArray();
//        //logger.log('# of items: ' + items().length, null, 'test', true);
//        //for (var i = 0; i < items().length; i++) {
//        //    var currentItem = items()[i];
//        //    if (currentItem.ItemCategoryId() == filter) {
//        //        newItems.push(currentItem);
//        //    }
//        //}
//        //logger.log('coiunt: ' + newItems().length, null, 'test', true);
//        //return newItems();
//    }
//});