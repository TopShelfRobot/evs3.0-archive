(function(){
	
	function Service(){
		var self = this;
		
		this.create = function (sessionId, userId, userRole) {
			self.id = sessionId;
			self.userId = userId;
			self.userRole = userRole;
		};
		
		this.destroy = function () {
			self.id = null;
			self.userId = null;
			self.userRole = null;
		};
	}
	
	angular.module("app").service("Session", [Service]);
})();