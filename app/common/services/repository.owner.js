(function () {
	'use strict';

	var serviceId = 'repository.owner';

	angular.module('common').factory(serviceId,
		['breeze', 'config', 'repository.abstract', 'CartModel', repositoryOwner]);

	function repositoryOwner(breeze, config, abstractRepository, cart) {
		var entityName = 'owner';
		//var entityNames = model.entityNames;
		var entityQuery = breeze.EntityQuery;
		var predicate = breeze.Predicate;

		//only creating on demand - using ctor
		function Ctor(mgr) {
			this.serviceId = serviceId;
			this.entityName = entityName;
			this.manager = mgr;
			this.setPublicOwnerSettings = setPublicOwnerSettings;
			this.setOwnerSettings = setOwnerSettings;
			// Exposed data access functions
			//this.getAll = getAll;
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

		function setPublicOwnerSettings(ownerId) {
		    //alert('wowo');
			var self = this;
			var query = entityQuery.from('getPublicOwnerByOwnerId')
				.withParameters({ ownerId: ownerId });

			return self.manager.executeQuery(query)
				.then(querySucceeded, self._queryFailed);

			function querySucceeded(data) {
			    return cart.configureSettings(data.results[0]);
			}
		}
		
		function setOwnerSettings(ownerId){
			
			var self = this;
			var query = entityQuery.from('Owners')
				.where('id', '==', ownerId);

			return self.manager.executeQuery(query)
				.then(querySucceeded, self._queryFailed);

			function querySucceeded(data) {
			    return cart.configureSettings(data.results[0]);
			}
		}
	}
})();