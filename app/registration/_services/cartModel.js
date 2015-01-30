(function () {
	angular.module("evReg").service("CartModel", ["config", Model]);
	function Model(config) {

		var self = this;

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

			isMultiParticipantDiscountCartRule: false,
			isMultiRegistrationDiscountCartRule: false,

			multiParticipantDiscountAmount: 0,
			multiParticipantDiscountAmountType: 0,
			multiRegistrationDiscountAmount: 0,
			multiRegistrationDiscountAmountType: 0,

			isRegistrationOnProfile:true,
			isTeamRegistrationOnProfile:true,
			isParticipantOnProfile:true,
			isCaptainOnProfile:true,

			eventureName: 'Evenasdfasdfsadt',
			listName: 'List',
			groupName: 'Group',
			partButtonText: 'Select Party!',
			confirmButtonText: 'Complete Registration',
			registerButtonText: 'Register',
			listStatement: 'Select a desired start time',
			termsText: '',
			refundsText: '',
			//stripeLogoPath: '',
			stripeCheckoutButtonText: '',
			stripeOrderDescription: '',

			mainColor: '',
			hoverColor: '',
			highlightColor: '',
			navTextColor: ''
		};

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
				cart.registrations.push(new registration(eventure.displayHeading, eventureList.displayName, participant.email, eventureList.currentFee, eventure.id, eventureList.id, participant.id, participant.firstName + ' ' + participant.lastName, answers, groupId, group2Id, quantity, eventureList.eventureListTypeId, eventureList.isBundle));
				toastr.success('<strong class="text-center">Your Item Was Added To Your Cart!</strong><br><br><a class="btn btn-primary btn-block" href="#/shoppingcart"><i class="fa fa-shopping-cart"></i>&nbsp;View Cart</a>');
			}
		};

		cart.addSurcharge = function (desc, amount, chargeType, listid, partid, couponId) {
		    cart.surcharges.push(new surcharge(desc, amount, chargeType, listid, partid, couponId));
		};

		cart.processCartRules = function () {
			//clear all rules
			cart.surcharges = []
			var regCount = 0;
			var regTotalAmount = 0;

			for (var i = 0; i < cart.registrations.length; i++) {
				var currentReg = cart.registrations[i];
				regTotalAmount = regTotalAmount + currentReg.fee;
				regCount++;
			}

			console.log(cart.regSettings.isAddSingleFeeForAllRegs);
			console.log(cart.regSettings.addSingleFeeType);
			//alert('now');

			if (cart.regSettings.isAddSingleFeeForAllRegs) {
				var feeAmount = 0;
				switch (cart.regSettings.addSingleFeeType) {
					case "0":
						feeAmount = cart.regSettings.addSingleFeeForAllRegsPercent * regTotalAmount / 100;     ///this is a hack fix it //mjb
						break;
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

			if(cart.regSettings.isMultiParticipantDiscountCartRule){
				var items = {}; // hash table with eventureListId and hash of count and cost
				var reg;
				for(var i = 0; i < cart.registrations.length; i++){
					reg = cart.registrations[i];
					if(typeof items[reg.eventureListId] === "undefined"){
						items[reg.eventureListId] = {cnt: 0, cost: 0};
					}
					items[reg.eventureListId].cnt++;
					items[reg.eventureListId].cost += reg.fee;
				}
				for(var key in items){
					if(items[key].cnt > 1){
						// multiParticipantDiscountAmount: 0,
						// multiParticipantDiscountAmountType: 0,
						switch(cart.regSettings.multiParticipantDiscountAmountType){
						case "Percent":  // precentage
							var discount = -1 * items[key].cost * (cart.regSettings.multiParticipantDiscountAmount / 100);
							cart.surcharges.push(new surcharge("percentage based multi-participant discount", discount.toFixed(2), 'cartRule', key, 0, 0));
							break;
						case "Dollars":  // flat rate
							var discount = -1 * cart.regSettings.multiParticipantDiscountAmount;
							cart.surcharges.push(new surcharge("flat fee based multi-participant discount", discount.toFixed(2), 'cartRule', key, 0, 0));
							break;
						}
					}
				}
			}

			if(cart.regSettings.isMultiRegistrationDiscountCartRule){
				var items = {}; // hash table with participantId and hash of count and cost.
				var reg;
				for(var i = 0; i < cart.registrations.length; i++){
					reg = cart.registrations[i];
					if(typeof items[reg.partId] === "undefined"){
						items[reg.partId] = {cnt: 0, cost: 0};
					}
					items[reg.partId].cnt++;
					items[reg.partId].cost += reg.fee;
				}
				for(var key in items){
					if(items[key].cnt > 1){
						// multiRegistrationDiscountAmount: 0,
						// multiRegistrationDiscountAmountType: 0,
						switch(cart.regSettings.multiRegistrationDiscountAmountType){
						case "Percent":  // precentage
							var discount = -1 * items[key].cost * (cart.regSettings.multiRegistrationDiscountAmount / 100);
							cart.surcharges.push(new surcharge("percentage based multi-registration discount", discount.toFixed(2), 'cartRule', key, 0, 0));
							break;
						case "Dollars":  // flat rate
							var discount = -1 * cart.regSettings.multiRegistrationDiscountAmount;
							cart.surcharges.push(new surcharge("flat fee based multi-registration discount", discount.toFixed(2), 'cartRule', key, 0, 0));
							break;
						}
					}
				}
			}
		};

		cart.removeCoupons = function () {
			//mjb need to check for surcharges and remove them
			for (var j = 0; j < cart.surcharges.length; j++) {
				var currCharge = cart.surcharges[j];
				if (currCharge.chargeType == 'coupon') {
					cart.surcharges.splice(j, 1);
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
			var length = this.registrations.length;
			this.registrations.splice(0, length);

			var chargeLength = this.surcharges.length;
			this.surcharges.splice(0, chargeLength);
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
			cart.regSettings.confirmButtonText = data.confirmButtonText;
			cart.regSettings.registerButtonText = data.registerButtonText;
			cart.regSettings.listStatement = data.listStatement;
			cart.regSettings.termsText = data.termsText;
			cart.regSettings.refundsText = data.refundsText;
			cart.regSettings.stripeCheckoutButtonText = data.stripeCheckoutButtonText;
			cart.regSettings.stripeOrderDescription = data.stripeOrderDescription;
			//cart.regSettings.stripeLogoPath = data.stripeLogoPath;

			cart.regSettings.isMultiParticipantDiscountCartRule = data.isMultiParticipantDiscountCartRule;
			cart.regSettings.isMultiRegistrationDiscountCartRule = data.isMultiRegistrationDiscountCartRule;

			cart.regSettings.multiParticipantDiscountAmount = data.multiParticipantDiscountAmount;
			cart.regSettings.multiParticipantDiscountAmountType = data.multiParticipantDiscountAmountType;
			cart.regSettings.multiRegistrationDiscountAmount = data.multiRegistrationDiscountAmount;
			cart.regSettings.multiRegistrationDiscountAmountType = data.multiRegistrationDiscountAmountType;

			cart.regSettings.isRegistrationOnProfile = data.isRegistrationOnProfile;
			cart.regSettings.isTeamRegistrationOnProfile = data.isTeamRegistrationOnProfile;
			cart.regSettings.isParticipantOnProfile = data.isParticipantOnProfile;
			cart.regSettings.isCaptainOnProfile = data.isCaptainOnProfile;

			cart.regSettings.name = data.name;
			cart.regSettings.stripePublishableKey = data.stripePublishableKey;
			cart.regSettings.mainColor = data.mainColor;
			cart.regSettings.hoverColor = data.hoverColor;
			cart.regSettings.highlightColor = data.highlightColor;
			cart.regSettings.navTextColor = data.navTextColor;
		};

		function registration(displayEvent, displayList, email, fee, eventureId, eventureListId, partId, name, answers, groupId, group2Id, quantity, eventureListTypeId, isBundle) {
			var me = this;
			me.displayEvent = displayEvent;
			me.displayList = displayList;
			//me.image = image;
			me.email = email;
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
			me.isBundle = isBundle;
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
