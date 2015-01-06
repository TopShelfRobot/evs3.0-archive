(function () {
    'use strict';

    var controllerId = "TermsModalInstance";

    function Controller($scope, $modalInstance, cart, common) {

        var promises = [];

        $scope.termsText = cart.regSettings.termsText;
        $scope.refundsText = cart.regSettings.refundsText;



        common.activateController(promises, controllerId);

        $scope.ok = function () {
            $modalInstance.close();
        };

    }

    angular.module("evReg").controller(controllerId, ['$scope', '$modalInstance', 'CartModel', 'common',  Controller]);

})();