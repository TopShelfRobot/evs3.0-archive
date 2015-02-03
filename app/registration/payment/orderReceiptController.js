(function () {
    'use strict';

    var controllerId = 'orderReceipt';

    function Controller($scope, $routeParams, $http, config, datacontext, cart, common) {

        $scope.receipt = {};

        $scope.title = 'Registration Complete';
        //$scope.paymentId = $routeParams.paymentId;
        $scope.orderId = $routeParams.orderId;
        //alert($scope.orderId);

        var promises = [
	        datacontext.registration.getOrderById($scope.orderId)
	            .then(function (data) {
	                $scope.receipt = data;
                    return $scope.receipt;
	            })
        ];

        common.activateController(promises, controllerId);

        $scope.resendReceipt = function () {

          var source = {
            'orderId': $scope.orderId
          };

          console.log('Order Id: ' + $scope.orderId);
          $http.post(config.apiPath + 'api/mail/ResendReceipt', source) //mjb
          .success(function (result) {
            toastr.success('Receipt Sent');
          })
          .error(function (err) {
            toastr.error('Resend failed');
          })
          .finally(function () {
            //Do NOthing
          });
        };

    }

    angular.module('evReg').controller(controllerId, ['$scope', '$routeParams', '$http', 'config', 'datacontext', 'CartModel', 'common', Controller]);
})();
