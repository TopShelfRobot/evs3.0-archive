(function () {
    'use strict';

    var controllerId = 'topnav';
    angular.module('app').controller(controllerId,
        ['$route', '$location', 'config', 'routes', 'authService', topnav]);

    function topnav($route, $location, config, routes, authService) {

        var vm = this;

        vm.logOut = function () {
            authService.logOut();
            $location.path('/eventurecenter');
        }

        vm.authentication = authService.authentication;

        console.log(vm.authentication.isAuth);

        vm.isCurrent = isCurrent;

        activate();

        function activate() { getNavRoutes(); }

        function getNavRoutes() {
            vm.navRoutes = routes.filter(function(r) {
                return r.config.settings && r.config.settings.nav;
            }).sort(function(r1, r2) {
                return r1.config.settings.nav - r2.config.settings.nav;
            });
        }

        function isCurrent(route) {
            if (!route.config.title || !$route.current || !$route.current.title) {
                return '';
            }
            var menuName = route.config.title;
            return $route.current.title.substr(0, menuName.length) === menuName ? 'active' : '';
        }
    };
})();
