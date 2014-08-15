(function() {
    angular.module("app").service("StripeService", ["$q","config", Service]);
	function Service($q, config) {

		var service = {};

        service.checkout = function (userPaying) {
			
			var deferred = $q.defer();
			
            // build form
            // var form = $('.form-stripe');
            // form.empty();
            // form.attr("action", config.apiPath + '/api/Payment/PostTeam');
            // form.attr("method", "POST");
            // form.attr("style", "display:none;");
            // console.log(userPaying);
            // console.log('from stripe service' + order);
            //this.addFormFields(form, order);
            // $("body").append(form);

            //// ajaxify form
            // form.ajaxForm({
 //                success: function (result) {
 //                    $.unblockUI();
 //                    alert('Order was good nav to receipt number: ' + result);
 //                },
 //                error: function (result) {
 //                    $.unblockUI();
 //                    alert('Error submitting order: ' + result.statusText);
 //                }
 //            });

            var token = function (res) {
                var $input = $('<input type=hidden name=stripeToken />').val(res.id);
                // show processing message and block UI until form is submitted and returns
                $.blockUI({ message: 'Processing order...' });
				
				deferred.resolve(res);
                // submit form
                //form.append($input).submit();
                //this.clearCart = clearCart == null || clearCart;
                //form.submit();
            };

            StripeCheckout.open({
                key: 'pk_test_pGFaKfcKFrOuiR3PNDFsrhey',
                address: false,
                amount: userPaying * 100,  //this.getTotalPrice() * 100, /** expects an integer **/
                currency: 'usd',
                name: 'Eventure Sports',
                description: 'Description',
                panelLabel: 'Checkoutqwq1',
                token: token
            });
			
			return deferred.promise;
        };

        // utility methods
        //service.addFormFields = function (form, data) {
        //    if (data != null) {
        //        $.each(data, function (name, value) {
        //            if (value != null) {
        //                var input = $("<input></input>").attr("type", "hidden").attr("name", name).val(value);
        //                form.append(input);
        //            }
        //        });
        //    }
        //};

		return service;
	}
})();
