define(['services/logger', 'services/datacontext', 'durandal/plugins/router', 'config'],  //, 'viewmodels/shared/debug'

    function (logger, datacontext, router, config) {

        var eventureList = ko.observable();

        var activate = function (routeData) {
            if (isNaN(routeData.lid)) {
                //create new; set wiz
                config.wizard = true;
                if (config.wizEventureId == 0 || isNaN(config.wizEventureId))  // && (!(isNaN(routeData.lid))))   //setting wiz but actually passed in from create list
                    config.wizEventureId = parseInt(routeData.eid);
                //logger.log('nan?22: ', null, 'list1', true);
                return eventureList(datacontext.createEventureList(config.wizEventureId));
            }
            else {
                //editing
                config.wizard = false;
                config.wizEventureListId = parseInt(routeData.lid);
                return datacontext.getEventureListById(config.wizEventureListId, eventureList);
            }
        };

        var viewAttached = function () {
            //logger.log('view attached', null, 'sl', true);
            //logger.log('instantiate0', null, 'sl', true);
            //$(function () { $("input,select,textarea").not("[type=submit]").jqBootstrapValidation(); });

            $('.form-horizontal').validate({
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                errorElement: 'span',
                errorClass: 'help-block',
                errorPlacement: function (error, element) {
                    if (element.parent('.form-group').length) {
                        error.insertAfter(element.parent());
                    } else {
                        error.insertAfter(element);
                    }
                }
            });

            /*jslint unparam: true */
            /*global window, $ */
            $(function () {
                'use strict';
                // Change this to the location of your server-side upload handler:
                var url = '/Handler.ashx';
                $('.fileupload').fileupload({
                    url: url,
                    dataType: 'json',
                    replaceFileInput: false,
                    done: function (e, data) {
                        $.each(data.result.files, function (index, file) {
                            $('<p/>').text(file.name).appendTo('#files');
                            //document.getElementById('#fileupload').files[0].name;
                        });
                    },
                    progressall: function (e, data) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        $('#progress .progress-bar').css(
                            'width',
                            progress + '%'
                        );
                        var newPath = $('.fileupload').val().replace("C:\\fakepath\\", "");
                        //logger.log('fileupload: ' + $('.fileupload').val(), null, 'ec', true);
                        //logger.log('newPath: ' + newPath, null, 'ec', true);
                        $('.imagePath').val(newPath);
                        eventureList().imageFileName(newPath);
                    }
                }).prop('disabled', !$.support.fileInput)
                    .parent().addClass($.support.fileInput ? undefined : 'disabled');
            });

            //$("#listingdate").datepicker();
            //$("#RegOpen").datepicker();
            //$("#RegClose").datepicker();
        };

        var clickNext = function () {
            //logger.log('clicking......', null, 'sl', true); 
            //$("#validation-errors").text("");

            var form = $(".form-horizontal");
            form.validate();

            if (form.valid())
                saveAndNav();

        };

        var saveAndNav = function () {
            //isSaving(true);
            //logger.log('made it tehis far', null, 'sl', true);
            //if (!eventureList().entityAspect.validateEntity()) {
            //    /* do something about errors */
            //    //logger.log('we have val erros', null, 'sl', true);
            //    var errs = eventureList().entityAspect.getValidationErrors();
            //    var firstErr = errs[0].errorMessage;  //only showing first error;  would be cooler...
            //    $("#validation-errors").text(firstErr);
            //} else {
            //    //logger.log('called save', null, 'sl', true);
             return datacontext.saveChanges()
                    .then(success);

                function success() {
                    //isSaving(false);
                    //logger.log('save complete: ' + eventureList().id(), null, 'sl', true);
                    config.wizEventureListId = eventureList().id(); //mjb this is double duty?
                    //logger.log('save complete: ' + config.wizEventureListId, null, 'sl', true);
                    var url = '#setfee'; //+ eventureList().id();
                    router.navigateTo(url);
                }
            //}
        };

        var vm = {
            activate: activate,
            eventureList: eventureList,
            clickNext: clickNext,
            viewAttached: viewAttached,
            title: 'Event Listing'
        };
        return vm;

    });

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