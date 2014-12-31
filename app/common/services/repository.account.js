(function () {

	var serviceId = 'repository.account';

	function Service(breeze, config, abstractRepository, $q, $timeout) {
		var entityName = 'account';
		//var entityNames = model.entityNames;
		var entityQuery = breeze.EntityQuery;
		var predicate = breeze.Predicate;

		//only creating on demand - using ctor
		function Ctor(mgr) {
			this.serviceId = serviceId;
			this.entityName = entityName;
			this.manager = mgr;
			this.getRolesByUserName = getRolesByUserName;
		}

		// Allow this repo to have access to the Abstract Repo's functions,
		// then put its own Ctor back on itself.
		Ctor.prototype = new abstractRepository(Ctor);
		Ctor.prototype.constructor = Ctor;
		abstractRepository.extend(Ctor);

		function getRolesByUserName(userName) {
			
			// var self = this;
			// var query = entityQuery.from('roles')
			// 	.where({ "userName", "==", userName });
			//
			// function querySucceeded(data) {
			//     return data.results;
			// }
			//
			// return self.manager.executeQuery(query)
			// 	.then(querySucceeded, self._queryFailed);
			
			var def = $q.defer();
			$timeout(function(){
				
				var roles = [];
				if(userName && userName.length && userName.length > 0){
					roles.push("user");
					roles.push("admin");
					roles.push("super-user");
					roles.push("money");
				}
				
				def.resolve(roles);
				
			}, 1000);
			
			return def.promise;
		}
		
		return Ctor;
	}
	
	angular.module('common').factory(serviceId, ['breeze', 'config', 'repository.abstract', "$q", "$timeout", Service]);
})();