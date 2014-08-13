﻿(function () {
    'use strict';

    var app = angular.module('evReg');

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
                    templateUrl: 'app/registration/views/eventure.part.html',
                    settings: {
                        nav: 2,
                        content: 'Events'
                    }
                }
            }, {
                url: '/eventure/:eventureId/list',
                config: {
                    title: 'Eventure List',
                    templateUrl: 'app/registration/views/eventurelist.part.html',
                    settings: {
                        nav: 3,
                        content: 'Participants'
                    }
                }
            }, {
                url: '/eventure/:eventureId/list/:listId/team',
                config: {
                    title: 'Create Team',
                    templateUrl: 'app/registration/views/createteam.part.html',
                    settings: {
                        nav: 1,
                        content: 'Enterprise'
                    }
                }
            }, {
                url: '/eventure/:eventureId/list/:listId/team/:teamId/payment',
                config: {
                    title: 'Team Payment',
                    templateUrl: 'app/registration/views/teamPayment.part.html',
                    settings: {
                        nav: 4,
                        content: 'Coupons & Addons'
                    }
                }
            },{
                url: '/eventure/:eventureId/list/:listId/team/:teamId/member/:memberId/payment',
                config: {
                    title: 'Member Payment',
                    templateUrl: 'app/registration/views/memberPayment.part.html'
                }
            },{
                url: '/participant',
                config: {
                    title: 'Participant',
                    templateUrl: 'app/registration/views/setparticipant.part.html'
                }
            },{
                url: '/eventure/:eventureId/list/:listId/questions',
                config: {
                    title: 'Questions',
                    templateUrl: 'app/registration/views/questions.part.html'
                }
            },{
                url: '/confirm',
                config: {
                    title: 'Confirm',
                    templateUrl: 'app/registration/views/confirm.part.html'
                }
            },{
                url: '/receipt/:receiptId',
                config: {
                    title: 'Receipt',
                    templateUrl: 'app/registration/views/receipt.part.html'
                }
            },{
                url: '/user-profile',
                config: {
                    title: 'User Profile',
                    templateUrl: 'app/registration/profile.part.html'
                }
            },{
                url: '/kitchensink',
                config: {
                    title: 'Kitchen Sink',
                    templateUrl: 'app/registration/views/kitchensink.html'
                }
            }
        ];
    }
})();