(function () {

  var controllerId = 'viewReceipt';

  function Controller($scope, $window, $routeParams, config, datacontext, common) {

    $scope.receipt = {};

    $scope.title = 'Registration Complete';
    $scope.teamGuid = $routeParams.teamGuid;
    
    var promises = [datacontext.team.getTeamByGuid($scope.teamGuid)
        .then(function (data) {
            console.log('made it here maaaaaaan222222');
            $scope.receipt = data;
            console.log($scope.receipt);
            console.log('returnikng');
            return $scope.receipt;
        })];

    common.activateController(promises, controllerId);
  }

  angular.module('evReg').controller(controllerId, ['$scope', '$window',
                '$routeParams', 'config', 'datacontext', 'common', Controller]);
})();
