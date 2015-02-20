(function () {
    'use strict';

    var controllerId = 'sendemail';
    angular.module('app').controller(controllerId, ['$scope', '$http', 'config', 'common', 'datacontext', sendemail]);

    function sendemail($scope, $http, config, common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Listing Detail';
        vm.ownerId = config.owner.ownerId;
        vm.eventures = [];
        vm.listings = [];
        vm.emailType = 'event';

        activate();

        function activate() {
            onDestroy();
            var promises = [getEvents(), getListings()];

            common.activateController(promises, controllerId)
                .then(function () {
                    //log('Activated Listing Detail View');
                });
        }

        function getEvents() {
            return datacontext.eventure.getEventuresByOwnerId(vm.ownerId)
                .then(function (data) {
					vm.eventures = data;
                    return vm.eventures;
                });
        }

        function getListings() {
            return datacontext.eventure.getEventureListsByOwnerId(vm.ownerId)
                .then(function (data) {
					vm.listings = data;
                    return vm.listings;
                });
        }

        function onDestroy() {
            //alert('destroy my contextttttttt!!!!');
            $scope.$on('$destroy', function () {
                //alert('destroymy contextttttttt!!!!!!!');
                //autoStoreWip(true);
                datacontext.cancel();
            });
        }

        vm.sendMessage = function () {

            console.log('soba farba soba goodba');

               var source = {'message': 'cool messageeeeee',
                    'subject': 'very important stuff',
                };

            $http.post(config.apiPath + "api/mail/SendMassMessage", source)
				.success(function (result) {
				    console.log(result);
				   
				}).error(function (data, status, headers, config) {
				    alert(data);
				})
				.finally(function () {
				    console.log('fin');
				    //$scope.submitDisabled = false;
				});
        };

    }

})();
