(function () {
    'use strict';

    var serviceId = 'repository.question';

    angular.module('app').factory(serviceId,
        ['breeze', 'config', 'repository.abstract', repositoryQuestion]);

    function repositoryQuestion(breeze, config, abstractRepository) {
        var entityName = 'Question';
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

            this.createStockQuestionSet = createStockQuestionSet;
            this.getStockAnswerSetByEventureListId = getStockAnswerSetByEventureListId;
            this.getStockAnswerSetByRegistrationId = getStockAnswerSetByRegistrationId;
            this.getStockQuestionSetByEventureListId = getStockQuestionSetByEventureListId;
            this.getStockQuestionSetByRegistrationId = getStockQuestionSetByRegistrationId;
        }

        // Allow this repo to have access to the Abstract Repo's functions,
        // then put its own Ctor back on itself.
        Ctor.prototype = new abstractRepository(Ctor);
        Ctor.prototype.constructor = Ctor;
        abstractRepository.extend(Ctor);

        return Ctor;

        function getAll() {
            var self = this;
            return entityQuery.from('Questions')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        }

        function getStockAnswerSetByEventureListId(eventureListId) {
            var self = this;
            var query = entityQuery.from('StockAnswerSets')
                .where('registrationId', '==', eventureListId);

            return manager.executeQuery(query)
                .then(querySucceeded, self.queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }

        function getStockAnswerSetByRegistrationId(stockAnswerSetId) {
            var self = this;
            var query = entityQuery.from('StockAnswerSets')
                .where('id', '==', stockAnswerSetId);

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }

        function getStockQuestionSetByEventureListId(eventureListId) {
            var self = this;
            var query = entityQuery.from('StockQuestionSets')
                .where('eventureListId', '==', eventureListId);

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }

        function getStockQuestionSetByRegistrationId(registrationId) {
            var self = this;
            var query = entityQuery.from('StockQuestionSets')
                .where('registrationId', '==', registrationId);

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }

        function createStockQuestionSet(eventureListId) {
            var self = this;
            return self.manager.createEntity('StockQuestionSet', { eventureListId: eventureListId });
        }
    }
})();
