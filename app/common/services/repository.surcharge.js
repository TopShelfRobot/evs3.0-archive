(function () {
    'use strict';

    var serviceId = 'repository.surcharge';

    angular.module('common').factory(serviceId,
        ['breeze', 'config', 'repository.abstract', repositorySurcharge]);

    function repositorySurcharge(breeze, config, abstractRepository) {
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
            this.createFeeSchedule = createFeeSchedule;
            this.createCoupon = createCoupon;
            this.createAddon = createAddon;
            this.getAddonById = getAddonById;
            this.getCouponById = getCouponById;
            this.getFeeSchedulesByEventureListId = getFeeSchedulesByEventureListId;
            this.getAddonsByEventureListId = getAddonsByEventureListId;
            this.getAddonsByEventureId = getAddonsByEventureId;
            this.validateCoupon = validateCoupon;
        }

        // Allow this repo to have access to the Abstract Repo's functions,
        // then put its own Ctor back on itself.
        Ctor.prototype = new abstractRepository(Ctor);
        Ctor.prototype.constructor = Ctor;
        abstractRepository.extend(Ctor);

        return Ctor;

        function createFeeSchedule(eventureListId) {
            var self = this;
            return self.manager.createEntity('FeeSchedule',
                { eventureListId: eventureListId, dateBegin: new Date() });
        }

        function getAddonsByEventureId(eventureId) {
            var self = this;
            var pred = predicate.create("addonTypeLinkId", "==", eventureId)
              .and("addonType", "==", 'eventfee')
              .and("active", "==", true);

            return entityQuery.from('Addons')
              .where(pred)
              .using(self.manager).execute()
              .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        }

        function getAddonsByEventureListId(eventureListId) {
            var self = this;
            var pred = predicate.create("addonTypeLinkId", "==", eventureListId)
              .and("addonType", "==", 'listfee')
              .and("active", "==", true);

            return entityQuery.from('Addons')
              .where(pred)
              .using(self.manager).execute()
              .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        }

        function getAddonById(addonId) {
            var self = this;
            var query = entityQuery.from('Addons')
                .where('id', '==', addonId);

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }

        function createAddon(ownerId) {
            var self = this;
            return self.manager.createEntity('Addon', { addonType: 'eventfee', ownerId: config.owner.ownerId, addonTypeLinkId: config.owner.ownerId });
        }

        function getCouponById(couponId) {
            var self = this;
            var query = entityQuery.from('Coupons')
                .where('id', '==', couponId);

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }

        function createCoupon(ownerId) {
            var self = this;
            return self.manager.createEntity('Coupon', { couponType: 'owner', ownerId: config.owner.ownerId, couponTypeLinkId: config.owner.ownerId });
        }

        function validateCoupon(couponCode, participantId, eventureListId) {
            var self = this;
            var query = entityQuery.from('ValidateCoupon')
                .withParameters({
                    couponCode: couponCode,
                    participantId: participantId,
                    eventureListId: eventureListId
                });

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }

        function getFeeSchedulesByEventureListId(eventureListId) {
            var self = this;
            var query = entityQuery.from('FeeSchedules')//;
                .where('eventureListId', '==', eventureListId)
                .orderBy('dateBegin');

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results;
            }
        }
    }
})();
