define(['services/logger', 'services/datacontext', 'durandal/plugins/router', 'config'],

    function (logger, datacontext, router, config) {

        var fees = ko.observableArray();
        var groups = ko.observableArray();
        var sortOrder = 0;

        var activate = function () {
            //logger.log('test activating.' + config.wizEventureListId, null, 'sfee', true);
            datacontext.getGroupsByEventureListId(config.wizEventureListId, groups)
                .then(function () {
                    //logger.log('groups: ' + groups().length(), null, 'sfee', true);
                });
            return datacontext.getFeeSchedulesByEventureListId(config.wizEventureListId, fees);
        };

        var viewAttached = function () {
            //logger.log('view attached', null, 'setfee', true);
            $(".feedate").datepicker();
            //$("#feedate").datepicker();
            //$(".feeamount").maskMoney({ symbol: '$ ', thousands: ',', decimal: '.', symbolStay: true });
        };

        var clickAddGroup = function () {
            //logger.log('trying to add group ', null, 'sf', true);
            //logger.log('groups: ' + groups().length, null, 'sfee', true);
            var newGroup = ko.observable(datacontext.createGroup());
            //logger.log('still good ', null, 'sf', true);
            newGroup().eventureListId(config.wizEventureListId);
            newGroup().capacity(0);
            newGroup().active(true);
            newGroup().name("");
            newGroup().sortOrder(groups().length + 1);
            groups.push(newGroup);
        };

        var clickAddFee = function () {
            //logger.log('', null, 'sf', true);
            var newFee = ko.observable(datacontext.createFeeSchedule());

            newFee().eventureListId(config.wizEventureListId);
            newFee().amount(0);
            newFee().dateBegin("");
            fees.push(newFee);
            //fees.push({ amount: 0, dateBegin: "", active: true, eventureListId: config.wizEventureListId });

            $(".feedate").datepicker();
            //$(".feeamount").maskMoney({ symbol: '$ ', thousands: ',', decimal: '.', symbolStay: true });

        };

        var clickNext = function () {
            //logger.log('next to quest', null, 'sf', true);
            saveAndNav();
        };

        var saveAndNav = function () {
            //isSaving(true);
            //logger.log('called saveeeee', null, 'sf', true);
            return datacontext.saveChanges(fees)
                .fin(complete);

            function complete() {
                //isSaving(false);
                //logger.log('save complete', null, 'sl', true);
                var url = '#setquestion'; //+ eventureList().id();
                router.navigateTo(url);
            }
        };


        var vm = {
            activate: activate,
            fees: fees,
            groups: groups,
            clickNext: clickNext,
            clickAddGroup: clickAddGroup,
            clickAddFee: clickAddFee,
            viewAttached: viewAttached
        };
        return vm;
    });

