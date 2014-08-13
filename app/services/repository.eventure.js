(function () {
    'use strict';

    var serviceId = 'repository.eventure';

    angular.module('app').factory(serviceId,
        ['model', 'breeze', 'repository.abstract', repositoryEventure]);

    function repositoryEventure(model, breeze, abstractRepository) {
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
            this.getEventuresByOwnerId = getEventuresByOwnerId;
            //this.setLookups = setLookups;
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
                self.log('Retrieved [Eventure]', data, true);
                return data.results;
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

        };

        //function setLookups() {
        //    this.lookupCachedData = {
        //        //rooms: this._getAllLocal(entityNames.room, 'name'),
        //        //tracks: this._getAllLocal(entityNames.track, 'name'),
        //        //timeslots: this._getAllLocal(entityNames.timeslot, 'start'),
        //    };
        //}
    }
})();