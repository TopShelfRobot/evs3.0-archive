
;(function(){
	
    function Controller(datacontext, logger, cart, router, config) {

        var isTerms = ko.observable(false);
        var isRefund = ko.observable(false);
        var owner = ko.observable();
        var termsText = '';
        var refundsText = '';

        var activate = function () {
            //logger.log('did we activate' + cart.cartItems().length, null, 'quest', true);
            cart.cartIsVisible(false);
            //logger.log('processiong cart rules', null, 'quest', true);
            cart.processCartRules();
            return datacontext.getOwnerById(config.ownerId, owner)
                .then(function () {
                    termsText = owner().termsText();
                    refundsText = owner().refundsText();
                    });
        };

        var viewAttached = function () {
            $('#terms').popover({ title: "Terms and Conditions", html: true, content: function () { msg = '<div id="popover_content_wrapper"><p>' + termsText + '</p></div>'; return $(msg).html(); }, placement: 'auto', container: 'body', trigger: 'click' });
            $('#refund').popover({ title: "Refund Policy", html: true, content: function () { msg = '<div id="popover_content_wrapper"><p>' + refundsText + '</p></div>'; return $(msg).html(); }, placement: 'auto', container: 'body', trigger: 'click' });

            //logger.log('did we activate' + owner().stripePublishableKey(), null, 'confirm', true);
            var customerPublishableCode = owner().stripePublishableKey();

            //This identifies your website in the createToken call below
            //Stripe.setPublishableKey('pk_test_bJMgdPZt8B8hINCMgG2vUDy4');
            Stripe.setPublishableKey(customerPublishableCode);

            $('#payment-form').submit(function (e) {
                var $form = $(this);

                // Disable the submit button to prevent repeated clicks
                $form.find('button').prop('disabled', true);

                Stripe.createToken($form, stripeResponseHandler);

                // Prevent the form from submitting with the default action
                return false;
            });
        };

        var removeCoupons = function () {
            cart.removeCoupons();
        };

        var applyCoupon = function () {
            //logger.log('validating', null, 'confirm', true);

            var couponCode = $("#CouponCode").val();
            var apiUrl = config.apiPath + "/api/Coupon/Post";    //mjb
            var source = {
                'couponCode': couponCode,
                'regs': cart.registrations(),
            };

            $.ajax({
                type: "POST",
                dataType: "json",
                url: apiUrl,
                data: source,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Accept", "application/json");
                },
                success: function (result) {

                    //alert('post returns success_amount:' + result.Amount);
                    //alert('post returns success_couponid:' + result.CouponId);
                    //alert('post returns success_amount:' + result.Message);

                    if (result.Amount != 0) {
                        cart.removeCoupons();
                        cart.addSurcharge('Coupon: ' + couponCode, result.Amount, 'coupon', cart.currentEventureListId(), cart.currentPartId, result.CouponId);
                        $("#coupon-errors").text("");
                    } else {
                        {
                            $("#coupon-errors").text(result.Message);
                        }
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    //if (typeof console === 'object' && typeof console.log === 'function') {
                    //    alert(xhr);
                    //    alert(textStatus);
                    //    alert(errorThrown);
                    //}
                    $("#coupon-errors").text("Coupon Not Found(E1)");
                }
            });
        };

        var stripeResponseHandler = function (status, response) {

            $("#overlay").removeClass("hidden");

            var $form = $('#payment-form');
            //alert('in stripe response handle');
            if (response.error) {
                alert('error on card ' + response.error.message);
                // Show the errors on the form
                //logger.log('error' + response.error.message, null, 'confirm', true);
                $("#overlay").addClass("hidden");
                $form.find('.payment-errors').text(response.error.message);

                $form.find('button').prop('disabled', false);
                //var url = '#receipt';
                //router.navigateTo(url);
            } else {
                //alert('card is approved');
                //logger.log('card is approved', null, 'confirm', true);
                $form.find('.payment-errors').text('');  //clears any previous errors
                // token contains id, last4, and card type
                var token = response.id;
                //alert('tok: ' + token);
                // Insert the token into the form so it gets submitted to the server
                //$form.append($('<input type="hidden" name="stripeToken" />').val(token));
                // and re-submit
                // $form.get(0).submit();

                //logger.log('lets try to  save reg', null, 'confirm', true);

                var apiUrl = config.apiPath + "/api/Payment/Post";    //mjb
                var source = {
                    'orderToken': token,
                    'orderName': config.regLoginName,
                    'orderEmail': config.houseName,
                    'orderAmount': cart.getTotalPrice(),
                    'orderHouseId': config.houseId,
                    'ownerId': config.ownerId,
                    'regs': cart.registrations(),
                    'charges': cart.surcharges()
                };
                //logger.log('NO error yet', null, 'confirm jonsify', true);

                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: apiUrl,
                    data: source,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Accept", "application/json");  // explicitly request JSON
                    },
                    success: function (result) {
                        //alert('post returns success' + result);
                        var receiptUrl = '#receipt';
                        router.navigateTo(receiptUrl);
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        //alert('fail' + errorThrown.responseText);
                        //alert('error4' + textStatus);  //value is error
                        //alert('error5' + errorThrown);  //valiue is internal server erro

                        var respText = JSON.parse(xhr.responseText);
                        $form.find('.payment-errors').text(respText.Message);
                        $("#overlay").addClass("hidden");
                        $form.find('button').prop('disabled', false);
                    }
                });
            }
        };

        var isConfirm = ko.computed(function () {
            return isTerms() && isRefund();
        });

        var vm = {
            activate: activate,
            cart: cart,
            isConfirm: isConfirm,
            isTerms: isTerms,
            isRefund: isRefund,
            stripeResponseHandler: stripeResponseHandler,
            applyCoupon: applyCoupon,
            removeCoupons: removeCoupons,
            //deactivate: deactivate,
            //refresh: refresh,
            viewAttached: viewAttached,
            title: 'Event'
        };
        return vm;

    });
	
	angular.module("evReg").controller("ConfirmController", [Controller]);
})();