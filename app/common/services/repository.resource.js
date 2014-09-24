(function () {
    'use strict';

    var serviceId = 'repository.resource';

    angular.module('common').factory(serviceId,
        ['model', 'breeze', 'config', 'repository.abstract', repositoryResource]);

    function repositoryResource(model, breeze, config, abstractRepository) {
        var entityName = 'Resource';
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

            this.getResourceById = getResourceById;
            this.getResourcesByOwnerId = getResourcesByOwnerId;
            this.createResourceItemCategory = createResourceItemCategory;
            this.createResource = createResource;
            this.getResourceItemCategoriesByOwnerId = getResourceItemCategoriesByOwnerId;
            this.getResourceItemsByOwnerId = getResourceItemsByOwnerId;
            this.getClientResourcesByOwnerId = getClientResourcesByOwnerId;
            this.getEventureServicesByEventureId = getEventureServicesByEventureId;
            this.createEventureService = createEventureService;
            this.getClientById = getClientById;
            this.createPlanItem = createPlanItem;
            this.getPlanItemById = getPlanItemById;
            this.getResourceServicesByOwnerId = getResourceServicesByOwnerId;
            this.createResourceItem = createResourceItem;
            this.getResourceItemById = getResourceItemById;
            this.getExpensesByEventureId = getExpensesByEventureId;
            this.createExpense = createExpense;
        }

        // Allow this repo to have access to the Abstract Repo's functions,
        // then put its own Ctor back on itself.
        Ctor.prototype = new abstractRepository(Ctor);
        Ctor.prototype.constructor = Ctor;
        abstractRepository.extend(Ctor);

        return Ctor;

        // Formerly known as datacontext.getLookups()
        function getAll() {
            var self = this;
            return entityQuery.from('Resources')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        }

        function getResourceById(resourceId) {
            var self = this;
            var query = entityQuery.from('resources')
                .where('id', '==', resourceId);

            return self.manager.executeQuery(query)
               .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }

        function getResourcesByOwnerId(ownerId) {
            var self = this;
            var query = entityQuery.from('resources')
                .where('ownerId', '==', ownerId);

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        }

        function createResourceItemCategory() {
            var self = this;
            return self.manager.createEntity('ResourceItemCategory', { ownerId: config.ownerId });
        }

        function createResource() {
            var self = this;
            return self.manager.createEntity('Resource', { ownerId: config.ownerId });
        }

        function getResourceItemCategoriesByOwnerId(ownerId, isOnlyActive) {
            var self = this;
            var pred; // = predicate.create("ownerId", "==", ownerId);

            if (isOnlyActive) {
                pred = predicate.create("ownerId", "==", ownerId)
                  .and("active", "==", true);

            } else {
                {
                    pred = predicate.create("ownerId", "==", ownerId);
                }
            }
            return entityQuery.from('ResourceItemCategories')
            .where(pred)
            .using(self.manager).execute()
            .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        }

        function getResourceItemsByOwnerId(ownerId) {
            var self = this;
            var pred = predicate.create("active", "==", true)
              .and("ownerId", "==", ownerId);

            return entityQuery.from('ResourceItems')
              .where(pred)
              .using(self.manager).execute()
              .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        }

        function getClientResourcesByOwnerId(ownerId, resouceType) {
            var self = this;
            var pred = predicate.create("resourceType", "==", resouceType)
              .and("ownerId", "==", ownerId);

            return entityQuery.from('Resources')
                .where(pred)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        }

        function getEventureServicesByEventureId(eventureId) {
            var self = this;
            var query = entityQuery.from('EventureServices')
                .where('eventureId', '==', eventureId);

            return self.manager.executeQuery(query)
               .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        }

        function createEventureService(eventureId) {
            var self = this;
            return self.manager.createEntity('EventureService',
                { eventureId: eventureId, active: true });
        }

        function getClientById(id) {
            var self = this;
            var query = entityQuery.from('Clients')
                .where('id', '==', id);

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }

    function createPlanItem(eventureId) {
            var self = this;
            return self.manager.createEntity('EventurePlanItem',
                { eventureId: eventureId, dateDue: moment().format("MM/DD/YYYY") });
        }

        function getPlanItemById(planItemId) {
            var self = this;
            var query = entityQuery.from('EventurePlanItems')
                .where('id', '==', planItemId);

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }

        function getResourceServicesByOwnerId(ownerId) {
            var self = this;
            var query = entityQuery.from('GetResourceServicesByOwnerId')
                .withParameters({ id: ownerId });

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        }

        function createResourceItem(resourceId) {
            var self = this;
            return self.manager.createEntity('ResourceItem', { resourceId: resourceId, ownerId: config.ownerId, active: true });
        }

        function getResourceItemById(resourceItemId) {
            var self = this;
            var query = entityQuery.from('ResourceItems')
            .where('id', '==', resourceItemId);

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }

        function getExpensesByEventureId(eventureId) {
            var self = this;
            var query = entityQuery.from('Expense')
                .where('eventureId', '==', eventureId);

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

             function querySucceeded(data) {
                return data.results;
            }
        }

        function createExpense() {
            var self = this;
            return self.manager.createEntity('EventureExpense');
        }

    }
})();
