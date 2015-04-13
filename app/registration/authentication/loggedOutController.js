(function () {

    'use strict';

    var controllerId = "loggedOutController";

    function controller($scope, common, cart) {

        common.activateController(controllerId);

    }
    angular.module("evReg").controller(controllerId, ["$scope", "common", "CartModel", controller]);
})();
