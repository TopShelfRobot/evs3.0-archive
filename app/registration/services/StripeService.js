(function() {
    angular.module("app").service("StripeService", ["$q", Service]);
	function Service($q) {

		var service = {};

        service.checkout = function (userPaying, order) {
            // build form
            var form = $('.form-stripe');
            form.empty();
            form.attr("action", 'http://evs30api.eventuresports.info/api/Payment/Post');
            form.attr("method", "POST");
            form.attr("style", "display:none;");
            console.log(userPaying);
            console.log(order);
            this.addFormFields(form, order);
            $("body").append(form);

            //// ajaxify form
            form.ajaxForm({
                success: function (result) {
                    $.unblockUI();
                    alert('Order was good nav to receipt number: ' + result);
                },
                error: function (result) {
                    $.unblockUI();
                    alert('Error submitting order: ' + result.statusText);
                }
            });

            var token = function (res) {
                var $input = $('<input type=hidden name=stripeToken />').val(res.id);
                // show processing message and block UI until form is submitted and returns
                $.blockUI({ message: 'Processing order...' });
                // submit form
                form.append($input).submit();
                //this.clearCart = clearCart == null || clearCart;
                //form.submit();
            };

            StripeCheckout.open({
                key: 'pk_test_pGFaKfcKFrOuiR3PNDFsrhey',
                address: false,
                amount: order.orderAmount * 100,  //this.getTotalPrice() * 100, /** expects an integer **/
                currency: 'usd',
                name: 'Eventure Sports',
                description: 'Description',
                panelLabel: 'Checkout',
                token: token
            });
        };

        // utility methods
        service.addFormFields = function (form, data) {
            if (data != null) {
                $.each(data, function (name, value) {
                    if (value != null) {
                        var input = $("<input></input>").attr("type", "hidden").attr("name", name).val(value);
                        form.append(input);
                    }
                });
            }
        };

		return service;
	}
})();
