(function () {
    'use strict';

    var controllerId = "TermsModalInstance";

    function Controller($scope, $modalInstance, common) {

        var promises = [];

        common.activateController(promises, controllerId);

        $scope.ok = function () {
            $modalInstance.close();
        };

    }

    angular.module("evReg").controller(controllerId, ['$scope', '$modalInstance', 'common',  Controller]);

})();