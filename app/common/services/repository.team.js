(function () {
    'use strict';

    var serviceId = 'repository.team';

    angular.module('common').factory(serviceId,
        ['breeze', 'repository.abstract', repositoryTeam]);

    function repositoryTeam(breeze, abstractRepository) {
        var entityName = 'team';
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
            this.getTeamMemberPaymentInfoByTeamMemberGuid = getTeamMemberPaymentInfoByTeamMemberGuid;
			this.getTeamById  = getTeamById;
            this.getTeamMemberById = getTeamMemberById;
			this.getTeamMembersByTeamId = getTeamMembersByTeamId;
			this.addTeamMember = addTeamMember;
			this.getTeamPaymentsByTeamId = getTeamPaymentsByTeamId;
            this.getNotPaidTeamMemberCountByTeamGuid = getNotPaidTeamMemberCountByTeamGuid;
            this.getTeamMemberPaymentSumByTeamGuid = getTeamMemberPaymentSumByTeamGuid;
            this.GetTeamInfoByRegistrationId = GetTeamInfoByRegistrationId;
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
        
        function getTeamMemberPaymentInfoByTeamMemberGuid(guid) {
            var self = this;
            var query = entityQuery.from('getTeamMemberPaymentInfoByTeamMemberGuid')
                .withParameters({ id: guid });

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };

        function GetTeamInfoByRegistrationId(id) {
            var self = this;
            var query = entityQuery.from('GetTeamInfoByRegistrationId')
                .withParameters({ id: id });

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        };
		
		function getTeamById(id){
			
			var self = this;
			
			var query = entityQuery.from("Teams")
				.where('id', '==', id);
         
		    return self.manager.executeQuery(query)
                .then(querySucceeded, self.queryFailed);
				
            function querySucceeded(data) {
                return data.results[0];
            }
        }

        function getTeamMemberById(id){

            var self = this;

            var query = entityQuery.from("TeamMembers")
                .where('id', '==', id);

            return self.manager.executeQuery(query)
                .then(querySucceeded, self.queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }

        function getNotPaidTeamMemberCountByTeamGuid(teamGuid) {
            var self = this;
            var query = entityQuery.from('GetNotPaidTeamMemberCountByTeamGuid')
                .withParameters({ id: teamGuid });

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
		}
		
		function getTeamMembersByTeamId(id){
			var self = this;
			
			var query = entityQuery.from("Teammembers")
				.where("teamId", "==", Number(id));
				
			return self.manager.executeQuery(query)
				.then(querySucceeded, self.queryFailed);
			
            function querySucceeded(data) {
                return data.results;
            }	
		}
		
		function addTeamMember(obj){
            var self = this;
            return self.manager.createEntity('TeamMember', obj);
		}
		
		function getTeamPaymentsByTeamId(id){
			var self = this;
			
			var query = entityQuery.from("TeamMemberPayments")
				// .where("teamId", "==", Number(id));
				
			return self.manager.executeQuery(query)
				.then(querySucceeded, self.queryFailed);
			
            function querySucceeded(data) {
                return data.results;
            }	
		}
        
        function getTeamMemberPaymentSumByTeamGuid(teamGuid) {
            var self = this;
            var query = entityQuery.from('GetTeamMemberPaymentSumByTeamGuid')
                .withParameters({ id: teamGuid });

            return self.manager.executeQuery(query)
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }
        }
    }
})();