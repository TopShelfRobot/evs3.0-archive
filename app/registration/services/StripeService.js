(function () {
    angular.module("evReg").service("StripeService", ["$q", "config", Service]);
    function Service($q, config) {

        var service = {};

        service.checkout = function (userPaying) {

            var deferred = $q.defer();

            var token = function (res) {
                var $input = $('<input type=hidden name=stripeToken />').val(res.id);
                // show processing message and block UI until form is submitted and returns
                $.blockUI({ message: 'Processing order...' });

                deferred.resolve(res);
            };

            StripeCheckout.open({
                key: 'pk_test_pGFaKfcKFrOuiR3PNDFsrhey',
                address: false,
                amount: userPaying * 100,  //this.getTotalPrice() * 100, /** expects an integer **/
                currency: 'usd',
                name: 'Eventure Sports',
                description: 'Description',
                panelLabel: 'Checkout',
                token: token
            });

            return deferred.promise;
        };

        return service;
    }
})();
