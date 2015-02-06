
(function () {
  'use strict';

  var controllerId = 'TermsController';

  function Controller($scope, cart, common) {

    $scope.termsText = cart.regSettings.termsText;
    $scope.refundsText = cart.regSettings.refundsText;

    var promises = [];

    common.activateController(promises, controllerId);

  }
  angular.module('evReg').controller(controllerId, ['$scope', 'CartModel', 'common', Controller]);
})();
