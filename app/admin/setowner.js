(function () {
    'use strict';
    var controllerId = 'ownerController';
    angular.module('app').controller(controllerId, ['$location','config', 'common', 'datacontext', ownerController]);

    function ownerController($location, config, common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;

        vm.title = 'app';

        vm.ownerId = config.owner.ownerId
        vm.owner = {};


        activate();

        function activate() {
            var promises = [getOwnerById()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Set Owner View'); });
        }

        function getOwnerById() {
            return datacontext.participant.getOwnerById(vm.ownerId)
                    .then(function(data) {
                        //applyFilter();
                        return vm.owner = data;
                    });
        }

        vm.stripeConnect = function() {
            if (confirm('Are you sure you wish to proceed?')) {
                alert('true');
                //Not sure if you can use $location. Might have to use window.location
                //$location('https://connect.stripe.com/oauth/authorize?response_type=code&scope=read_write&stripe_landing=login&client_id=ca_2JOTAhBu2gVayLgbZaYy8KQXBm2GveXD');
            } else {
                // Do nothing!
                alert('false');
            }
        }

        vm.stripeDevConnect = function() {
            if (confirm('Are you sure you wish to proceed?')) {
                alert('true');
                //Not sure if you can use $location. Might have to use window.location
                //$location('https://connect.stripe.com/oauth/authorize?response_type=code&scope=read_write&stripe_landing=login&client_id=ca_2JOTjDvfxSx9tzuIN9f5ZCLELpfdgJdn');
            } else {
                // Do nothing!
                alert('false');
            }
        }

        //File Upload
        vm.fileReaderSupported = window.FileReader != null;
        vm.uploadRightAway = true;
        vm.changeAngularVersion = function() {
            window.location.hash = vm.angularVersion;
            window.location.reload(true);
        };
        vm.hasUploader = function(index) {
            return vm.upload[index] != null;
        };
        vm.abort = function(index) {
            vm.upload[index].abort();
            vm.upload[index] = null;
        };
        vm.angularVersion = window.location.hash.length > 1 ? window.location.hash.substring(1) : '1.2.0';
        vm.onFileSelect = function($files) {
            vm.selectedFiles = [];
            vm.progress = [];
            if (vm.upload && vm.upload.length > 0) {
                for (var i = 0; i < vm.upload.length; i++) {
                    if (vm.upload[i] != null) {
                        vm.upload[i].abort();
                    }
                }
            }
            vm.upload = [];
            vm.uploadResult = [];
            vm.selectedFiles = $files;
            vm.dataUrls = [];
            for (var i = 0; i < $files.length; i++) {
                var $file = $files[i];
                if (window.FileReader && $file.type.indexOf('image') > -1) {
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL($files[i]);
                    var loadFile = function(fileReader, index) {
                        fileReader.onload = function(e) {
                            $timeout(function() {
                                vm.dataUrls[index] = e.target.result;
                            });
                        }
                    }(fileReader, i);
                }
                vm.progress[i] = -1;
                if (vm.uploadRightAway) {
                    vm.start(i);
                }
            }
        };

        vm.start = function(index) {
            vm.progress[index] = 0;
            vm.errorMsg = null;
            if (vm.howToSend == 1) {
                vm.upload[index] = $upload.upload({
                    url: '/Content/images',
                    method: PUT,
                    headers: {
                        'my-header': 'my-header-value'
                    },
                    data: {
                        myModel: vm.myModel
                    },
                    /* formDataAppender: function(fd, key, val) {
                  if (angular.isArray(val)) {
                                angular.forEach(val, function(v) {
                                  fd.append(key, v);
                                });
                              } else {
                                fd.append(key, val);
                              }
                }, */
                    /* transformRequest: [function(val, h) {
                  console.log(val, h('my-header')); return val + 'aaaaa';
                }], */
                    file: vm.selectedFiles[index],
                    fileFormDataName: 'myFile'
                }).then(function(response) {
                    vm.uploadResult.push(response.data);
                }, function(response) {
                    if (response.status > 0) vm.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                    // Math.min is to fix IE which reports 200% sometimes
                    vm.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                }).xhr(function(xhr) {
                    xhr.upload.addEventListener('abort', function() {
                        console.log('abort complete')
                    }, false);
                });
            } else {
                var fileReader = new FileReader();
                fileReader.onload = function(e) {
                    vm.upload[index] = $upload.http({
                        url: '/Content/images',
                        headers: {
                            'Content-Type': vm.selectedFiles[index].type
                        },
                        data: e.target.result
                    }).then(function(response) {
                        vm.uploadResult.push(response.data);
                    }, function(response) {
                        if (response.status > 0) vm.errorMsg = response.status + ': ' + response.data;
                    }, function(evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        vm.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }
                fileReader.readAsArrayBuffer(vm.selectedFiles[index]);
            }
        };

        vm.saveAndNav = function() {
            return datacontext.save()
                .then(complete);

            function complete() {
                //alert("Changes have been saved.");
            }
        };

        vm.resetInputFile = function() {
            var elems = document.getElementsByTagName('input');
            for (var i = 0; i < elems.length; i++) {
                if (elems[i].type == 'file') {
                    elems[i].value = null;
                }
            }
        };

    }
})();



// define(['services/logger', 'services/datacontext', 'durandal/plugins/router', 'config'],   //, 'viewmodels/shared/debug'

//     function (logger, datacontext, router, config) {

//        var owner = ko.observableArray();

//         var activate = function () {
//             //logger.log('test activating.', null, 'test', true);
//             return datacontext.getOwnerById(config.ownerId, owner);
//         };

//         var clickSave = function () {
//             //logger.log('next', null, 'test', true);
//             save();
//             alert('Your changes have been saved!');
//         };

//         var save = function () {
//             //isSaving(true);
//             //logger.log('called save', null, 'test', true);
//             return datacontext.save()
//                 .fin(complete);

//             function complete() {
//                 //isSaving(false);
//                 //logger.log('saved!', null, 'test', true);
//             }
//         };

//         var clickRandomFunction = function () {

//             var apiUrl = "/api/Mail/SendMockingbirdWelcomeEmail/";    //mjb

//             logger.log('api: ' + apiUrl, null, 'confirm jonsify', true);


//             //var source = {
//             //    'token': token,
//             //    'ownerId': config.ownerId,
//             //    'transferId': transferId,
//             //    'houseId': config.houseId,
//             //    'amount': adjustment,
//             //    'transferNewListName': transferDisplayData().newList
//             //};
//             //logger.log('NO error yet' + source, null, 'confirm jonsify', true);

//             $.ajax({
//                 type: "POST",
//                 dataType: "json",
//                 url: apiUrl,
//                 //data: source,
//                 beforeSend: function (xhr) {
//                     // explicitly request JSON
//                     xhr.setRequestHeader("Accept", "application/json");
//                 },
//                 success: function (result) {

//                     alert('success');
//                     //alert('post returns success' + result);
//                     //$("#overlay").addClass("hidden");
//                     ////var receiptUrl = '#registrationEdit/' + transfer().registrationId;
//                     ////router.navigateTo(receiptUrl);
//                     //var receiptUrl = '#registrationedit/' + transferDisplayData().regId + '/' + transfer().stockAnswerSetId();
//                     ////logger.log('receiptUrl: ' + receiptUrl, null, 'confirm', true);
//                     //alert("Make sure you update the questions");
//                     //router.navigateTo(receiptUrl);

//                 },
//                 error: function (xhr, textStatus, errorThrown) {

//                     alert('fail');
//                     //alert('fail' + errorThrown.responseText);
//                     //alert('error4' + textStatus);  //value is error
//                     //alert('error5' + errorThrown);  //valiue is internal server erro

//                     //var respText = JSON.parse(xhr.responseText);
//                     //$form.find('.payment-errors').text(respText.Message);
//                     //$("#overlay").addClass("hidden");
//                     //$form.find('button').prop('disabled', false);
//                 }
//             });

//         };

//         var viewAttached = function () {
//             //logger.log('view attached', null, 'test', true);
//            // bindEventToList(view, '.events', gotoDetails);
//         };

//       var vm = {
//             activate: activate,
//             clickSave: clickSave,
//             clickRandomFunction: clickRandomFunction,
//             owner: owner,
//             viewAttached: viewAttached
//         };
//         return vm;
//    });
