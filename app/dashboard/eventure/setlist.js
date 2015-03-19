(function () {
  'use strict';

  var controllerId = 'setlist';
  angular.module('app').controller(controllerId, ['$routeParams', '$timeout', '$location', '$scope', '$upload', 'common', 'datacontext', 'config', setlist]);

  function setlist($routeParams, $timeout, $location, $scope, $upload, common, datacontext, config) {

    var getLogFn = common.logger.getLogFn;
    var log = getLogFn(controllerId);

    var vm = this;
    vm.title = 'Eventure Listing';
    vm.listId = $routeParams.listId || 0;
    vm.eventureId = $routeParams.eventureId;
    vm.ownerId = config.owner.ownerId;

    vm.list = {};
    vm.listTypes = [];
    
    vm.selectedLists = [];
    vm.bundledListItems = new kendo.data.ObservableArray([]);
    vm.bundledListOptions = {
      placeholder: 'Select listing...',
      dataTextField: 'name',
      dataValueField: 'id',
      valuePrimitive: true,
      autoBind: false,
    };

    activate();

    function activate() {
      onDestroy();
      common.activateController(getEventureList(), getListTypes(), controllerId)
        .then(function () {
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
          .then(function (data) {
            vm.list = data;
            vm.list.eventureListBundles.forEach(function(item){
              vm.selectedLists.push(item.childEventureListId);
            });
            return getEventureListsByEventureId(vm.list.eventureId);
          });
      } else {
        vm.list = datacontext.eventure.createEventureList();
        vm.list.eventureId = vm.eventureId;
        return getEventureListsByEventureId(vm.list.eventureId);
      }
    }

    function getEventureListsByEventureId() {
      return datacontext.eventure.getEventureListsByOwnerId(vm.ownerId)
        .then(function (data) {
          return multiSelect(data);
        });
    }

    function multiSelect(listings) {
      for (var i = 0; i < listings.length; i++) {
        vm.bundledListItems.push({
          name: listings[i].name,
          id: listings[i].id
        });
      }
      return initializeMultiSelect();
    }
    
    function initializeMultiSelect(){
      vm.bundledListReady = true;
      return null;
    }
    
    vm.today = function () {
      vm.list.dateEventureList = new Date();
      vm.list.dateBeginReg = new Date();
      vm.list.dateEndReg = new Date();
    };

    vm.today();

    vm.open = function ($event, open) {
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

    vm.cancel = function () {
      $location.path('/eventuredetail/' + vm.list.eventureId);
    };

    function onDestroy() {
      $scope.$on('$destroy', function () {
        datacontext.cancel();
      });
    }

    vm.upload = function (file) {
      vm.list.imageFileName = file[0].name;
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

    vm.saveAndNav = function () {
      
      while(vm.list.eventureListBundles && vm.list.eventureListBundles.length > 0){
        var toDelete = vm.list.eventureListBundles.pop();
        toDelete.entityAspect.setDeleted();
      }
      if(vm.list.isBundle){
        vm.selectedLists.forEach(function(item){
          var b = datacontext.eventure.createBundleItem();
          // b.eventureListId = vm.listId;
          b.childEventureListId = item;
          vm.list.eventureListBundles.push(b);
        });
      }

      return datacontext
        .save()
        .then(complete);

      function complete() {
        $location.path('/' + vm.list.eventureId + '/' + vm.list.id + '/setfee/');
      }
    };

  }
})();
