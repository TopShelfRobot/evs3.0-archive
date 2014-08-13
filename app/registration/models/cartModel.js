
(function() {
	
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
		var currentParticipant = null;
		var currentEventure = null;
		var currentEventureList = null;
		
        var currentName = null;
        var currentDisplayEvent = null;
        var currentDisplayList = null;
        var currentImage = null;
        var currentEmail = null;
        var currentFee = null;
        var currentEventureId = null;
        var currentEventureListId = null;
        var currentGroupId = null;
        var currentGroup2Id = null;
        var currentPartId = null;
        var currentStockAnswerSet = null;
        var currentQuantity = null;
		
		var setCurrentParticipant = function(part){
			vm.currentName = part.firstName + " " + part.lastName; // TODO: check on this
			vm.currentPartId = part.id;
			vm.currentParticipant = part;
			vm.currentEmail = part.email;
		};
		
		var setCurrentEventure = function(eventure){
			vm.currentEventure = eventure;
            vm.currentEventureId = eventure.id
			vm.currentDisplayEvent = eventure.name;
		};
		
		var setCurrentEventureList = function(list){
			vm.currentEventureList = list;
            vm.currentEventureListId = list.id;
            vm.currentDisplayList = list.name;
            vm.currentFee = list.currentFee;
            vm.currentImage = list.imageName;
            vm.currentQuantity = 1; // TODO: check on this
		};

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
                        process = vm.registrations[i].eventureListId == vm.registrations[regIndex].eventureListId;
                    } else {
                        process = vm.registrations[i].eventureId == vm.registrations[regIndex].eventureId;
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
                for (var i = 0; i < vm.registrations.length; i++) {
                    var currentReg = vm.registrations[i];
                    if (vm.currentEventureListId == currentReg.eventureListId && vm.currentPartId == currentReg.partId) {
                        alert('Duplicate Registration.  Removed from cart.');
                        isRegDupe = true;
                    }
                }
            }

            if (!isRegDupe) {
				
                vm.registrations.push(new registration(vm.currentDisplayEvent, vm.currentDisplayList, vm.currentImage, vm.currentEmail, vm.currentFee, vm.currentEventureId, vm.currentEventureListId, vm.currentPartId, vm.currentName, vm.currentStockAnswerSet, vm.currentGroupId, vm.currentGroup2Id, vm.currentQuantity));
                vm.cartIsVisible = true;

                //mjb these two need to be one function with addon passed in
				var afterGetListAddons = function(listAddons) {
                    for (var i = 0; i < listAddons.length; i++) {
                        var current = listAddons[i];
                        var amount = 0;
                        var processAddon = true;
                        if (current.isUsat)  // = true then{
                        {
                            if (vm.currentStockAnswerSet.usat.length > 1)
                                processAddon = true;
                            else
                                processAddon = false;
                        }
                        if (current.isShirtUpgrade)  // = true then{
                        {
                            if (vm.currentStockAnswerSet.shirtUpgrade == "Yes")
                                processAddon = true;
                            else
                                processAddon = false;
                        }

                        // process the sibling discount only if it is set.
                        if(current.isSiblingDiscount && current.isSiblingDiscount){
                            processAddon = shouldProcessSiblingDiscount(vm.registrations.length - 1, current, true);
                        }

                        if (processAddon) {
                            if (current.amountTypeId == 1) { //%
                                amount = Math.round(current.amount * vm.currentFee * vm.currentQuantity) / 100;
                            } else { //currently only % and $
                                amount = current.amount;
                            }
                            surcharges.push(new surcharge(current.addonDesc, amount, current.addonType, current.addonTypeLinkId, vm.currentPartId, 0, current));
                        }
                    }
                };

                var afterGetEventAddons = function(eventAddons) {
                    for (var i = 0; i < eventAddons.length; i++) {
                        var current = eventAddons[i];
                        var amount = 0;
                        var processAddon = true;
                        if (current.isUsat) {
                            if (vm.currentStockAnswerSet.usat.length > 1)
                                processAddon = true;
                            else
                                processAddon = false;
                        }
                        if (current.isShirtUpgrade) {
                            if (vm.currentStockAnswerSet.shirtUpgrade == "Yes")
                                processAddon = true;
                            else
                                processAddon = false;
                        }

                        // process the sibling discount only if set
                        if (current.isSiblingDiscount && current.isSiblingDiscount) {
                            processAddon = shouldProcessSiblingDiscount(vm.registrations.length - 1, current, false);
                        }

                        if (processAddon) {
                            if (current.amountTypeId == 1) { //%
                                amount = Math.round(current.amount * vm.currentFee * vm.currentQuantity) / 100;
                            } else { //currently only % and $
                                amount = current.amount;
                            }
                            surcharges.push(new surcharge(current.addonDesc, amount, current.addonType, current.addonTypeLinkId, vm.currentPartId, 0, current));
                        }
                    }
                };
				
                datacontext.getAddonsByEventureListId(vm.currentEventureListId)
                    .then(afterGetListAddons);

                datacontext.getAddonsByEventureId(vm.currentEventureId)
                    .then(afterGetEventAddons);  
            }
        };

        var processCartRules = function () {

            //clear all rules
            var temp = [];
            for (var j = 0; j < surcharges.length; j++) {
                var currCharge = surcharges[j];

                if (currCharge.chargeType != 'cartRule') {
                    temp.push(currCharge);
                }
            }
            surcharges = temp;

            var regCount = 0;
            var lowestFee = 0;
            var regTotalAmount = 0;
            var multiEvents = {};

            for (var i = 0; i < vm.registrations.length; i++) {
                var currentReg = vm.registrations[i];

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
            for (var j = 0; j < surcharges.length; j++) {
                var currCharge = surcharges[j];
                if (currCharge.chargeType == 'coupon') {
                    surcharges.splice(j, 1);
                    break;
                }
            }
        };

        var removeRegistration = function (selectedItem) {
            for (var i = 0; i < vm.registrations.length; i++) {
                var current = vm.registrations[i];
                if (current === selectedItem) {
                    vm.registrations.splice(i, 1);
                    break;
                }
            }

            //check for surcharges and remove them
            var removeList = [];
            for (var j = 0; j < surcharges.length; j++) {
                var currCharge = surcharges[j];

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
            for(var i = 0; i < surcharges.length; i++){
                if(surcharges[i].context && surcharges[i].context.isSiblingDiscount && surcharges[i].context.isSiblingDiscount){
                    addon = surcharges[i].context;
                    if(typeof sibDisc[addon.id] == "undefined"){
                        sibDisc[addon.id] = [];
                    }
                    sibDisc[addon.id].push(addon);
                }
            }
            // check the items in the list for reconsiliation against the registrations
            for(var id in sibDisc){
                // figur eout what you are matching against
                var listId = sibDisc[id][0].addonTypeLinkId;
                var listVar = "eventureId";
                if(sibDisc[id][0].addonType == "listfee"){
                    listVar = "eventureListId";
                }
                // make a list of the registrations that match the sibling discount addon
                var regList = [];
                for(var i = 0; i < vm.registrations.length; i++){
                    if(vm.registrations[i][listVar] == listId){
                        regList.push(vm.registrations[i]);
                    }
                }
                // there should be one more registration than sibling discount
                // therefore removeCnt shold equal 0
                var removeCnt = 1 - (regList.length - sibDisc[id].length);
                // if removeCnt is larger, remove some
                while(removeCnt > 0){
                    for(var i = 0; i < surcharges.length; i++){
                        if(surcharges[i].context && surcharges[i].context.id && surcharges[i].context.id == id){
                            surcharges.splice(i, 1);
                            removeCnt--;
                            break;
                        }
                    }
                }
            }

            if (vm.registrations.length == 0)
                vm.cartIsVisible = false;
        };

        var emptyCart = function () {
            var length = this.vm.registrations.length;
            vm.registrations.splice(0, length);

            var chargeLength = this.surcharges.length;
            surcharges.splice(0, chargeLength);

            vm.cartIsVisible = false;
        };

        var getSubTotal = function () {
            var me = this;
            var price = 0,
                length = this.registrations.length,
                i = 0;

            for (; i < length; i++) {
                price += Math.round((me.registrations[i].fee) * parseFloat(me.registrations[i].quantity) * 100) / 100;
            }
            return price;
        };

        var getTotalPrice = function () {
            var me = this;
            var price = 0,
                chargelength = me.surcharges.length,
                i = 0;

            for (; i < chargelength; i++) {
                price += parseFloat(me.surcharges[i].amount);
            }

            var reglength = me.registrations.length;
            i = 0;
            for (; i < reglength; i++) {
                price += parseFloat(me.registrations[i].fee) * parseFloat(me.registrations[i].quantity);
            }

            return price;
        };

        var setGiftCardSurcharge = function(value){
            var index = null;
            for(var i = 0; i < surcharges.length; i++){
                if(surcharges[i].chargeType == "giftcard"){
                    index = i;
                    break;
                }
            }

            if(index == null){
                // chargeDesc, amount, chargeType, listId, partId, couponId, context
                surcharges.push(new surcharge("Gift card surcharge", -1*value, "giftcard", 0, vm.currentPartId, 0, null));
                index = surcharges.length - 1;
            }
        };

        var removeGiftCardSurcharge = function(){
            for(var i = 0; i < surcharges.length; i++){
                if(surcharges[i].chargeType == "giftcard"){
                    surcharges.splice(i, 1);
                    break;
                }
            }
        };

        var setPriceAdjustSurcharge = function(value){
            var index = null;
            for(var i = 0; i < surcharges.length; i++){
                if(surcharges[i].chargeType == "priceadjustment"){
                    index = i;
                    break;
                }
            }

            if(index == null){
                // chargeDesc, amount, chargeType, listId, partId, couponId, context
                surcharges.push(new surcharge("Price adjustment surchage", value, "priceadjustment", 0, vm.currentPartId, 0, null));
                index = surcharges.length - 1;
            }
        };

        var removePriceAdjustSurcharge = function(){
            for(var i = 0; i < surcharges.length; i++){
                if(surcharges[i].chargeType == "priceadjustment"){
                    surcharges.splice(i, 1);
                    break;
                }
            }
        };

        var serializeSurcharges = function(orig){
            var send = [];
            if(!orig)
                orig = surcharges
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
            serializeSurcharges : serializeSurcharges,
			
			// setters
			setCurrentParticipant : setCurrentParticipant,
			setCurrentEventure : setCurrentEventure,
			setCurrentEventureList : setCurrentEventureList,
			
			currentParticipant : currentParticipant,
			currentEventure : currentEventure,
			currentEventureList : currentEventureList,
        };
        return vm;
	}

	angular.module("evReg").service("CartModel", ["$http", "$routeParams", "datacontext", "logger", "config", Cart]);

})();
