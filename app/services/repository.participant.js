(function () {
    'use strict';

    var serviceId = 'repository.participant';

    angular.module('app').factory(serviceId,
        ['breeze', 'config', 'repository.abstract', repositoryParticipant]);

    function repositoryParticipant(breeze, config, abstractRepository) {
        var entityName = 'particiapant';
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
            this.createParticipant = createParticipant;
            this.getParticipantById = getParticipantById;
            this.getParticipantsByHouseId = getParticipantsByHouseId;
            this.getParticipantByEmailAddress = getParticipantByEmailAddress;
            this.getOwnerById = getOwnerById;
            this.getOwnerByGuid = getOwnerByGuid;
            this.getOwnerInfo = getOwnerInfo;
        }

        // Allow this repo to have access to the Abstract Repo's functions,
        // then put its own Ctor back on itself.
        Ctor.prototype = new abstractRepository(Ctor);
        Ctor.prototype.constructor = Ctor;
        abstractRepository.extend(Ctor);

        return Ctor;

        function getAll() {
            var self = this;
            return self.entityQuery.from('Particiapants')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        }

        function getOwnerById(id) {
            var self = this;
            var query = entityQuery.from('Owners')
                .where('id', '==', id);

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };

        function getOwnerByGuid(guid) {
            var self = this;
            var query = entityQuery.from('Owners')
               .where('ownerGuid', '==', guid);

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };

        function getOwnerInfo(email, ownerId) {
            var self = this;
            var query = entityQuery.from('GetOwnerInfo')
                .withParameters({
                    email: email,
                    ownerGuid: ownerId
                });

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };

        function getParticipantById(partId) {
            var self = this;
            var query = entityQuery.from('Participants')
                .where('id', '==', partId);

            return self.manager.executeQuery(query)
               .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }

        function getParticipantByEmailAddress(partEmail, ownerId) {
            var self = this;
            var pred = predicate.create("email", "==", partEmail)
              .and("ownerId", "==", ownerId);

            return entityQuery.from('Participants')
              .where(pred)
              .using(self.manager).execute()
              .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }

        function getParticipantsByHouseId(houseId) {
            var self = this;
            var query = entityQuery.from('ParticipantsByHouseId')
                .withParameters({
                    houseId: houseId
                });

            return self.manager.executeQuery(query)
               .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        }

        function createParticipant(ownerId, email, houseId) {
            var self = this;
            return self.manager.createEntity('Participant',
                { dateBirth: moment().format("MM/DD/YYYY"), ownerId: ownerId, email: email, houseId: houseId, country: "US" });
        }
    }
})();