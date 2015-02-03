(function() {
	'use strict';

	var controllerId = 'setlist';
	angular.module('app').controller(controllerId, ['$routeParams', '$timeout', '$location', '$scope', 'common', 'datacontext', 'config', setlist]);

	function setlist($routeParams, $timeout, $location, $scope, common, datacontext, config) {

		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		var vm = this;
		vm.title = 'Eventure Listing';
		vm.listId = $routeParams.listId || 0;
		vm.eventureId = $routeParams.eventureId;
    vm.ownerId = config.owner.ownerId;

	  vm.list = {};
    vm.listTypes = [];

		activate();

		function activate() {
			onDestroy();
		    common.activateController(getEventureList(), getListTypes(), controllerId)
				.then(function() {
				    //log('Activated list typessssss');
				    //console.log(vm.listTypes);
				    //console.log(vm.list);
				});
		}

		function getListTypes() {
		    return datacontext.eventure.getEventureListTypesByOwnerId(vm.ownerId)
					.then(function (data) {
					    vm.listTypes = data;
					    return vm.listTypes;
					});
	    }

		function getEventureList() {

			if (vm.listId > 0) {
				return datacontext.eventure.getEventureListById(vm.listId)
					.then(function(data) {
						vm.list = data;
						getEventureListsByEventureId(vm.list.eventureId);
						return vm.list;
					});
			} else {
				vm.list = datacontext.eventure.createEventureList();
				vm.list.eventureId = vm.eventureId;
				getEventureListsByEventureId(vm.list.eventureId);
				return vm.list;
			}
		}

		function getEventureListsByEventureId() {
			return datacontext.eventure.getEventureListsByEventureId(vm.list.eventureId)
				.then(function(data) {
					multiSelect(data);
				});
		}

		function multiSelect(listings) {
			// vm.multiSelect.value(listings);
			for(var i = 0; i < listings.length; i++){
				vm.multiSelect.dataSource.add({name: listings[i].name, id: listings[i].id});
			}
		}

		vm.selectedLists = [];
		vm.bundledListOptions = {
			placeholder: 'Select listing...',
			dataTextField: 'name',
			dataValueField: 'id'
		};

		vm.today = function () {
		   vm.list.dateEventureList = new Date();
           vm.list.dateBeginReg = new Date();
           vm.list.dateEndReg = new Date();
		};

		vm.today();

		vm.open = function($event, open) {
			$event.preventDefault();
			$event.stopPropagation();
			vm[open] = true;
		};

		vm.dateOptions = {
			'year-format': '"yy"',
			'starting-day': 1
		};

		vm.formats = ['MM-dd-yyyy', 'yyyy/MM/dd', 'shortDate'];

		vm.format = vm.formats[0];

        vm.cancel = function() {
			$location.path('/eventuredetail/' + vm.list.eventureId);
        };

		function onDestroy() {
			$scope.$on('$destroy', function () {
				datacontext.cancel();
			});
		}

		vm.saveAndNav = function() {

			return datacontext.save(vm.list)
				.then(complete);

			function complete() {
				$location.path('/' + vm.list.eventureId + '/' + vm.list.id + '/setfee/');
			}
		};

	}
})();
