(function(){

    function Service($q){
        //var customerPublishableCode = owner().stripePublishableKey();

        //This identifies your website in the createToken call below
        //Stripe.setPublishableKey(customerPublishableCode);



        //alert('submitting');
        //var customerPublishableCode = owner().stripePublishableKey();
        //alert('cpc' + customerPublishableCode);
        ////This identifies your website in the createToken call below
        ////Stripe.setPublishableKey('pk_test_bJMgdPZt8B8hINCMgG2vUDy4');
        //Stripe.setPublishableKey(customerPublishableCode);
        ////alert('rellay');
        //$('#payment-form').submit(function (e) {
        //    var $form = $(this);

        //    // Disable the submit button to prevent repeated clicks
        //    $form.find('button').prop('disabled', true);

        //    Stripe.createToken($form, stripeResponseHandler);

        //    // Prevent the form from submitting with the default action
        //    return false;
        //});

        var service = {};

        service.createToken = function(form) {
            console.log("form:", form);
            var response = {
                error: null,
                //error.message = "Don't be a dummy!",
                id: "aweoijh2345oiert5jkadgf"
            };
            return $q.when(response.id);
        };

        return service;
    }

    angular.module("app").service("StripeService", ["$q", Service]);

})();
