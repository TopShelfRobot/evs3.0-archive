(function () {

  var controllerId = 'viewReceipt';

  function Controller($scope, $window, $routeParams, config, datacontext, common) {

    $scope.receipt = {};

    $scope.title = 'Registration Complete';
    $scope.teamGuid = $routeParams.teamGuid;

    var promises = [getTeamInfo()];

    common.activateController(promises, controllerId);


    function getTeamInfo() {
      datacontext.team.GetTeamByGuid($scope.teamGuid)
        .then(function (data) {
          $scope.receipt = data;
          console.log($scope.receipt);
          return $scope.receipt;
        });
    }

  }

  angular.module('evReg').controller(controllerId, ['$scope', '$window',
                '$routeParams', 'config', 'datacontext', 'common', Controller]);
})();
