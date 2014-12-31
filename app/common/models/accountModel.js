(function(){
	
	function Service($q, $timeout, datacontext, authService){
		
		var self = this;
		
		var roles = null;
		var ready = false;
		
		Object.defineProperty(this, "roles", {
			get : function(){
				if(!ready){
					throw "AccountModel not ready.  Run #init().";
				}
				return roles;
			},
			set : function(){
				throw "Not supported.";
			}
		});
				
		this.init = function(){
			var def = datacontext.account.getRolesByUserName(authService.userName)
				.then(function(data){
					roles = data;
					ready = true;
				});
			
			return def;
		};
		
	}
	
	
	angular.module("common").service("AccountModel", ["$q", "$timeout", "datacontext", "authService", Service]);
	
})();