;(function(){

    var controllerId = "AddTeamMember";

    function controller($scope, $window, $routeParams, datacontext, common){

        $scope.teamMemberId = $routeParams.teamMemberId;
        $scope.participant = {
            firstName: '',
            lastName: '',
            gender: '',
            street1: '',
            city: '',
            state: '',
            zip: '',
            phoneMobile: '',
            email: '',
            country: 'US'
        };

        $scope.title = 'Create Your Team Member\'s Participant Profile';

        $scope.date = {
            dateBirth: ''
        };

        var promises = [createTeamMemberProfile()];
        common.activateController(promises, controllerId);

        function createTeamMemberProfile() {
            return $scope.participant = datacontext.participant.createProfile();
        }

        $scope.submit = function(){
            $scope.date.dateBirth = moment($scope.date.dateBirth).toISOString();
            datacontext.save().then(function () {
                console.log('in the first promise');
                datacontext.team.getTeamMemberById($scope.teamMemberId).then(function (data) {
                    console.log('in the second promise');
                    console.log($scope.participant.id);
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
