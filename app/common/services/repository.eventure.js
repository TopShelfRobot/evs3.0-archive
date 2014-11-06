(function () {
    'use strict';

    var serviceId = 'repository.eventure';

    angular.module('common').factory(serviceId,
        ['model', 'breeze', 'repository.abstract', 'config', repositoryEventure]);

    function repositoryEventure(model, breeze, abstractRepository, config) {
        var entityName = 'Eventure';
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

            this.createEventure = createEventure;
            this.getEventureById = getEventureById;
            this.getEventuresByOwnerId = getEventuresByOwnerId;
            this.getFirstEventureByOwnerId = getFirstEventureByOwnerId;

            this.getEventureListById = getEventureListById;
            this.getEventureListsByEventureId = getEventureListsByEventureId;
            this.getEventureListsByOwnerId = getEventureListsByOwnerId;
            this.getEventureListTypesByOwnerId = getEventureListTypesByOwnerId;
            this.createEventureList = createEventureList;

            this.getEventsGroupedByYearByOwnerId = getEventsGroupedByYearByOwnerId;

            this.getGroupsByEventureListId = getGroupsByEventureListId;
            this.getGroupsActiveByEventureListId = getGroupsActiveByEventureListId;
            this.createGroup = createGroup;
        }

        // Allow this repo to have access to the Abstract Repo's functions,
        // then put its own Ctor back on itself.
        //Ctor.prototype = new AbstractRepository(Ctor);
        //Ctor.prototype.constructor = Ctor;
        abstractRepository.extend(Ctor);

        return Ctor;

        // Formerly known as datacontext.getLookups()
        function getAll() {
            var self = this;
            //alert('really11');
            return entityQuery.from('Eventures')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                //alert('really12121212121212');
                //self.log('Retrieved [Eventure]', data, true);
                return data.results;
            }
        }

        function getEventsGroupedByYearByOwnerId(id) {
            var self = this;
            var query = entityQuery.from('GetEventsGroupedByYearByOwnerId')
                //.where ("id" == 1 );
                .withParameters({ id: id });
                //.orderBy('sortOrder');

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        }

        function getEventureById(id) {
            var self = this;
            var query = entityQuery.from('Eventures')
                .where("id", "==", id);

            return self.manager.executeQuery(query)
               .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }

        function getEventuresByOwnerId(ownerId) {
            var self = this;
            var pred = predicate.create("active", "==", true)
              .and("ownerId", "==", ownerId);

            return entityQuery.from('Eventures')
                .where(pred)
                .orderBy('sortOrder')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        }

        function getFirstEventureByOwnerId() {
            var self = this;
            var pred = predicate.create("ownerId", "==", config.ownerId)
              .and("active", "==", true);

            return entityQuery.from('Eventures')
                 .where(pred)
                 .orderBy("active desc", "id")
                 .take(1)
                 .using(self.manager).execute()
                 .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }

        function createEventure() {
            var self = this;
            return self.manager.createEntity('Eventure', { imageFileName: "", ownerId: config.owner.ownerId });
        }

        function getEventureListById(id) {
            var self = this;
            var query = entityQuery.from('EventureLists')
                .where('id', '==', id)
                .orderBy('sortOrder');

            return self.manager.executeQuery(query)
               .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }

        //var self = this;
        //var pred = predicate.create("active", "==", true)
        //  .and("ownerId", "==", ownerId);

        //return entityQuery.from('Eventures')
        //    .where(pred)
        //    .orderBy('sortOrder')
        //    .using(self.manager).execute()
        //    .then(querySucceeded, self._queryFailed);

        function getEventureListsByEventureId(eventureId) {
            var self = this;
            var query = entityQuery.from('EventureListsByEventureId')
                .withParameters({ eventureId: eventureId })
                .orderBy('sortOrder');

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        }

        function getEventureListsByOwnerId(ownerId) {
            var self = this;
            var query = entityQuery.from('EventureListsByOwnerId')
                .withParameters({ ownerId: ownerId })
                .orderBy('sortOrder');

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        }

        function getEventureListTypesByOwnerId(ownerId) {
            var self = this;
            var query = entityQuery.from('EventureListTypes')
                 .where("ownerId", "==", ownerId);

            return self.manager.executeQuery(query)
               .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        }


        function createEventureList(eventureId) {
            var self = this;
            return self.manager.createEntity('EventureList',
                { eventureId: eventureId });
        }

        function getGroupsByEventureListId(eventureListId) {
            var self = this;
            var query = entityQuery.from('EventureGroups')
                .where('eventureListId', '==', eventureListId)
                .orderBy('sortOrder');

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        }

        function getGroupsActiveByEventureListId(eventureListId) {
            var self = this;
            var query = entityQuery.from('GroupsBelowCapacity')
                 .withParameters({ listId: eventureListId });

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        };

        function createGroup(eventureListId) {
            var self = this;
            return self.manager.createEntity('EventureGroup',
                { eventureListId: eventureListId, capacity: 0, active: true });
        };
    }
})();
