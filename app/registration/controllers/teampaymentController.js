(function () {

    function controller($scope, $location, stripe, eventureModel, cartModel) {

        //console.log("cartModel:", cartModel);

        $scope.teamName = cartModel.teamName;

        //$scope.remaining;
        console.log(cartModel.eventureId, cartModel.eventureListId);
        eventureModel.getEventureListItem(cartModel.eventureId, cartModel.eventureListId)
            .then(function (item) {
                if (item)
                    $scope.remaining = item.currentFee - cartModel.currentlyPaid;
            });

        $scope.allowZeroPayment = cartModel.allowZeroPayment;
        // $scope.waiverSigned = cartModel.waiverSigned;

        $scope.errorMessage = "";

        $scope.checkoutStripe = function () {
            // build form
            var form = $('.form-stripe');
            form.empty();
            form.attr("action", 'http://evs30api.eventuresports.info/api/Payment/PostTeam');
            form.attr("method", "POST");
            form.attr("style", "display:none;");
            console.log($scope.userPaying);
            var order = cartModel.order($scope.userPaying);
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
                key: 'pk_test_bJMgdPZt8B8hINCMgG2vUDy4',
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
        $scope.addFormFields = function (form, data) {
            if (data != null) {
                $.each(data, function (name, value) {
                    if (value != null) {
                        var input = $("<input></input>").attr("type", "hidden").attr("name", name).val(value);
                        form.append(input);
                    }
                });
            }
        };
    }

    angular.module("evReg").controller("TeamPaymentController",
        ["$scope", "$location",
            "StripeService", "EventureModel", "RegistrationCartModel",
            controller]);
})();
