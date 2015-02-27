(function () {

    var controllerId = "teamReceipt";

    function Controller($scope, $window, $routeParams, config, datacontext, common) {

      $scope.receipt = {};

      $scope.title = "Registration Complete";
      $scope.registrationId = $routeParams.registrationId;

      var promises = [
         datacontext.team.GetTeamInfoByRegistrationId($scope.registrationId)
             .then(function (data) {
          return $scope.receipt = data;
        })
  ];

      common.activateController(promises, controllerId);


      angular.module('evReg').controller(controllerId, ['$scope', '$window',
                '$routeParams', 'config', 'datacontext', 'common', Controller]);
    })(