(function() {
	'use strict';

	var controllerId = 'setlist';
	angular.module('app').controller(controllerId, ['$q', '$routeParams', '$upload', '$http', '$timeout', '$location', 'common', 'datacontext', 'config', setlist]);

	function setlist($q, $routeParams, $upload, $http, $timeout, $location, common, datacontext, config) {

		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(controllerId);

		var vm = this;
		vm.title = 'Eventure Listing';
		vm.listId = $routeParams.listId || 0;
		vm.eventureId = $routeParams.eventureId || 0;

		vm.list = {};
		activate();

		function activate() {
			common.activateController(getEventureList(), controllerId)
				.then(function() {
					vm.list.eventureId = vm.eventureId;
					//log('Activated set list');
				});
		}

		function getEventureList() {

			if (vm.listId > 0) {
				return datacontext.eventure.getEventureListById(vm.listId)
					.then(function(data) {
						//applyFilter();
						return vm.list = data;
					});
			} else {
				return vm.list = datacontext.eventure.createEventureList();
			}
		}

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
			'year-format': "'yy'",
			'starting-day': 1
		};

		vm.formats = ['MM-dd-yyyy', 'yyyy/MM/dd', 'shortDate'];

		vm.format = vm.formats[0];

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

		vm.resetInputFile = function() {
			var elems = document.getElementsByTagName('input');
			for (var i = 0; i < elems.length; i++) {
				if (elems[i].type == 'file') {
					elems[i].value = null;
				}
			}
		};

		vm.saveAndNav = function() {

			return datacontext.save(vm.list)
				.then(complete);

			function complete() {
				$location.path("/" + vm.list.eventureId + "/" + vm.list.id + "/setfee/");
			}
		};

	}
})();





