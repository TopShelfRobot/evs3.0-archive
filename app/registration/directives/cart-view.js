
; (function() {

	function Directive($compile, $http) {

		var directive = {
			restrict: 'A',
			transclude: true,
			scope: {
				cart: "=cartView"
			},
			template: '<span ng-transclude></span>',
			link: function(scope, el, attrs) {
				$http.get('/app/registration/layout/cartView.html')
					.then(function(response) {
						var part = response.data;
						var fn = $compile(part);
						var out = fn(scope);
						$(el).popover({
							trigger: 'click',
							html: true,
							content: function() {
								return out.html();
							},
							placement: "bottom",
						});
					});

			}
		};
		return directive;
	}

	angular.module("evReg").directive('cartView', ["$compile", "$http", Directive]);

})();
