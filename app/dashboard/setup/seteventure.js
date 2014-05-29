(function () {
    'use strict';

    var controllerId = 'seteventure';
    angular.module('app').controller(controllerId, ['$routeParams', 'common', 'datacontext', 'config', seteventure]);

    function seteventure($routeParams, common, datacontext, config) {

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Eventure';
        vm.evenureId = 0;

        vm.eventure = [];
        activate();

        function activate() {
            common.activateController(getEventure(), controllerId)
                .then(function () { log('Activated set resource'); });
        }

        function getEventure() {
            return datacontext.getResourceById(1)
                .then(function (data) {
                    //applyFilter();
                    return vm.resource = data;
                });
        }

        vm.saveAndNav = function () {
            return datacontext.saveChanges(eventure)
                .fin(complete);

            function complete() {

                //if (eventure().managed()) {
                //    url = '#setclient';
                //    router.navigateTo(url);
                //}
                //else
                //    parent.$.fancybox.close(true);
            }
        };

    }
})();

//define(['services/logger', 'services/datacontext', 'durandal/plugins/router', 'config'],  //, 'viewmodels/shared/debug'

//    function (logger, datacontext, router, config) {

//        var eventure = ko.observable();
//        var eventureId;

//        var activate = function (routeData) {
//            logger.log('test activating.', null, 'ec', true);

//            //$('#header').addClass('hidden');

//            eventureId = parseInt(routeData.id);
//            logger.log('test activating.' + eventureId, null, 'ec', true);
//            if (isNaN(eventureId))   //
//                config.wizard = true;     //we took this page out of the wizard but wizard=true still indicates a new event
//            else
//                config.wizard = false;

//            if (config.wizard)
//                return eventure(datacontext.createEventure());
//            else
//                return datacontext.getEventureById(eventureId, eventure);  //mjb this is wrong should be id passed in

//        };


//        //var clickNext = function () {
//        //    //logger.log('next', null, 'seteventure', true);
//        //    eventure().ownerId(config.ownerId);

//        //    var form = $(".form-horizontal");
//        //    form.validate();

//        //    if (form.valid())
//        //        saveAndNav();
//        //};




//        var vm = {
//            activate: activate,
//            eventure: eventure,
//            clickNext: clickNext,
//            viewAttached: viewAttached
//        };
//        return vm;
//    });

