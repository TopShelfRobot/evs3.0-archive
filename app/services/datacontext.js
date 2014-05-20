(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId,
        ['common', 'entityManagerFactory', 'model', 'breeze', datacontext]);

    function datacontext(common, emFactory, model, breeze) {
        var Predicate = breeze.Predicate;
        var EntityQuery = breeze.EntityQuery;
        var entityNames = model.entityNames;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');
        var manager = emFactory.newManager();
        var primePromise;
        //var $q = common.$q;
        
        var getOwnerById = function (id) {

            var query = EntityQuery.from('Owners')
                .where('id', '==', id);

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
        
        var getOwnerByGuid = function (guid) {

            var query = EntityQuery.from('Owners')
               .where('ownerGuid', '==', guid);

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
        
        var getOwnerInfo = function (email, ownerId) {
          
            var query = EntityQuery.from('GetOwnerInfo')
                .withParameters({
                    email: email,
                    ownerGuid: ownerId
                });

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
        
        var getEventureById = function (id) {

            var query = EntityQuery.from('Eventures')
                .where("id", "==", id);

            return manager.executeQuery(query)
               .then(querySucceeded)
               .fail(queryFailed);

            function querySucceeded(data) {
                    return data.results[0];
                }
        };
        
        var getEventuresByOwnerId = function (ownerId) {

            var predicate = breeze.Predicate;
            var p1 = new predicate("active", "==", true);
            var p2 = new predicate("ownerId", "==", ownerId);

            var query = EntityQuery.from('Eventures')
            .where(p1.and(p2))
            .orderBy('sortOrder');

            return manager.executeQuery(query)
               .then(querySucceeded)
               .fail(queryFailed);

            function querySucceeded(data) {
                return data.results;
            }

        };
        
        var getFirstEventureByOwnerId = function () {

            var predicate = breeze.Predicate;
            var p1 = new predicate("ownerId", "==", config.ownerId);
            var p2 = new predicate("active", "==", true);

            var query = EntityQuery.from('Eventures')
                 .where(p1.and(p2))
                 .orderBy("active desc", "id")
                .take(1);

            return manager.executeQuery(query)
               .then(querySucceeded)
               .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
        
        var createEventure = function () {
          
            return manager.createEntity('Eventure', { imageFileName: "", ownerId: config.ownerId, dateTransferCutoff: moment().format("MM/DD/YYYY"), dateDeferralCutoff: moment().format("MM/DD/YYYY"), dateEventure: moment().format("MM/DD/YYYY") });
        };
        
        var getEventureListById = function (id) {

            var query = EntityQuery.from('EventureLists')
                .where('id', '==', id)
                .orderBy('sortOrder');

            return manager.executeQuery(query)
               .then(querySucceeded)
               .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }

        };
        
        var getEventureListsByEventureId = function (eventureId) {

            var query = EntityQuery.from('EventureListsByEventureId')
                .withParameters({ eventureId: eventureId })
                .orderBy('sortOrder');

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        };
        
        var getEventureListsByOwnerId = function (ownerId) {

            var query = EntityQuery.from('EventureListsByOwnerId')
                .withParameters({ ownerId: ownerId })
                .orderBy('sortOrder');

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        };
        
        var createEventureList = function (eventureId) {  
        
            return manager.createEntity('EventureList',
                { eventureId: eventureId, dateEventureList: moment().format("MM/DD/YYYY"), dateBeginReg: moment().format("MM/DD/YYYY"), dateEndReg: moment().format("MM/DD/YYYY"), imageFileName: "" });
        };
        
       var getGroupsByEventureListId = function (eventureListId) {
         
            var query = EntityQuery.from('EventureGroups')
                .where('eventureListId', '==', eventureListId)
                .orderBy('sortOrder');

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        };  
        
        var getGroupsActiveByEventureListId = function (eventureListId) {

            var query = EntityQuery.from('GroupsBelowCapacity')
                 .withParameters({ listId: eventureListId });

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        };
        
        var createGroup = function (eventureListId) {
          
            return manager.createEntity('EventureGroup',
                { eventureListId: eventureListId, active: true });
        };
        
         var createTransfer = function (regId, oldListId, newListId, answerId, partId) { 
         
            log('regId: ' + regId, null, 'dc', true);
            log('oldListId: ' + oldListId, null, 'dc', true);
            log('newListId: ' + newListId, null, 'dc', true);
            log('answerId: ' + answerId, null, 'dc', true);
            log('partId: ' + partId, null, 'dc', true);
            return manager.createEntity('EventureTransfer',
                { registrationId: regId, eventureListIdFrom: oldListId, eventureListIdTo: newListId, stockAnswerSetId: answerId, isComplete: false, participantId: partId, dateCreated: moment().format("MM/DD/YYYY") });
        };
        
        var getTransferInfoById = function (transferId) {

            var query = EntityQuery.from('GetTransferInfo')
                .withParameters({
                    id: transferId
                });

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
        
        var getTransferById = function (id) {
          
            var query = EntityQuery.from('EventureTransfers')
                .where('id', '==', id);

            return manager.executeQuery(query)
               .then(querySucceeded)
               .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
        
        var getParticipantById = function (partId) {

            var query = EntityQuery.from('Participants')
                .where('id', '==', partId);

            return manager.executeQuery(query)
               .then(querySucceeded)
               .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
        
        var getParticipantByEmailAddress = function (partEmail, ownerId) {

            var predicate = breeze.Predicate;
            var p1 = new predicate("email", "==", partEmail);
            var p2 = new predicate("ownerId", "==", ownerId);

            var query = EntityQuery.from('Participants')
            .where(p1.and(p2));

            return manager.executeQuery(query)
               .then(querySucceeded)
               .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
        
        var getParticipantsByHouseId = function (houseId) {
          
            var query = EntityQuery.from('ParticipantsByHouseId')
                .withParameters({
                    houseId: houseId
                });

            return manager.executeQuery(query)
               .then(querySucceeded)
               .fail(queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        };
        
        var createParticipant = function (ownerId, email, houseId) {
          
            return manager.createEntity('Participant',
                { dateBirth: moment().format("MM/DD/YYYY"), ownerId: ownerId, email: email, houseId: houseId, country: "US" });
        };
        
         var getRegistrationById = function (registrationId, registrationObservable) {
           
            var query = EntityQuery.from('Registrations')
                .where('id', '==', registrationId);

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
        
         var getRegEditDisplayInfoById = function (registrationId) {

            var query = EntityQuery.from('GetRegEditDisplayInfo')
                .withParameters({
                    id: registrationId
                });

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
        
        var getAddonsByEventureId = function (eventureId) {
            
            var predicate = breeze.Predicate;
            var p1 = new predicate("addonTypeLinkId", "==", eventureId);
            var p2 = new predicate("addonType", "==", 'eventfee');
            var p3 = new predicate("active", "==", true);

            var query = EntityQuery.from('Addons')
            .where(predicate.and([p1, p2, p3]));

            return manager.executeQuery(query)
               .then(querySucceeded)
               .fail(queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        };
        
        var getAddonsByEventureListId = function (eventureListId) {

            var predicate = breeze.Predicate;
            var p1 = new predicate("addonTypeLinkId", "==", eventureListId);
            var p2 = new predicate("addonType", "==", 'listfee');
            var p3 = new predicate("active", "==", true);

            var query = EntityQuery.from('Addons')
            .where(predicate.and([p1, p2, p3]));

            return manager.executeQuery(query)
               .then(querySucceeded)
               .fail(queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        };
        
        var getAddonById = function (addonId) {
          
            var query = EntityQuery.from('Addons')
                .where('id', '==', addonId);

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
        
        var createAddon = function (ownerId) {
            return manager.createEntity('Addon', { addonType: 'eventfee', ownerId: ownerId });
        };
        
        var getCouponById = function (couponId) {
          
            var query = EntityQuery.from('Coupons')
                .where('id', '==', couponId);

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
        
        var createCoupon = function (ownerId) {
          
            return manager.createEntity('Coupon', { dateStart: moment().format("MM/DD/YYYY"), dateEnd: moment().format("MM/DD/YYYY"), couponType: 'owner', ownerId: ownerId });
        };
        
        var validateCoupon = function (couponCode, participantId, eventureListId) {
          
            var query = EntityQuery.from('ValidateCoupon')
                .withParameters({
                    couponCode: couponCode,
                    participantId: participantId,
                    eventureListId: eventureListId
                });

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
        
        var getFeeSchedulesByEventureListId = function (eventureListId) {

            var query = EntityQuery.from('FeeSchedules')//;
                .where('eventureListId', '==', eventureListId);

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        };
        
        var createFeeSchedule = function () {
            return manager.createEntity('FeeSchedule', { dateBegin: moment().format("MM/DD/YYYY") });
        };
        
        var getReportsByOwnerId = function(ownerId) {

            var predicate = breeze.Predicate;
            var p1 = new predicate("active", "==", true);
            var p2 = new predicate("ownerId", "==", ownerId);
            var query = EntityQuery.from('Reports')
            .where(p1.and(p2));

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        };
        
        var getStockAnswerSetByEventureListId = function (eventureListId) {
          
            var query = EntityQuery.from('StockAnswerSets')
                .where('registrationId', '==', eventureListId);

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
        
        var getStockAnswerSetByRegistrationId = function (stockAnswerSetId) {

            var query = EntityQuery.from('StockAnswerSets')
                .where('id', '==', stockAnswerSetId);

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
        
        var getStockQuestionSetByEventureListId = function (eventureListId) {
          
            var query = EntityQuery.from('StockQuestionSets')
                .where('eventureListId', '==', eventureListId);

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
        
        var getStockQuestionSetByRegistrationId = function (registrationId) {
          
            var query = EntityQuery.from('StockQuestionSets')
                .where('registrationId', '==', registrationId);

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
        
        var createStockQuestionSet = function (eventureListId) {
          
            return manager.createEntity('StockQuestionSet', { eventureListId: eventureListId });
        };
        
        var getExpensesByEventureId = function (eventureId) {

            var query = EntityQuery.from('Expense')
                .where('eventureId', '==', eventureId);

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        };
        
        var createExpense = function (eventureId) {
          
            return manager.createEntity('EventureExpense', { eventureId: eventureId });
        };
        
        var createResourceItem = function (resourceId) {
          
            return manager.createEntity('ResourceItem', { resourceId: resourceId, ownerId: config.ownerId, active: true });
        };
        
        var getResourceItemById = function (resourceItemId) {
          
            var query = EntityQuery.from('ResourceItems')
            .where('id', '==', resourceItemId);

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
        
        var getResourceServicesByOwnerId = function (ownerId) {

            var query = EntityQuery.from('GetResourceServicesByOwnerId')
                .withParameters({ id: ownerId });

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        };
        
        var getResourceById = function (resourceId) {
          
            var query = EntityQuery.from('resources')
                .where('id', '==', resourceId);

            return manager.executeQuery(query)
               .then(querySucceeded)
               .fail(queryFailed);

            function querySucceeded(data) {
               return data.results[0];
            }
        };
        
         var getResourcesByOwnerId = function (ownerId) {
           
            var query = EntityQuery.from('resources')
                .where('ownerId', '==', ownerId);

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        };
        
         var createResourceItemCategory = function () {
           
            return manager.createEntity('ResourceItemCategory', { ownerId: config.ownerId });
        };

        var createResource = function () {
            return manager.createEntity('Resource', { ownerId: config.ownerId });
        };
        
        var getResourceItemCategoriesByOwnerId = function (ownerId, isOnlyActive) {

            var predicate = breeze.Predicate;
            var p1 = new predicate("ownerId", "==", ownerId);

            var query;
            if (isOnlyActive) {
                var p2 = new predicate("active", "==", true);
                query = EntityQuery.from('ResourceItemCategories')
                .where(p1.and(p2));
            } else {
                {
                    query = EntityQuery.from('ResourceItemCategories')
                        .where(p1);
                }
            }

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        };
        
         var getResourceItemsByOwnerId = function (ownerId) {
           
            var predicate = breeze.Predicate;
            var p1 = new predicate("active", "==", true);
            var p2 = new predicate("ownerId", "==", ownerId);

            var query = EntityQuery.from('ResourceItems')
           .where(p1.and(p2));

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        };
        
        var getClientResourcesByOwnerId = function (ownerId, resouceType) {

            var predicate = breeze.Predicate;
            var p1 = new predicate("resourceType", "==", resouceType);
            var p2 = new predicate("ownerId", "==", ownerId);

            var query = EntityQuery.from('Resources')
                .where(p1.and(p2));

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        };
        
        var getEventureServicesByEventureId = function (eventureId) {
           
            var query = EntityQuery.from('EventureServices')
                .where('eventureId', '==', eventureId);

            return manager.executeQuery(query)
               .then(querySucceeded)
               .fail(queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        };
        
        var createEventureService = function (eventureId) { 
        
            return manager.createEntity('EventureService',
                { eventureId: eventureId, active: true });
        };
        
        var getClientById = function (id) {

            var query = EntityQuery.from('Clients')
                .where('id', '==', id);

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }

        };
        
        var getOrderById = function (Id) {

            var query = EntityQuery.from('OrderById')
                .withParameters({ id: Id });

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
        
          var getOrderByRegistrationId = function (regId) {

            var query = EntityQuery.from('OrderByRegistrationId')
                .withParameters({ id: regId });

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
        
        var createPlanItem = function (eventureId) {
           
            return manager.createEntity('EventurePlanItem',
                { eventureId: eventureId, dateDue: moment().format("MM/DD/YYYY") });
        };

        var getPlanItemById = function (planItemId) {

            var query = EntityQuery.from('EventurePlanItems')
                .where('id', '==', planItemId);

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
        
        var getRegDataByOwnerId = function (ownerId) {
          
            var query = EntityQuery.from('GetRegsRevByOwner')
                .withParameters({
                    id: ownerId
                });

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
        
        var getCapacityByOwnerId = function (ownerId) {
          
            var query = EntityQuery.from('GetCapacityByOwnerId')
                .withParameters({
                    id: ownerId
                });

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
        
        var getCapacityByEventureListId = function (eventureListId) {
          
            var query = EntityQuery.from('GetCapacityByEventureListId')
                .withParameters({
                    id: eventureListId
                });

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
        
        var getCapacityByEventureId = function (eventureId) {
          
            var query = EntityQuery.from('GetCapacityByEventureId')
                .withParameters({
                    id: eventureId
                });

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
                
        var getTrendsByEventId = function (id) {

            var query = EntityQuery.from('GetTrendsByEventId')
                .withParameters({
                    id: id
                });

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
        
         //generic
        function saveEntity(masterEntity) {
            return manager.saveChanges()
                        .fail(saveFailed);

            function saveFailed(error) {
                var msg = 'Error saving ' +
                    describeSaveOperation(masterEntity) + ': ' +
                    getErrorMessage(error);

                masterEntity.errorMessage(msg);
                // Let user see invalid value briefly before reverting
                setTimeout(function () { manager.rejectChanges(); }, 1000);
                throw error; // so caller can see failure
            }
        }
        
        function describeSaveOperation(entity) {
            var statename = entity.entityAspect.entityState.name.toLowerCase();
            var typeName = entity.entityType.shortName;
            var title = entity.title && entity.title();
            title = title ? (" '" + title + "'") : "";
            return statename + " " + typeName + title;
        }
        
        function getErrorMessage(error) {
            var reason = error.message;
            if (reason.match(/validation error/i)) {
                reason = getValidationErrorMessage(error);
            }
            return reason;
        }
        
        function getValidationErrorMessage(error) {
            try { // return the first error message
                var firstItem = error.entitiesWithErrors[0];
                var firstError = firstItem.entityAspect.getValidationErrors()[0];
                return firstError.errorMessage;
            } catch (e) { // ignore problem extracting error message 
                return "validation error";
            }
        }
        
        function getErrorMessages(error) {
            var msg = error.message;
            if (msg.match(/validation error/i)) {
                return getValidationMessages(error);
            }
            return msg;
        }
        
        function getValidationMessages(error) {
            try {
                //foreach entity with a validation error
                return error.entitiesWithErrors.map(function (entity) {
                    // get each validation error
                    return entity.entityAspect.getValidationErrors().map(function (valError) {
                        // return the error message from the validation
                        return valError.errorMessage;
                    }).join('; <br/>');
                }).join('; <br/>');
            }
            catch (e) { }
            return 'validation error';
        }
        
        var saveChanges = function () {
            return manager.saveChanges()
                .then(saveSucceeded)
                .fail(saveFailed);

            function saveSucceeded(saveResult) {
            }

            function saveFailed(error) {
                var msg = 'Save failed: ' + getErrorMessages(error);
                logError(msg, error);
                error.message = msg;
                throw error;
            }
        };
        
        var primeData = function () {
            return Q.all([getEventures()]);   //Q wraps data call in promise  //, getCartItems()
        };


        var service = {
             //Eventure
            createEventure: createEventure,
            getEventureById: getEventureById,
            getFirstEventureByOwnerId: getFirstEventureByOwnerId,
            getEventuresByOwnerId: getEventuresByOwnerId,

            //EventureList
            createEventureList: createEventureList,
            createGroup: createGroup,
            getEventureListsByEventureId: getEventureListsByEventureId,
            getEventureListsByOwnerId: getEventureListsByOwnerId,
            getEventureListById: getEventureListById,
            getGroupsByEventureListId: getGroupsByEventureListId,
            getGroupsActiveByEventureListId: getGroupsActiveByEventureListId,

            //Transfer
            createTransfer: createTransfer,
            getTransferById: getTransferById,
            getTransferInfoById: getTransferInfoById,

            //participant
            createParticipant: createParticipant,
            getParticipantById: getParticipantById,
            getParticipantsByHouseId: getParticipantsByHouseId,
            getParticipantByEmailAddress: getParticipantByEmailAddress,
            //saveParticipant: saveParticipant,

            //registration
            getRegistrationById: getRegistrationById,
            getRegEditDisplayInfoById: getRegEditDisplayInfoById,
            //createRegistration: createRegistration,
            //saveRegistration: saveRegistration,

            //questions
            createStockQuestionSet: createStockQuestionSet,
            getStockQuestionSetByEventureListId: getStockQuestionSetByEventureListId,
            getStockAnswerSetByEventureListId: getStockAnswerSetByEventureListId,
            getStockQuestionSetByRegistrationId: getStockQuestionSetByRegistrationId,
            getStockAnswerSetByRegistrationId: getStockAnswerSetByRegistrationId,

            //resources
            getResourceById: getResourceById,
            getResourcesByOwnerId: getResourcesByOwnerId,
            getResourceItemCategoriesByOwnerId: getResourceItemCategoriesByOwnerId,
            getClientResourcesByOwnerId: getClientResourcesByOwnerId,
            getClientById: getClientById,
            getResourceServicesByOwnerId: getResourceServicesByOwnerId,
            getEventureServicesByEventureId: getEventureServicesByEventureId,
            createEventureService: createEventureService,
            createResource: createResource,
            createResourceItem: createResourceItem,
            getResourceItemById: getResourceItemById,
            getResourceItemsByOwnerId: getResourceItemsByOwnerId,
            createResourceItemCategory: createResourceItemCategory,

            createPlanItem: createPlanItem,
            getPlanItemById: getPlanItemById,

            getExpensesByEventureId: getExpensesByEventureId,
            createExpense: createExpense,

            getOwnerById: getOwnerById,
            getOwnerByGuid: getOwnerByGuid,
            getOwnerInfo: getOwnerInfo,

            getOrderById: getOrderById,
            getOrderByRegistrationId: getOrderByRegistrationId,

            //charges
            createFeeSchedule: createFeeSchedule,
            createCoupon: createCoupon,
            createAddon: createAddon,
            getAddonById: getAddonById,
            getCouponById: getCouponById,
            getFeeSchedulesByEventureListId: getFeeSchedulesByEventureListId,
            getAddonsByEventureListId: getAddonsByEventureListId,
            getAddonsByEventureId: getAddonsByEventureId,
            validateCoupon: validateCoupon,

            //stats
            getRegDataByOwnerId: getRegDataByOwnerId,
            getCapacityByEventureId: getCapacityByEventureId,
            getCapacityByEventureListId: getCapacityByEventureListId,
            getCapacityByOwnerId: getCapacityByOwnerId,
            getTrendsByEventId: getTrendsByEventId,

            getReportsByOwnerId: getReportsByOwnerId,

            //generic
            primeData: primeData,
            saveChanges: saveChanges,
            
            getPeople: getPeople
        };

        return service;

         //#region Internal methods        
        function configureBreezeManager() {
            breeze.NamingConvention.camelCase.setAsDefault();
            var mgr = new breeze.EntityManager(config.remoteServiceName);
            model.configureMetadataStore(mgr.metadataStore);
            return mgr;
        }

        function queryFailed(error) {
            var msg = 'Error retreiving data. ' + error.message;
            logger.logError(msg, error, system.getModuleId(datacontext), true);
            //logError(msg, error);
            throw error;
        }

        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(datacontext), showToast);
        }

        function logError(msg, error) {
            logger.logError(msg, error, system.getModuleId(datacontext), true);
        }
        //#endregion 

        function getPeople() {
            var people = [
                { firstName: 'John', lastName: 'Papa', age: 25, location: 'Florida' },
                { firstName: 'Ward', lastName: 'Bell', age: 31, location: 'California' },
                { firstName: 'Colleen', lastName: 'Jones', age: 21, location: 'New York' },
                { firstName: 'Madelyn', lastName: 'Green', age: 18, location: 'North Dakota' },
                { firstName: 'Ella', lastName: 'Jobs', age: 18, location: 'South Dakota' },
                { firstName: 'Landon', lastName: 'Gates', age: 11, location: 'South Carolina' },
                { firstName: 'Haley', lastName: 'Guthrie', age: 35, location: 'Wyoming' }
            ];
            return $q.when(people);
        }
        
    }
})();
