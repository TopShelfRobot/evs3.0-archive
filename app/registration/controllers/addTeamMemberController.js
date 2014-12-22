(function(){
    "use strict";
    var controllerId = "AddTeamMemberController";

    function controller($scope, $window, $routeParams, datacontext, common){

        $scope.teamMemberId = $routeParams.teamMemberId;
        $scope.participant = {};

        $scope.title = 'Create Your Team Member\'s Participant Profile';

        $scope.date = {
            dateBirth: ''
        };

        var promises = [createTeamMemberProfile()];
        common.activateController(promises, controllerId);

        function createTeamMemberProfile() {
            datacontext.participant.createProfile().then(function(data){
                $scope.participant = data;
                return $scope.participant;
            });
        }

        $scope.submit = function(){
            $scope.date.dateBirth = moment($scope.date.dateBirth).toISOString();
            datacontext.save().then(function(){
                    datacontext.team.getTeamMemberById().then(function(data) {
                        data.participantId = $scope.participant.id;
                        datacontext.save();
                    });
                $window.history.back();
            });
        };

    }

    angular.module("evReg").controller(controllerId,
        ["$scope", "$window", "$routeParams", "datacontext", "common", controller]);

})();
