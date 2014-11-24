(function(){
	
    var data = {
        ownerId: 50,
        userId: 1122,
		roles: ["user", "admin"]
    };
	
	function Service($http, $timeout, $q, session){
		var self = this;
		
		this.login = function (credentials) {
			var def = $q.defer();
			
			$timeout(function(){
				session.data = data;
				def.resolve(session.data)
			}, 5000);
			
			return def;
			// session.create(res.data.id, res.data.userId, res.data.userRole);
		};

		this.isAuthenticated = function () {
			return !!session.userId;
		};

		this.isAuthorized = function (authorizedRoles) {
			if (!angular.isArray(authorizedRoles)) {
				authorizedRoles = [authorizedRoles];
			}
			return (self.isAuthenticated() &&
				authorizedRoles.indexOf(Session.userRole) !== -1);
		};
	}
	
	angular.module("app").service("Authentication", ["$http", "$timeout", "$q", "Session", Service]);
})();