;(function(){
	
	function Service(){
		this.ageFromBirthday = function(dateString) {
			var today = new Date();
			var birthDate = new Date(dateString);
			var age = today.getFullYear() - birthDate.getFullYear();
			var m = today.getMonth() - birthDate.getMonth();
			if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			    age--;
			}
			return age;
		};
	}
	
	angular.module("common").service("Helpers", Service);
	
	
	function Dropbox(){
				
		return Dropbox;
	}
	
	angular.module("common").factory("Dropbox", Dropbox);
})();