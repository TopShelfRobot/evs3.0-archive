(function () {
  'use strict';

  var controllerId = 'setaddon';
  angular.module('app').controller(controllerId, ['$q', '$routeParams',
                '$upload', '$http', '$timeout', '$location', 'common',
                'datacontext', 'config', setaddon]);

  function setaddon($q, $routeParams,
    $upload, $http, $timeout, $location, common,
    datacontext, config) {

    var getLogFn = common.logger.getLogFn;
    var log = getLogFn(controllerId);

    var vm = this;
    vm.title = 'Create An Addon';
    vm.addonId = $routeParams.addonId || 0;

    vm.ownerId = 1;

    vm.addon = {};
    vm.eventures = [];
    vm.listings = [];

    activate();

    function activate() {
      common.activateController(getAddon(), getEventures(), controllerId)
        .then(function () {
          //log('Activated set addon');
        });
    }

    function getAddon() {
      if (vm.addonId > 0) {
        return datacontext.surcharge.getAddonById(vm.addonId)
          .then(function (data) {
            vm.addon = data;
            return vm.addon;
          });
      } else {
        vm.addon = datacontext.surcharge.createAddon();
        return vm.addon;
      }
    }

    function getEventures() {
      return datacontext.eventure.getEventuresByOwnerId(vm.ownerId)
        .then(function (data) {
          vm.eventures = data;
          return vm.eventures;
        });
    }

    vm.upload = function (file) {
      vm.eventure.imageFileName = file[0].name;
      file.upload = $upload.upload({
        url: config.remoteApiName + 'image',
        method: 'POST',
        headers: {
          'my-header': 'my-header-value'
        },
        data: {
          aaa: 'aaa'
        },
        sendObjectsAsJsonBlob: false,
        file: file,
        fileFormDataName: 'myFile',
      });

      file.upload.then(function (response) {
        $timeout(function () {
          file.result = response.data;
        });
      }, function (response) {
        if (response.status > 0) {
          vm.errorMsg = response.status + ': ' + response.data;
        }
      });

      file.upload.progress(function (evt) {
        // Math.min is to fix IE which reports 200% sometimes
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });

      file.upload.xhr(function (xhr) {
        // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
      });
    };

    vm.cancel = function () {
      return datacontext.cancel()
        .then(complete);

      function complete() {
        $location.path('/#'); //Where does this live?
      }
    };

    vm.saveAndNav = function () {
      return datacontext.save()
        .then(complete);

      function complete() {
        $location.path('/#'); //Where does this live?
      }
    };

  }
})();
