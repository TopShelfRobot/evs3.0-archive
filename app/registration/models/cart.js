
; (function() {
	
    //mjb see if you can get this to work with registration().name() see notes
    function registration(displayEvent, displayList, image, email, fee, eventureId, eventureListId, partId, name, stockAnswerSet, groupId, group2Id, quantity) {
        var me = this;
        me.displayEvent = displayEvent;
        me.displayList = displayList;
        me.image = image;
        me.Email = email;
        me.fee = fee;
        me.eventureId = eventureId;
        me.eventureListId = eventureListId;
        me.partId = partId;
        me.name = name;
        me.groupId = groupId;
        me.group2Id = group2Id;
        me.stockAnswerSet = stockAnswerSet;
        me.quantity = quantity;

        me.lineTotal = quantity * fee;
    };

    function surcharge(chargeDesc, amount, chargeType, listId, partId, couponId, context) {
        var me = this;
        me.desc = chargeDesc;
        me.amount = amount;
        me.chargeType = chargeType;
        me.listId = listId;
        me.partId = partId;
        me.couponId = couponId;
        me.context = context;

        me.forXhr = function() {
            var out = {};
            for (var key in me) {
                if (key != "forXhr" && key != "context") {
                    out[key] = me[key];
                }
            }
            return out;
        };
    };
	
	function Cart($http, $routeParams, datacontext, logger, config) {
		
        //cart props
        var cartIsVisible = false;
        var registrations = [];
        var surcharges = [];

        //temp cart registration
        var currentName = ko.observable("");
        var currentDisplayEvent = ko.observable("");
        var currentDisplayList = ko.observable("");
        var currentImage = ko.observable("");
        var currentEmail = ko.observable("");
        var currentFee = ko.observable("");
        var currentEventureId = ko.observable("");
        var currentEventureListId = ko.observable("");
        var currentGroupId = ko.observable("");
        var currentGroup2Id = ko.observable("");
        var currentPartId = ko.observable("");
        var currentStockAnswerSet = ko.observable("");
        var currentQuantity = ko.observable("");

        var addSurcharge = function (desc, amount, chargeType, listid, partid, couponId) {
            surcharges.push(new surcharge(desc, amount, chargeType, listid, partid, couponId));
        };

        var addRegistration = function () {

            // determines if you should process the sibling discount for this registration
            var shouldProcessSiblingDiscount = function(regIndex, addon, isListRule) {
                // assume not, and then go through every previous registration, looking
                // for a duplicate
                var process = false;
                for (var i = 0; i < regIndex; i++) {
                    // if it's a list rule, look for matching eventureListIds,
                    // otherwise it's a eventreu rule any you should look for matching
                    // eventureIds
                    if (isListRule) {
                        process = registrations()[i].eventureListId == registrations()[regIndex].eventureListId;
                    } else {
                        process = registrations()[i].eventureId == registrations()[regIndex].eventureId;
                    }
                    // if you havae found one, then you are done (because extras don't make sense)
                    // but if you haven't found one, one might still be lurking in the list.
                    if (process) {
                        break;
                    }
                }
                return process;
            };


            var isRegDupe = false;
            if (!config.isDuplicateOrderAllowed) {
                for (var i = 0; i < registrations().length; i++) {
                    var currentReg = registrations()[i];
                    if (currentEventureListId() == currentReg.eventureListId && currentPartId() == currentReg.partId) {
                        alert('Duplicate Registration.  Removed from cart.');
                        isRegDupe = true;
                    }
                }
            }

            if (!isRegDupe) {
				
                registrations.push(new registration(currentDisplayEvent(), currentDisplayList(), currentImage(), currentEmail(), currentFee(), currentEventureId(), currentEventureListId(), currentPartId(), currentName(), currentStockAnswerSet(), currentGroupId(), currentGroup2Id(), currentQuantity()));
                cartIsVisible(true);

                //mjb these two need to be one function with addon passed in
				var afterGetListAddons = function() {
                    for (var i = 0; i < listAddons().length; i++) {
                        var current = listAddons()[i];
                        var amount = 0;
                        var processAddon = true;
                        if (current.isUsat())  // = true then{
                        {
                            if (currentStockAnswerSet().usat.length > 1)
                                processAddon = true;
                            else
                                processAddon = false;
                        }
                        if (current.isShirtUpgrade())  // = true then{
                        {
                            if (currentStockAnswerSet().shirtUpgrade == "Yes")
                                processAddon = true;
                            else
                                processAddon = false;
                        }

                        // process the sibling discount only if it is set.
                        if(current.isSiblingDiscount && current.isSiblingDiscount()){
                            processAddon = shouldProcessSiblingDiscount(registrations().length - 1, current, true);
                        }

                        if (processAddon) {
                            if (current.amountTypeId() == 1) { //%
                                amount = Math.round(current.amount() * currentFee() * currentQuantity()) / 100;
                            } else { //currently only % and $
                                amount = current.amount();
                            }
                            surcharges.push(new surcharge(current.addonDesc(), amount, current.addonType(), current.addonTypeLinkId(), currentPartId(), 0, current));
                        }
                    }
                };

                var afterGetEventAddons = function() {
                    for (var i = 0; i < eventAddons().length; i++) {
                        var current = eventAddons()[i];
                        var amount = 0;
                        var processAddon = true;
                        if (current.isUsat())
                        {
                            if (currentStockAnswerSet().usat.length > 1)
                                processAddon = true;
                            else
                                processAddon = false;
                        }
                        if (current.isShirtUpgrade())  
                        {
                            if (currentStockAnswerSet().shirtUpgrade == "Yes")
                                processAddon = true;
                            else
                                processAddon = false;
                        }

                        // process the sibling discount only if set
                        if(current.isSiblingDiscount && current.isSiblingDiscount()){
                            processAddon = shouldProcessSiblingDiscount(registrations().length - 1, current, false);
                        }

                        if (processAddon) {
                            if (current.amountTypeId() == 1) { //%
                                amount = Math.round(current.amount() * currentFee() * currentQuantity()) / 100;
                            } else { //currently only % and $
                                amount = current.amount();
                            }
                            surcharges.push(new surcharge(current.addonDesc(), amount, current.addonType(), current.addonTypeLinkId(), currentPartId(), 0, current));
                        }
                    }
                }
				
                var listAddons = ko.observableArray();
                datacontext.getAddonsByEventureListId(config.regEventureListId, listAddons)
                    .then(afterGetListAddons);

                var eventAddons = ko.observableArray();
                datacontext.getAddonsByEventureId(config.regEventureId, eventAddons)
                    .then(afterGetEventAddons);  
            }
        };

        var processCartRules = function () {

            //clear all rules
            var temp = [];
            for (var j = 0; j < surcharges().length; j++) {
                var currCharge = surcharges()[j];

                if (currCharge.chargeType != 'cartRule') {
                    temp.push(currCharge);
                }
            }
            surcharges(temp);

            var regCount = 0;
            var lowestFee = 0;
            var regTotalAmount = 0;
            var multiEvents = {};

            for (var i = 0; i < registrations().length; i++) {
                var currentReg = registrations()[i];


                if (config.fourDeLisDiscount) {
                    var allFour1 = false;
                    var allFour2 = false;
                    var allFour3 = false;
                    var allFour4 = false;

                    if (currentReg.eventureId == 49) {
                        allFour1 = true;
                    }
                    if (currentReg.eventureId == 50) {
                        allFour2 = true;
                    }
                    if (currentReg.eventureId == 51) {
                        allFour3 = true;
                    }
                    if (currentReg.eventureId == 52) {
                        allFour4 = true;
                    }
                }

                if (config.multItemDiscount) {
                    if (regCount == 0)
                        lowestFee = currentReg.fee;
                    if (currentReg.fee < lowestFee)
                        lowestFee = currentReg.fee;

                }

                regTotalAmount = regTotalAmount + currentReg.fee;
                regCount++;
            }

            if (config.multItemDiscount && regCount > 1) {
                var discount = -.05 * regTotalAmount;
                surcharges.push(new surcharge('Multi-Item Discount', discount.toFixed(2), 'cartRule', 0, 0, 0));
            }

            if (config.isAddSingleFeeForAllRegs) {
                var feeAmount = 0;
                switch (config.addSingleFeeType) {
                    case 'percent':
                        feeAmount = config.addSingleFeeForAllRegsPercent * regTotalAmount / 100;
                        break;
                    case 'flat':
                        feeAmount = regCount * config.addSingleFeeForAllRegsFlat;
                        break;
                    case 'both':
                        feeAmount = (config.addSingleFeeForAllRegsPercent * regTotalAmount / 100) + (regCount * config.addSingleFeeForAllRegsFlat);
                        break;
                    default:
                        feeAmount = 0;
                        break;
                }
                surcharges.push(new surcharge('Online Service Fee', feeAmount.toFixed(2), 'cartRule', 0, 0, 0));
            }
        };

        var removeCoupons = function () {
            //mjb need to check for surcharges and remove them
            for (var j = 0; j < surcharges().length; j++) {
                var currCharge = surcharges()[j];
                if (currCharge.chargeType == 'coupon') {
                    surcharges.splice(j, 1);
                    break;
                }
            }
        };

        var removeRegistration = function (selectedItem) {
            for (var i = 0; i < registrations().length; i++) {
                var current = registrations()[i];
                if (current === selectedItem) {
                    registrations.splice(i, 1);
                    break;
                }
            }

            //check for surcharges and remove them
            var removeList = [];
            for (var j = 0; j < surcharges().length; j++) {
                var currCharge = surcharges()[j];

                //look for list surcharges to delete
                if (currCharge.listId == selectedItem.eventureListId && currCharge.partId == selectedItem.partId && currCharge.chargeType == "listfee") {
                    removeList.unshift(j);
                }

                //look for event surcharges to delete
                if (currCharge.listId == selectedItem.eventureId && currCharge.partId == selectedItem.partId && currCharge.chargeType == "eventfee") {
                  removeList.unshift(j);
                }
            }

            // remove them
            for(var i = 0; i < removeList.length; i++){
                surcharges.splice(removeList[i], 1);
            }

            // Here lies a hunk of crap
			//check for leftover sibling discounts.
			//make a list of duplicate sibling discounts
            var sibDisc = {};
            for(var i = 0; i < surcharges().length; i++){
                if(surcharges()[i].context && surcharges()[i].context.isSiblingDiscount && surcharges()[i].context.isSiblingDiscount()){
                    addon = surcharges()[i].context;
                    if(typeof sibDisc[addon.id()] == "undefined"){
                        sibDisc[addon.id()] = [];
                    }
                    sibDisc[addon.id()].push(addon);
                }
            }
            // check the items in the list for reconsiliation against the registrations
            for(var id in sibDisc){
                // figur eout what you are matching against
                var listId = sibDisc[id][0].addonTypeLinkId();
                var listVar = "eventureId";
                if(sibDisc[id][0].addonType() == "listfee"){
                    listVar = "eventureListId";
                }
                // make a list of the registrations that match the sibling discount addon
                var regList = [];
                for(var i = 0; i < registrations().length; i++){
                    if(registrations()[i][listVar] == listId){
                        regList.push(registrations()[i]);
                    }
                }
                // there should be one more registration than sibling discount
                // therefore removeCnt shold equal 0
                var removeCnt = 1 - (regList.length - sibDisc[id].length);
                // if removeCnt is larger, remove some
                while(removeCnt > 0){
                    for(var i = 0; i < surcharges().length; i++){
                        if(surcharges()[i].context && surcharges()[i].context.id() && surcharges()[i].context.id() == id){
                            surcharges.splice(i, 1);
                            removeCnt--;
                            break;
                        }
                    }
                }
            }

            if (registrations().length == 0)
                cartIsVisible(false);
        };

        var emptyCart = function () {
            var length = this.registrations().length;
            registrations.splice(0, length);

            var chargeLength = this.surcharges().length;
            surcharges.splice(0, chargeLength);

            cartIsVisible(false);
        };

        var getSubTotal = function () {
            var me = this;
            var price = 0,
                length = this.registrations().length,
                i = 0;

            for (; i < length; i++) {
                price += Math.round((me.registrations()[i].fee) * parseFloat(me.registrations()[i].quantity) * 100) / 100;
            }
            return price;
        };

        var getTotalPrice = function () {
            var me = this;
            var price = 0,
                chargelength = me.surcharges().length,
                i = 0;

            for (; i < chargelength; i++) {
                price += parseFloat(me.surcharges()[i].amount);
            }

            var reglength = me.registrations().length;
            i = 0;
            for (; i < reglength; i++) {
                price += parseFloat(me.registrations()[i].fee) * parseFloat(me.registrations()[i].quantity);
            }

            return price;
        };

        var setGiftCardSurcharge = function(value){
            var index = null;
            for(var i = 0; i < surcharges().length; i++){
                if(surcharges()[i].chargeType == "giftcard"){
                    index = i;
                    break;
                }
            }

            if(index == null){
                // chargeDesc, amount, chargeType, listId, partId, couponId, context
                surcharges.push(new surcharge("Gift card surcharge", -1*value, "giftcard", 0, currentPartId(), 0, null));
                index = surcharges().length - 1;
            }
        };

        var removeGiftCardSurcharge = function(){
            for(var i = 0; i < surcharges().length; i++){
                if(surcharges()[i].chargeType == "giftcard"){
                    surcharges.splice(i, 1);
                    break;
                }
            }
        };

        var setPriceAdjustSurcharge = function(value){
            var index = null;
            for(var i = 0; i < surcharges().length; i++){
                if(surcharges()[i].chargeType == "priceadjustment"){
                    index = i;
                    break;
                }
            }

            if(index == null){
                // chargeDesc, amount, chargeType, listId, partId, couponId, context
                surcharges.push(new surcharge("Price adjustment surchage", value, "priceadjustment", 0, currentPartId(), 0, null));
                index = surcharges().length - 1;
            }
        };

        var removePriceAdjustSurcharge = function(){
            for(var i = 0; i < surcharges().length; i++){
                if(surcharges()[i].chargeType == "priceadjustment"){
                    surcharges.splice(i, 1);
                    break;
                }
            }
        };

        var serializeSurcharges = function(orig){
            var send = [];
            if(!orig)
                orig = surcharges()
            for(var i = 0; i < orig.length; i++){
                send.push(orig[i].forXhr());
            }
            return send;
        };

        var vm = {
            setGiftCardSurcharge : setGiftCardSurcharge,
            removeGiftCardSurcharge: removeGiftCardSurcharge,
            setPriceAdjustSurcharge : setPriceAdjustSurcharge,
            removePriceAdjustSurcharge: removePriceAdjustSurcharge,
            addSurcharge: addSurcharge,
            addRegistration: addRegistration,
            removeRegistration: removeRegistration,
            emptyCart: emptyCart,
            getSubTotal: getSubTotal,
            getTotalPrice: getTotalPrice,
            processCartRules: processCartRules,

            //props
            cartIsVisible: cartIsVisible,

            //koo
            registrations: registrations,
            surcharges: surcharges,
            removeCoupons: removeCoupons,

            //current cart registration
            currentDisplayEvent: currentDisplayEvent,
            currentDisplayList: currentDisplayList,
            currentImage: currentImage,
            currentFee: currentFee,
            currentEventureId: currentEventureId,
            currentEventureListId: currentEventureListId,
            currentName: currentName,
            currentPartId: currentPartId,
            currentGroupId: currentGroupId,
            currentGroup2Id: currentGroup2Id,
            currentStockAnswerSet: currentStockAnswerSet,
            currentQuantity: currentQuantity,
            serializeSurcharges : serializeSurcharges
        };
        return vm;
	}

	angular.module("evReg").service("cart", ["$http", "$routeParams", "datacontext", "logger", "config", Cart]);

})();
