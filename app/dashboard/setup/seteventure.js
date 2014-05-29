define(['services/logger', 'services/datacontext', 'durandal/plugins/router', 'config'],  //, 'viewmodels/shared/debug'

    function (logger, datacontext, router, config) {

        var eventure = ko.observable();
        var eventureId;

        var activate = function (routeData) {
            logger.log('test activating.', null, 'ec', true);

            //$('#header').addClass('hidden');

            eventureId = parseInt(routeData.id);
            logger.log('test activating.' + eventureId, null, 'ec', true);
            if (isNaN(eventureId))   //
                config.wizard = true;     //we took this page out of the wizard but wizard=true still indicates a new event
            else
                config.wizard = false;

            if (config.wizard)
                return eventure(datacontext.createEventure());
            else
                return datacontext.getEventureById(eventureId, eventure);  //mjb this is wrong should be id passed in

        };

        var viewAttached = function (view) {
            //logger.log('view attached', null, 'eventures', true);

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
                    if (element.parent('.input-group').length) {
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
                        eventure().imageFileName(newPath);
                    }
                }).prop('disabled', !$.support.fileInput)
                    .parent().addClass($.support.fileInput ? undefined : 'disabled');
            });

            $("#transfercutoff").datepicker();
            $("#DeferralFeeCutoff").datepicker();

            // Create Numeric Boxes from input HTML Element
            $("#DeferralFee").kendoNumericTextBox();
            $("#TransferFee").kendoNumericTextBox();
        };

        var clickNext = function () {
            //logger.log('next', null, 'seteventure', true);
            eventure().ownerId(config.ownerId);

            var form = $(".form-horizontal");
            form.validate();

            if (form.valid())
                saveAndNav();
        };

        var saveAndNav = function () {
            //isSaving(true);
            //need to save charity and groups here too??
            return datacontext.saveChanges(eventure)
                .fin(complete);

            function complete() {
                //isSaving(false);

                //if (config.wizard) 
                //    config.wizEventureId = eventure().id();  //mjb this is double duty

                if (eventure().managed()) {
                    url = '#setclient';
                    router.navigateTo(url);
                }
                else
                    parent.$.fancybox.close(true);
            }
        };

        ko.bindingHandlers.datepicker = {
            init: function (element, valueAccessor, allBindingsAccessor) {
                //initialize datepicker with some optional options
                var options = allBindingsAccessor().datepickerOptions || {};
                $(element).datepicker(options);

                //handle the field changing
                ko.utils.registerEventHandler(element, "change", function () {
                    var observable = valueAccessor();
                    observable($(element).datepicker("getDate"));
                });

                //handle disposal (if KO removes by the template binding)
                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $(element).datepicker("destroy");
                });
            },
            //update the control when the view model changes
            update: function (element, valueAccessor) {
                var value = ko.utils.unwrapObservable(valueAccessor()),
                    current = $(element).datepicker("getDate");

                if (value - current !== 0) {
                    $(element).datepicker("setDate", value);
                }
            }
        };

        var vm = {
            activate: activate,
            eventure: eventure,
            clickNext: clickNext,
            viewAttached: viewAttached
        };
        return vm;
    });

