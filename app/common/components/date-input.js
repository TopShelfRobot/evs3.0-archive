;
(function() {

	function Directive() {
		return {
			require: 'ngModel',
			link: function(scope, element, attrs, modelCtrl) {
				var current = null;
				modelCtrl.$parsers.push(function(text) {
					console.log("parsers text:", text);
					// var date = null;
					if(text.split("/").length == 3 && text.split("/")[2].length == 4){
						current = new Date(text);
					}
					//convert data from view format to model format
					return current; //converted
				});

				modelCtrl.$formatters.push(function(date) {
					console.log("formatters date:", date);
					var view = "";
					if(date){
						current = date;
					}
					
					if(current){
						view = "" + (current.getMonth() + 1) + "/" + current.getDate() + "/" + current.getFullYear();
					}
					
					return view; //converted
				});
			}
		}
	}

	angular.module("common").directive('dateInput', [Directive]);

})();
