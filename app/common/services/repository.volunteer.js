(function () {
    'use strict';

    var serviceId = 'repository.volunteer';

    angular.module('common').factory(serviceId,
        ['breeze', 'repository.abstract', repositoryVolunteer]);

    function repositoryVolunteer(breeze, abstractRepository) {
        var entityName = 'volunteer';
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
            this.getVolunteerEventuresByOwnerId = getVolunteerEventuresByOwnerId;
            this.createVolunteerJob = createVolunteerJob;
            this.createVolunteerShift = createVolunteerShift;
            this.getVolunteerJobById = getVolunteerJobById;
            this.getVolunteerById = getVolunteerById;
            this.getVolunteerShiftsByVolunteerJobId = getVolunteerShiftsByVolunteerJobId;
            this.getVolunteerJobsByEventureId = getVolunteerJobsByEventureId;
            this.getVolunteerShiftsByEventureId = getVolunteerShiftsByEventureId;
            this.getVolunteerScheduleById = getVolunteerScheduleById;

        }

        // Allow this repo to have access to the Abstract Repo's functions,
        // then put its own Ctor back on itself.
        Ctor.prototype = new abstractRepository(Ctor);
        Ctor.prototype.constructor = Ctor;
        abstractRepository.extend(Ctor);

        return Ctor;

        function getAll() {
            var self = this;
            return entityQuery.from('volunteer')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        }

        function getVolunteerEventuresByOwnerId(ownerId) {
            var self = this;
            var predicate = breeze.Predicate;
            var p1 = new predicate("active", "==", true);
            var p2 = new predicate("ownerId", "==", ownerId);
            var p3 = new predicate("isUsingVolunteers", "==", true);
            var newPred = predicate.and(p1, p2, p3);

            var query = entityQuery.from('Eventures')
            .where(newPred)
            .orderBy('sortOrder');

            return self.manager.executeQuery(query)
               .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        }

        function createVolunteerJob(eventureId) {
            var self = this;
            return self.manager.createEntity('VolunteerJob', { eventureId: eventureId, ageRestriction: 'None' });
        }
        
        function createVolunteerShift(jobId) {
            var self = this;
            return self.manager.createEntity('VolunteerShift', { volunteerJobId: jobId, timeBegin: '', timeEnd: '' });
        }
        
        function getVolunteerJobById(id) {
            var self = this;
            var query = entityQuery.from('VolunteerJobs')
                .where('id', '==', id);

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }
        function getVolunteerById(id) {
            var self = this;
            var query = entityQuery.from('Volunteer')
                .where('id', '==', id)
                .expand('Participants');

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }
        function getVolunteerShiftsByVolunteerJobId(id) {
            var self = this;
            var query = entityQuery.from('VolunteerShifts')
                .where('volunteerJobId', '==', id);

            return self.manager.executeQuery(query)
               .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        }

        function getVolunteerJobsByEventureId(eventureId) {
            var self = this;
            var query = entityQuery.from('VolunteerJobs')
                .where('eventureId', '==', eventureId);

            return self.manager.executeQuery(query)
                 .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        }

        function getVolunteerShiftsByEventureId(eventureId) {
            var self = this;
            var query = entityQuery.from('VolunteerShifts')
                .where('VolunteerJob.eventureId', '==', eventureId);

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        }

        function getVolunteerScheduleById(id) {
            var self = this;
            var query = entityQuery.from('VolunteerSchedules')
                .where("id", "==", parseInt(id));

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }
    }
})();