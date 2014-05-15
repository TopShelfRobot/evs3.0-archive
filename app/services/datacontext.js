(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('dashboard').factory(serviceId,
        ['common', 'entityManagerFactory', 'model', datacontext]);

    function datacontext(common, emFactory, model) {
       // var Predicate = breeze.Predicate;
        var EntityQuery = breeze.EntityQuery;
        //var entityNames = model.entityNames;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        //var logError = getLogFn(serviceId, 'error');
        //var logSuccess = getLogFn(serviceId, 'success');
        var manager = emFactory.newManager();
        //var primePromise;
        var $q = common.$q;
        

        var getTrendsByEventId = function (id, trendsObservable) {

            var query = EntityQuery.from('GetTrendsByEventId')
                .withParameters({
                    id: id
                });

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                //log('we are here good', null, 'dc', true);
                if (trendsObservable) {
                    trendsObservable(data.results[0]);
                }
            }
        };

        var service = {
            getPeople: getPeople,
            getReportsByOwnerId: getReportsByOwnerId,
            createResource: createResource,
            getTrendsByEventId:getTrendsByEventId,
            getMessageCount: getMessageCount
        };

        return service;

        function getMessageCount() { return $q.when(72); }
        


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
        
        function createResource() {
            log('woo hoo resource!!');
            //return manager.createEntity('Resource', { ownerId: 1 });
            var resource = { name: 'John', email: 'joe@jope.com', phone: 23323232325, location: 'Florida' };
            return $q.when(resource);
        };
        
        //function getTrendsByEventId(id, trendsObservable) {

        //    var query = EntityQuery.from('GetTrendsByEventId')
        //        .withParameters({
        //            id: id
        //        });

        //    return manager.executeQuery(query)
        //        .then(querySucceeded)
        //        .fail(queryFailed);

        //    function querySucceeded(data) {
        //        //log('we are here good', null, 'dc', true);
        //        if (trendsObservable) {
        //            trendsObservable(data.results[0]);
        //        }
        //    }
        //};
        
        function getReportsByOwnerId (ownerId, reportsObservable) {
            log('woo hoo!!');
            var predicate = breeze.Predicate;
            var p1 = new predicate("active", "==", true);
            var p2 = new predicate("ownerId", "==", ownerId);

            var query = EntityQuery.from('Reports')
            .where(p1.and(p2));


            return manager.executeQuery(query)
               .then(querySucceeded)
               .fail(queryFailed);

            function querySucceeded(data) {
                if (reportsObservable) {
                    reportsObservable(data.results);
                }
                //log('Retrieved [EventuresObservable] from rds',data, true);
            }

        };

    }
})();