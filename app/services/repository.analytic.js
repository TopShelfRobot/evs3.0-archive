(function () {
    'use strict';

    var serviceId = 'repository.analytic';

    angular.module('app').factory(serviceId,
        ['breeze', 'config', 'repository.abstract', repositoryAnalytic]);

    function repositoryAnalytic(breeze, config, abstractRepository) {
        var entityName = 'ZZZ';
        //var entityNames = model.entityNames;
        var entityQuery = breeze.EntityQuery;
        var predicate = breeze.Predicate;

        //only creating on demand - using ctor
        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            // Exposed data access functions
            //this.getAll = getAll;

            this.getRegDataByOwnerId = getRegDataByOwnerId;
            this.getCapacityByEventureId = getCapacityByEventureId;
            this.getCapacityByEventureListId = getCapacityByEventureListId;
            this.getCapacityByOwnerId = getCapacityByOwnerId;
            this.getTrendsByEventId = getTrendsByEventId;
            this.getReportsByOwnerId = getReportsByOwnerId;
        }

        // Allow this repo to have access to the Abstract Repo's functions,
        // then put its own Ctor back on itself.
        Ctor.prototype = new abstractRepository(Ctor);
        Ctor.prototype.constructor = Ctor;
        abstractRepository.extend(Ctor);

        return Ctor;

        //function getAll() {
        //    var self = this;
        //    return entityQuery.from('ZZZ')
        //        .using(self.manager).execute()
        //        .then(querySucceeded, self._queryFailed);

        //    function querySucceeded(data) {
        //        return data.results;
        //    }
        //}


        function getRegDataByOwnerId(ownerId) {
            var self = this;
            var query = entityQuery.from('GetRegsRevByOwner')
                .withParameters({
                    id: ownerId
                });

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }

        function getCapacityByOwnerId(ownerId) {
            var self = this;
            var query = entityQuery.from('GetCapacityByOwnerId')
                .withParameters({
                    id: ownerId
                });

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }

        function getCapacityByEventureListId(eventureListId) {
            var self = this;
            var query = entityQuery.from('GetCapacityByEventureListId')
                .withParameters({
                    id: eventureListId
                });

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }

        function getCapacityByEventureId(eventureId) {
            var self = this;
            var query = entityQuery.from('GetCapacityByEventureId')
                .withParameters({
                    id: eventureId
                });

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }

        function getTrendsByEventId(id) {
            var self = this;
            var query = entityQuery.from('GetTrendsByEventId')
                .withParameters({
                    id: id
                });

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);


            function querySucceeded(data) {
                return data.results[0];
            }
        }

       function getReportsByOwnerId(ownerId) {
            var self = this;
            var pred = predicate.create("active", "==", true)
                                    .and("ownerId", "==", ownerId);
            return entityQuery.from('Reports')
                .where(pred)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }

        }


        }
    })();
