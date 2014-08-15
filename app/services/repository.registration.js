(function () {
    'use strict';

    var serviceId = 'repository.registration';

    angular.module('app').factory(serviceId,
        ['breeze', 'config', 'repository.abstract', repositoryRegistration]);

    function repositoryRegistration(breeze, config, abstractRepository) {
        var entityName = 'registration';
        //var entityNames = model.entityNames;
        var entityQuery = breeze.EntityQuery;
        var predicate = breeze.Predicate;

        //only creating on demand - using ctor
        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            // Exposed data access functions
            this.getAll = getAll;
            this.createTransfer = createTransfer;
            this.getTransferById = getTransferById;
            this.getTransferInfoById = getTransferInfoById;
            this.getRegistrationById = getRegistrationById;
            this.getRegEditDisplayInfoById = getRegEditDisplayInfoById;
        }

        // Allow this repo to have access to the Abstract Repo's functions,
        // then put its own Ctor back on itself.
        Ctor.prototype = new abstractRepository(Ctor);
        Ctor.prototype.constructor = Ctor;
        abstractRepository.extend(Ctor);

        return Ctor;

        function getAll() {
            var self = this;
            return entityQuery.from('ZZZ')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        }
        

       function getRegistrationById(registrationId, registrationObservable) {

            var query = entityQuery.from('Registrations')
                .where('id', '==', registrationId);

            return manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }

        function getRegEditDisplayInfoById(registrationId) {

            var query = entityQuery.from('GetRegEditDisplayInfo')
                .withParameters({
                    id: registrationId
                });

            return manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }

        function createTransfer(regId, oldListId, newListId, answerId, partId) {
            return manager.createEntity('EventureTransfer',
                { registrationId: regId, eventureListIdFrom: oldListId, eventureListIdTo: newListId, stockAnswerSetId: answerId, isComplete: false, participantId: partId, dateCreated: moment().format("MM/DD/YYYY") });
        }

        function getTransferInfoById(transferId) {
            var query = entityQuery.from('GetTransferInfo')
                .withParameters({
                    id: transferId
                });

            return manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }

        function getTransferById(id) {
            var query = entityQuery.from('EventureTransfers')
                .where('id', '==', id);

            return manager.executeQuery(query)
               .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }
    }
})();