define(['services/logger', 'services/datacontext', 'durandal/plugins/router', 'config'],

    function (logger, datacontext, router, config) {
        var addon = ko.observable();
        var eventureLists = ko.observableArray();
        var eventures = ko.observableArray();
        var addonId;

        var displayEventToggle = ko.observable();
        var displayListToggle = ko.observable();

        var activate = function (routeData) {
            addonId = parseInt(routeData.id);
            //logger.log('addonId' + addonId, null, 'addon', true);

            datacontext.getEventuresByOwnerId(config.ownerId, eventures);
            datacontext.getEventureListsByOwnerId(config.ownerId, eventureLists);

            if (isNaN(addonId)) {
                //logger.log('adding addon', null, 'addon', true);
                return addon(datacontext.createAddon(config.ownerId));
            }
            else {
                return datacontext.getAddonById(addonId, addon);
            }
        };

        var viewAttached = function (view) {

            var savedCouponType = $('input[name=optionsRadios]:checked').val();
            //logger.log('addon type: ' + savedCouponType, null, 'savedCouponType', true);
            switch (savedCouponType) {
                //case 'owner':
                //    displayEventToggle(false);
                //    displayListToggle(false);
                //    break;
                case 'eventfee':
                    displayEventToggle(true);
                    displayListToggle(false);
                    $("#eventuredropdown").val(addon().addonTypeLinkId());
                    break;
                case 'listfee':
                    displayEventToggle(false);
                    displayListToggle(true);
                    $("#listdropdown").val(addon().addonTypeLinkId());
                    break;
            }

           

            // create NumericTextBox from input HTML element
            $("#quantity").kendoNumericTextBox({
                decimals: 0
            });
            $("#couponvalue").kendoNumericTextBox({
                decimals: 2
            });
            // create DatePicker from input HTML element
            $("#startdate").datepicker();
            $("#enddate").datepicker();

            $("#eventaddon").change(function () {
                displayEventToggle(true);
                displayListToggle(false);
            });

            $("#listaddon").change(function () {
                displayEventToggle(false);
                displayListToggle(true);
            });

            //$("#allcoupon").change(function () {
            //    displayEventToggle(false);
            //    displayListToggle(false);
            //});

            //$("#startdate").datepicker();
            //$("#enddate").datepicker();
            
            //$("#test select").val("2");
           
            //eventuredropdown


        };   //end viewAttached

        var clickSave = function () {
            //logger.log('next to quest', null, 'sf', true);
            saveAndNav();
        };
        var saveAndNav = function () {
            //isSaving(true);
            // alert('text: ' + $("#eventuredropdown option:selected").text());
            //alert('val: ' + $("#eventuredropdown").val());

            var couponType = $('input[name=optionsRadios]:checked').val();

            switch (couponType) {
                //case 'owner':
                //    //logger.log('next to quest' + config.ownerId, null, 'sf', true);
                //    coupon().couponTypeLinkId(config.ownerId);
                //    break;
                case 'eventfee':
                    addon().addonTypeLinkId($("#eventuredropdown").val());
                    break;
                case 'listfee':
                    addon().addonTypeLinkId($("#listdropdown").val());
                    break;
            }
            datacontext.saveChanges(addon);

            parent.$.fancybox.close(true);

            //function complete() {
            //    //isSaving(false);
            //    //logger.log('save complete', null, 'sl', true);
            //}
        };

        var vm = {
            activate: activate,
            displayEventToggle: displayEventToggle,
            displayListToggle: displayListToggle,
            //editMode: editMode,
            //createMode: createMode,
            eventureLists: eventureLists,
            eventures: eventures,
            addon: addon,
            clickSave: clickSave,
            viewAttached: viewAttached
        };
        return vm;
    });
