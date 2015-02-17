(function () {
	'use strict';

	var controllerId = 'seteventure';
	angular.module('app').controller(controllerId, ['$routeParams', '$timeout', '$location', '$scope', '$upload', 'common', 'datacontext', 'config', seteventure]);

	function seteventure($routeParams, $timeout, $location, $scope, $upload, common, datacontext, config) {

		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		var vm = this;
		vm.title = 'Eventure';
		vm.eventureId = $routeParams.eventureId || 0;

		//log('val is: ' + vm.eventureId);

		vm.eventure = {};
		activate();

		function activate() {
			onDestroy();
			common.activateController(getEventure(), controllerId)
				.then(function () {
					//log('Activated set eventure');
				});
		}

		function getEventure() {

			if (vm.eventureId > 0) {
				return datacontext.eventure.getEventureById(vm.eventureId)
					.then(function (data) {
						//applyFilter();
						vm.eventure = data;
						return vm.eventure;
					});
			} else {
				vm.eventure = datacontext.eventure.createEventure();
				return vm.eventure;
			}
		}

		vm.cancel = function () {
			$location.path("/eventurecenter");
		};

		function onDestroy() {
			//alert('destroy my contextttttttt!!!!');
			$scope.$on('$destroy', function () {
				//alert('destroymy contextttttttt!!!!!!!');
				//autoStoreWip(true);
				datacontext.cancel();
			});
		}

		vm.upload = function (file) {
			vm.eventure.imageFileName = file[0].name;
			file.upload = $upload.upload({
				url: config.remoteApiName + 'image',
				method: 'POST',
				headers: {
					'my-header' : 'my-header-value'
				},
				data: {aaa:'aaa'},
				sendObjectsAsJsonBlob: false,
				file: file,
				fileFormDataName: 'myFile',
			});

			file.upload.then(function(response) {
				$timeout(function() {
					file.result = response.data;
				});
			}, function(response) {
				if (response.status > 0) {
					vm.errorMsg = response.status + ': ' + response.data;
				}
			});

			file.upload.progress(function(evt) {
				// Math.min is to fix IE which reports 200% sometimes
				file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			});

			file.upload.xhr(function(xhr) {
				// xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
			});
		};

		vm.saveAndNav = function () {
			return datacontext.save(vm.eventure)
				.then(complete);

			function complete() {
				$location.path("/eventurecenter");
			}
		};

		vm.today = function () {
			vm.eventure.dateEventure = new Date();
			vm.eventure.dateTransfer = new Date();
			vm.eventure.dateDeferral = new Date();
		};

		vm.today();

		vm.open = function ($event, open) {
			$event.preventDefault();
			$event.stopPropagation();
			vm[open] = true;
		};

		vm.dateOptions = {
			'year-format': "'yy'",
			'starting-day': 1
		};

		vm.formats = ['MM-dd-yyyy', 'yyyy/MM/dd', 'shortDate'];

		vm.format = vm.formats[0];

	}
})();
