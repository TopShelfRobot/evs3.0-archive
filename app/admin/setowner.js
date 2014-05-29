define(['services/logger', 'services/datacontext', 'durandal/plugins/router', 'config'],   //, 'viewmodels/shared/debug'

    function (logger, datacontext, router, config) {

       var owner = ko.observableArray();

        var activate = function () {
            //logger.log('test activating.', null, 'test', true);
            return datacontext.getOwnerById(config.ownerId, owner);
        };
        
        var clickSave = function () {
            //logger.log('next', null, 'test', true);
            save();
            alert('Your changes have been saved!');
        };

        var save = function () {
            //isSaving(true);
            //logger.log('called save', null, 'test', true);
            return datacontext.saveChanges()
                .fin(complete);

            function complete() {
                //isSaving(false);
                //logger.log('saved!', null, 'test', true);
            }
        };

        var clickRandomFunction = function () {

            var apiUrl = "/api/Mail/SendMockingbirdWelcomeEmail/";    //mjb
            
            logger.log('api: ' + apiUrl, null, 'confirm jonsify', true);
            

            //var source = {
            //    'token': token,
            //    'ownerId': config.ownerId,
            //    'transferId': transferId,
            //    'houseId': config.houseId,
            //    'amount': adjustment,
            //    'transferNewListName': transferDisplayData().newList
            //};
            //logger.log('NO error yet' + source, null, 'confirm jonsify', true);

            $.ajax({
                type: "POST",
                dataType: "json",
                url: apiUrl,
                //data: source,
                beforeSend: function (xhr) {
                    // explicitly request JSON
                    xhr.setRequestHeader("Accept", "application/json");
                },
                success: function (result) {

                    alert('success');
                    //alert('post returns success' + result);
                    //$("#overlay").addClass("hidden");
                    ////var receiptUrl = '#registrationEdit/' + transfer().registrationId;
                    ////router.navigateTo(receiptUrl);
                    //var receiptUrl = '#registrationedit/' + transferDisplayData().regId + '/' + transfer().stockAnswerSetId();
                    ////logger.log('receiptUrl: ' + receiptUrl, null, 'confirm', true);
                    //alert("Make sure you update the questions");
                    //router.navigateTo(receiptUrl);

                },
                error: function (xhr, textStatus, errorThrown) {
                    
                    alert('fail');
                    //alert('fail' + errorThrown.responseText);
                    //alert('error4' + textStatus);  //value is error
                    //alert('error5' + errorThrown);  //valiue is internal server erro

                    //var respText = JSON.parse(xhr.responseText);
                    //$form.find('.payment-errors').text(respText.Message);
                    //$("#overlay").addClass("hidden");
                    //$form.find('button').prop('disabled', false);
                }
            });

        };
        
        var viewAttached = function () {
            //logger.log('view attached', null, 'test', true);
           // bindEventToList(view, '.events', gotoDetails);
        };
        
      var vm = {
            activate: activate,
            clickSave: clickSave,
            clickRandomFunction: clickRandomFunction,
            owner: owner,
            viewAttached: viewAttached
        };
        return vm;
   });