// ﻿define(['services/logger', 'services/datacontext', 'durandal/plugins/router', 'config'],  //, 'viewmodels/shared/debug'
//
//     function (logger, datacontext, router, config) {
//
//         var eventureList = ko.observable();
//
//         var activate = function (routeData) {
//             if (isNaN(routeData.lid)) {
//                 //create new; set wiz
//                 config.wizard = true;
//                 if (config.wizEventureId == 0 || isNaN(config.wizEventureId))  // && (!(isNaN(routeData.lid))))   //setting wiz but actually passed in from create list
//                     config.wizEventureId = parseInt(routeData.eid);
//                 //logger.log('nan?22: ', null, 'list1', true);
//                 return eventureList(datacontext.createEventureList(config.wizEventureId));
//             }
//             else {
//                 //editing
//                 config.wizard = false;
//                 config.wizEventureListId = parseInt(routeData.lid);
//                 return datacontext.getEventureListById(config.wizEventureListId, eventureList);
//             }
//         };
//
//         var viewAttached = function () {
//             //logger.log('view attached', null, 'sl', true);
//             //logger.log('instantiate0', null, 'sl', true);
//             //$(function () { $("input,select,textarea").not("[type=submit]").jqBootstrapValidation(); });
//
//             $('.form-horizontal').validate({
//                 highlight: function (element) {
//                     $(element).closest('.form-group').addClass('has-error');
//                 },
//                 unhighlight: function (element) {
//                     $(element).closest('.form-group').removeClass('has-error');
//                 },
//                 errorElement: 'span',
//                 errorClass: 'help-block',
//                 errorPlacement: function (error, element) {
//                     if (element.parent('.form-group').length) {
//                         error.insertAfter(element.parent());
//                     } else {
//                         error.insertAfter(element);
//                     }
//                 }
//             });
//
//             /*jslint unparam: true */
//             /*global window, $ */
//             $(function () {
//                 'use strict';
//                 // Change this to the location of your server-side upload handler:
//                 var url = '/Handler.ashx';
//                 $('.fileupload').fileupload({
//                     url: url,
//                     dataType: 'json',
//                     replaceFileInput: false,
//                     done: function (e, data) {
//                         $.each(data.result.files, function (index, file) {
//                             $('<p/>').text(file.name).appendTo('#files');
//                             //document.getElementById('#fileupload').files[0].name;
//                         });
//                     },
//                     progressall: function (e, data) {
//                         var progress = parseInt(data.loaded / data.total * 100, 10);
//                         $('#progress .progress-bar').css(
//                             'width',
//                             progress + '%'
//                         );
//                         var newPath = $('.fileupload').val().replace("C:\\fakepath\\", "");
//                         //logger.log('fileupload: ' + $('.fileupload').val(), null, 'ec', true);
//                         //logger.log('newPath: ' + newPath, null, 'ec', true);
//                         $('.imagePath').val(newPath);
//                         eventureList().imageFileName(newPath);
//                     }
//                 }).prop('disabled', !$.support.fileInput)
//                     .parent().addClass($.support.fileInput ? undefined : 'disabled');
//             });
//
//             //$("#listingdate").datepicker();
//             //$("#RegOpen").datepicker();
//             //$("#RegClose").datepicker();
//         };
//
//         var clickNext = function () {
//             //logger.log('clicking......', null, 'sl', true);
//             //$("#validation-errors").text("");
//
//             var form = $(".form-horizontal");
//             form.validate();
//
//             if (form.valid())
//                 saveAndNav();
//
//         };
//
//         var saveAndNav = function () {
//             //isSaving(true);
//             //logger.log('made it tehis far', null, 'sl', true);
//             //if (!eventureList().entityAspect.validateEntity()) {
//             //    /* do something about errors */
//             //    //logger.log('we have val erros', null, 'sl', true);
//             //    var errs = eventureList().entityAspect.getValidationErrors();
//             //    var firstErr = errs[0].errorMessage;  //only showing first error;  would be cooler...
//             //    $("#validation-errors").text(firstErr);
//             //} else {
//             //    //logger.log('called save', null, 'sl', true);
//              return datacontext.save()
//                     .then(success);
//
//                 function success() {
//                     //isSaving(false);
//                     //logger.log('save complete: ' + eventureList().id(), null, 'sl', true);
//                     config.wizEventureListId = eventureList().id(); //mjb this is double duty?
//                     //logger.log('save complete: ' + config.wizEventureListId, null, 'sl', true);
//                     var url = '#setfee'; //+ eventureList().id();
//                     router.navigateTo(url);
//                 }
//             //}
//         };
//
//         var vm = {
//             activate: activate,
//             eventureList: eventureList,
//             clickNext: clickNext,
//             viewAttached: viewAttached,
//             title: 'Event Listing'
//         };
//         return vm;
//
//     });

//ko.bindingHandlers.textDate = {
//    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
//        var value = valueAccessor(),
//            allBindings = allBindingsAccessor(),
//            valueUnwrapped = ko.utils.unwrapObservable(value),
//            pattern = allBindings.datePattern || $.datepicker._defaults.dateFormat,
//            valueFormatted = $.datepicker.formatDate(pattern, valueUnwrapped);

//        $(element).text(valueFormatted);
//    }
//};

//ko.bindingHandlers.datepicker = {
//    init: function (element, valueAccessor, allBindingsAccessor) {
//        var $el = $(element);

//        //initialize datepicker with some optional options
//        var options = allBindingsAccessor().datepickerOptions || {};
//        $el.datepicker(options);

//        //handle the field changing
//        ko.utils.registerEventHandler(element, "change", function () {
//            var observable = valueAccessor();
//            observable($el.datepicker("getDate"));
//        });

//        //handle disposal (if KO removes by the template binding)
//        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
//            $el.datepicker("destroy");
//        });

//    },
//    update: function (element, valueAccessor) {
//        var value = ko.utils.unwrapObservable(valueAccessor()),
//            $el = $(element),
//            current = $el.datepicker("getDate");

//        if (value - current !== 0) {
//            $el.datepicker("setDate", value);
//        }
//    }
//};


//var clickAddNewListing = function () {
//    //logger.log('new listing', null, 'sl', true);
//    save();
//    //create new list
//};
