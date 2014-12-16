(function () {
    angular.module("evReg").service("CartModel",
                ["config", Model]);
    function Model(config) {

        var cart = {};
        cart.houseId = 0;
        //cart.participantId = 0;
        cart.ownerId = 1;
        cart.waiverSigned = false;
        cart.teamName = '';
        cart.teamMembers = [];
        cart.teamId = '';
        cart.currentlyPaid = 0;
        cart.allowZeroPayment = false;

        cart.navUrl = '';

        cart.teamMemberId = null;
        cart.registrations = [];
        cart.surcharges = [];

        cart.regSettings = {
            isGroupRequired: false,      //this comes from list
            isDuplicateOrderAllowed: false,
            isAddSingleFeeForAllRegs: true,
            addSingleFeeForAllRegsPercent: 6,
            addSingleFeeType: 'percent',
            addSingleFeeForAllRegsFlat: 0,

            eventureName: 'Event',
            listName: 'List',
            groupName: 'Group',
            partButtonText: 'Select Party!',
            listStatement: 'Select a desired start time',
            termsText: '',
            refundsText: '',
            //stripeLogoPath: '',
            stripeCheckoutButtonText: '',
            stripeOrderDescription: ''

        }

        cart.order = function () {
            var order = {
                orderAmount: cart.getTotalPrice(),
                orderHouseId: cart.houseId,
                ownerId: cart.ownerId,
                teamId: cart.teamId,
                teamMemberId: cart.teamMemberId,
                regs: cart.registrations,
                charges: cart.surcharges
            };
            return order;
        };

        cart.configureSettings = function (data) {
           
            cart.regSettings.isDuplicateOrderAllowed = data.isDuplicateOrderAllowed;
            cart.regSettings.isAddSingleFeeForAllRegs = data.isAddSingleFeeForAllRegs;
            cart.regSettings.addSingleFeeForAllRegsPercent = data.addSingleFeeForAllRegsPercent;
            cart.regSettings.addSingleFeeType = data.addSingleFeeType;
            cart.regSettings.addSingleFeeForAllRegsFlat = data.addSingleFeeForAllRegsFlat;

            cart.regSettings.eventureName = data.eventureName;
            cart.regSettings.listName = data.listingName;
            cart.regSettings.groupName = data.groupName;
            cart.regSettings.partButtonText = data.participantButtonText;
            cart.regSettings.listStatement = data.listStatement;
            cart.regSettings.termsText = data.termsText;
            cart.regSettings.refundsText = data.refundsText;
            cart.regSettings.stripeCheckoutButtonText = data.stripeCheckoutButtonText;
            cart.regSettings.stripeOrderDescription = data.stripeOrderDescription;
            //cart.regSettings.stripeLogoPath = data.stripeLogoPath;
            
                  

            cart.regSettings.name = data.name;
            cart.regSettings.stripePublishableKey = data.stripePublishableKey
        };

        cart.addRegistration = function (eventure, eventureList, participant, answers, groupId, group2Id, quantity) {
            var isRegDupe = false;
            if (!cart.regSettings.isDuplicateOrderAllowed) {
                for (var i = 0; i < cart.registrations.length; i++) {
                    var currentReg = cart.registrations[i];

                    if (eventureList.id == currentReg.eventureListId && participant.id == currentReg.partId) {
                        alert('Duplicate Registration.  Removed from cart.');   //wg make toast
                        isRegDupe = true;
                    }
                }
            }
            if (!isRegDupe) {
                cart.registrations.push(new registration(eventure.displayHeading, eventureList.displayName, participant.email, eventureList.currentFee, eventure.id, eventureList.id, participant.id, participant.firstName + ' ' + participant.lastName, answers, groupId, group2Id, quantity, eventureList.eventureListTypeId));
                toastr.success('<strong class="text-center">Your Item Was Added To Your Cart!</strong><br><br><a class="btn btn-primary btn-block" href="#/shoppingcart">View Cart</a>');
            }
        };

        cart.processCartRules = function () {
           //clear all rules
            var temp = [];
            for (var j = 0; j < cart.surcharges.length; j++) {
                var currCharge = cart.surcharges[j];

                if (currCharge.chargeType != 'cartRule') {
                    temp.push(currCharge);
                }
            }
            surcharges = temp;
            var regCount = 0;
            var regTotalAmount = 0;

            for (var i = 0; i < cart.registrations.length; i++) {
                var currentReg = cart.registrations[i];
                regTotalAmount = regTotalAmount + currentReg.fee;
                regCount++;
            }
            //console.log(cart.regSettings.isAddSingleFeeForAllRegs);
            //console.log(cart.regSettings.addSingleFeeType);

            if (cart.regSettings.isAddSingleFeeForAllRegs) {
                var feeAmount = 0;
                switch (cart.regSettings.addSingleFeeType) {
                    case 'percent':
                        feeAmount = cart.regSettings.addSingleFeeForAllRegsPercent * regTotalAmount / 100;
                        break;
                    case 'flat':
                        feeAmount = regCount * cart.regSettings.addSingleFeeForAllRegsFlat;
                        break;
                    case 'both':
                        feeAmount = (cart.regSettings.addSingleFeeForAllRegsPercent * regTotalAmount / 100) + (regCount * cart.regSettings.addSingleFeeForAllRegsFlat);
                        break;
                    default:
                        feeAmount = 0;
                        break;
                }
                cart.surcharges.push(new surcharge('Online Service Fee', feeAmount.toFixed(2), 'cartRule', 0, 0, 0));
            }
        };

        cart.removeCoupons = function () {
            //mjb need to check for surcharges and remove them
            for (var j = 0; j < surcharges.length; j++) {
                var currCharge = surcharges[j];
                if (currCharge.chargeType == 'coupon') {
                    surcharges.splice(j, 1);
                    break;
                }
            }
        };

        cart.removeRegistration = function (selectedItem) {
            for (var i = 0; i < cart.registrations.length; i++) {
                var current = cart.registrations[i];
                if (current === selectedItem) {
                    cart.registrations.splice(i, 1);
                    break;
                }
            }
        };

        cart.emptyCart = function () {
            var length = this.vm.registrations.length;
            vm.registrations.splice(0, length);

            var chargeLength = this.surcharges.length;
            surcharges.splice(0, chargeLength);
        };

        cart.getTotalPrice = function () {
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


        function registration(displayEvent, displayList, email, fee, eventureId, eventureListId, partId, name, answers, groupId, group2Id, quantity, eventureListTypeId) {
            var me = this;
            me.displayEvent = displayEvent;
            me.displayList = displayList;
            //me.image = image;
            me.Email = email;
            me.fee = fee;
            me.eventureId = eventureId;
            me.eventureListId = eventureListId;
            me.partId = partId;
            me.name = name;
            me.groupId = groupId;
            me.group2Id = group2Id;
            me.answers = answers;
            me.quantity = quantity;
            me.lineTotal = quantity * fee;
            me.eventureListTypeId = eventureListTypeId;
        };

        function surcharge(chargeDesc, amount, chargeType, listId, partId, couponId, context) {
            var me = this;
            me.desc = chargeDesc;
            me.amount = amount;
            me.chargeType = chargeType;
            me.listId = listId;
            me.partId = partId;
            me.couponId = couponId;
        };

        return cart;
    }
})()