(function(){

    function Service($q){
        //var customerPublishableCode = owner().stripePublishableKey();

        //This identifies your website in the createToken call below
        //Stripe.setPublishableKey(customerPublishableCode);

        var service = {};

        service.createToken = function(form){
            console.log("form:", form);
            var response = {
                error : null,
                //error.message = "Don't be a dummy!",
                id : "aweoijh2345oiert5jkadgf"
            };
            return $q.when(response.id);
        }

        return service;
    }

    angular.module("app").service("StripeService", ["$q", Service]);

})();
