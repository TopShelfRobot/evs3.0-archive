define(['services/logger', 'services/datacontext', 'durandal/plugins/router', 'config'],

    function (logger, datacontext, router, config) {
        var coupon = ko.observable();
        var eventureLists = ko.observableArray();
        var eventures = ko.observableArray();
        var couponId;

        var displayEventToggle = ko.observable();
        var displayListToggle = ko.observable();

        var activate = function (routeData) {
            couponId = parseInt(routeData.id);

            datacontext.getEventuresByOwnerId(config.ownerId, eventures);
            datacontext.getEventureListsByOwnerId(config.ownerId, eventureLists);

            if (isNaN(couponId)) {
                return coupon(datacontext.createCoupon(config.ownerId));
            }
            else {
                return datacontext.getCouponById(couponId, coupon);
            }
        };

        var viewAttached = function (view) {

            var savedCouponType = $('input[name=optionsRadios]:checked').val();
            switch (savedCouponType) {
                case 'owner':
                    displayEventToggle(false);
                    displayListToggle(false);
                    break;
                case 'event':
                    displayEventToggle(true);
                    displayListToggle(false);
                    //logger.log('next to quest' + coupon().couponTypeLinkId(), null, 'sf', true);
                    $("#eventuredropdown").val(coupon().couponTypeLinkId());
                    break;
                case 'list':
                    displayEventToggle(false);
                    displayListToggle(true);
                    //logger.log('next to quest' + coupon().couponTypeLinkId(), null, 'sf', true);
                    $("#listdropdown").val(coupon().couponTypeLinkId());
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

            // create DropDownList from in put HTML element
            //$("#couponmodifier").kendoDropDownList();

            $("#eventcoupon").change(function () {
                displayEventToggle(true);
                displayListToggle(false);
            });

            $("#listcoupon").change(function () {
                displayEventToggle(false);
                displayListToggle(true);
            });

            $("#allcoupon").change(function () {
                displayEventToggle(false);
                displayListToggle(false);
            });

            $("#startdate").datepicker();
            $("#enddate").datepicker();
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
            //logger.log('option type: ' + couponType, null, 'sf', true);
            switch (couponType) {
                case 'owner':
                    coupon().couponTypeLinkId(config.ownerId);
                    break;
                case 'event':
                    //logger.log('event val: ' + $("#eventuredropdown").val(), null, 'sf', true);
                    coupon().couponTypeLinkId($("#eventuredropdown").val());
                    break;
                case 'list':
                    //logger.log('list val: ' + $("#listdropdown").val(), null, 'sf', true);
                    coupon().couponTypeLinkId($("#listdropdown").val());
                    break;
            }
            datacontext.saveChanges(coupon);

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
            coupon: coupon,
            clickSave: clickSave,
            viewAttached: viewAttached
        };
        return vm;
    });
