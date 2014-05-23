(function () {
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());

    // Configure the routes and route resolvers
    app.config(['$routeProvider', 'routes', routeConfigurator]);
    function routeConfigurator($routeProvider, routes) {
        routes.forEach(function (r) {
            $routeProvider.when(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/kitchensink' });
    }

    // Define the routes
    function getRoutes() {
        return [
            {
                url: '/eventure',
                config: {
                    title: 'Eventure',
                    templateUrl: 'app/registration/eventure.part.html',
                    settings: {
                        nav: 2,
                        content: 'Events'
                    }
                }
            }, {
                url: '/eventure/:eventureId/list',
                config: {
                    title: 'Eventure List',
                    templateUrl: 'app/registration/eventurelist.part.html',
                    settings: {
                        nav: 3,
                        content: 'Participants'
                    }
                }
            }, {
                url: '/eventure/:eventureId/list/:listId/team',
                config: {
                    title: 'Create Team',
                    templateUrl: 'app/registration/createteam.part.html',
                    settings: {
                        nav: 1,
                        content: 'Enterprise'
                    }
                }
            }, {
                url: '/eventure/:eventureId/list/:listId/team/:teamId/payment',
                config: {
                    title: 'Team Payment',
                    templateUrl: 'app/registration/teampayment.part.html',
                    settings: {
                        nav: 4,
                        content: 'Coupons & Addons'
                    }
                }
            },{
                url: '/kitchensink',
                config: {
                    title: 'Kitchen Sink',
                    templateUrl: 'app/registration/kitchensink.html'
                }
            }
        ];
    }
})();
