(function () {
    angular.module("evReg").service("CartModel",
                ["config", Model]);
    function Model(config) {

        var cart = {};
        cart.participantId = null;
        cart.waiverSigned = false;
        cart.teamName = '';
        cart.teamMembers = [];
        cart.teamId = '';
        cart.currentlyPaid = 0;
        cart.allowZeroPayment = false;
        
        cart.teamMemberId = null;
        cart.registrations = [];
        cart.surcharges = [];

        cart.order = function () {
            var order = {
                orderAmount: cart.getTotalPrice(),
                orderHouseId: config.owner.houseId,
                ownerId: config.owner.ownerId,
                teamId: cart.teamId,
                teamMemberId: cart.teamMemberId,
                regs: cart.registrations
            };
            return order;
        };

        cart.addRegistration = function (eventure, eventureList, participant, answers, groupId, group2Id, quantity) {
            var isRegDupe = false;
            if (!config.owner.isDuplicateOrderAllowed) {
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

            if (config.owner.isAddSingleFeeForAllRegs) {
                var feeAmount = 0;
                switch (config.owner.addSingleFeeType) {
                    case 'percent':
                        feeAmount = config.owner.addSingleFeeForAllRegsPercent * regTotalAmount / 100;
                        break;
                    case 'flat':
                        feeAmount = regCount * config.owner.addSingleFeeForAllRegsFlat;
                        break;
                    case 'both':
                        feeAmount = (config.owner.addSingleFeeForAllRegsPercent * regTotalAmount / 100) + (regCount * config.owner.addSingleFeeForAllRegsFlat);
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
            for (var i = 0; i < vm.registrations.length; i++) {
                var current = vm.registrations[i];
                if (current === selectedItem) {
                    vm.registrations.splice(i, 1);
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