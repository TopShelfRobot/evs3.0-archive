(function () {
    'use strict';

    var controllerId = 'seteventure';
    angular.module('app').controller(controllerId, ['$routeParams', 'common', 'datacontext', 'config', seteventure]);

    function seteventure($routeParams, common, datacontext, config) {

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Eventure';
        vm.eventureId = $routeParams.eventureId || 0;

        //log('val is: ' + vm.eventureId);

        vm.eventure = {};
        activate();

        function activate() {
            common.activateController(getEventure(), controllerId)
                .then(function () { log('Activated set resource'); });
        }

        function getEventure() {

            if (vm.eventureId > 0) {
                return datacontext.getEventureById(vm.eventureId)
                    .then(function (data) {
                        //applyFilter();
                        return vm.eventure = data;
                    });
            } else {
                return datacontext.createEventure()
                    .then(function (data) {
                        //applyFilter();
                        return vm.eventure = data;
                    });
            }
        }

       

        //vm.today = function () {
        //    //vm.dateEventure = new Date();
        //    //vm.dateTransfer = new Date();
        //    //vm.dateDeferral = new Date();
        //};

        //vm.today();


        //vm.clear = function () {
        //    vm.dateEventure = null;
        //    vm.dateTransfer = null;
        //    vm.dateDeferral = null;
        //};

        vm.open = function ($event, open) {
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

