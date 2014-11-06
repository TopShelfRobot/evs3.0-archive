(function () {
    'use strict';

    var app = angular.module('evReg');

    // Collect the routes
    app.constant('reg.routes', getRoutes());

    // Configure the routes and route resolvers
    app.config(['$routeProvider', 'reg.routes', routeConfigurator]);
	
    function routeConfigurator($routeProvider, routes) {
        routes.forEach(function (r) {
            // $routeProvider.when(r.url, r.config);
            setRoute(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/kitchensink' });


        function setRoute(url, definition) {
            // Sets resolvers for all of the routes
            // by extending any existing resolvers (or creating a new one).
            definition.resolve = angular.extend(definition.resolve || {}, {
                prime: prime
            });
            $routeProvider.when(url, definition);
            return $routeProvider;
        }
    }

    prime.$inject = ['datacontext'];
	
    function prime(dc) { 
		return dc.prime(); 
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
                url: '/eventure/:eventureId/list/',
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
            }, {
                url: '/team/:teamGuid/member/:teamMemberGuid/payment',
                config: {
                    title: 'Member Payment',
                    templateUrl: 'app/registration/views/memberPayment.part.html'
                }
            }, {
                url: '/participant',
                config: {
                    title: 'Participant',
                    templateUrl: 'app/registration/views/setparticipant.part.html'
                }
            }, {
                url: '/participant/add',
                config: {
                    title: 'Add Participant',
                    templateUrl: 'app/registration/views/addparticipant.part.html'
                }
            }, {
                url: '/participant/:partId',
                config: {
                    title: 'Edit Participant',
                    templateUrl: 'app/registration/views/setparticipant.part.html'
                }
            }, {
                url: '/eventure/:eventureId/list/:listId/questions',
                config: {
                    title: 'Questions',
                    templateUrl: 'app/registration/views/questions.part.html'
                }
            }, {
                url: '/confirm',
                config: {
                    title: 'Confirm',
                    templateUrl: 'app/registration/views/confirm.part.html'
                }
            }, {
                url: '/receipt/:teamMemberGuid',
                config: {
                    title: 'Receipt',
                    templateUrl: 'app/registration/views/receipt.part.html'
                }
            }, {
                url: '/user-profile',
                config: {
                    title: 'User Profile',
                    templateUrl: 'app/registration/views/profile.part.html'
                }
            }, {
                url: '/user-profile/add',
                config: {
                    title: 'Add User Profile',
                    templateUrl: 'app/registration/views/addProfile.part.html'
                }
            },{
                url: '/editteam/:teamId',
                config: {
                    title: 'Edit Team',
                    templateUrl: 'app/registration/views/editteam.part.html'
                }
            }, {
                url: '/registration/:regId',
                config: {
                    title: 'Edit Registration',
                    templateUrl: 'app/registration/views/registrationedit.part.html'
                }
            }, {
                url: '/registration/:regId/edit',
                config: {
                    title: 'Edit Registration',
                    templateUrl: 'app/registration/views/registrationEditConfirm.part.html'
                }
            }, {
                url: '/registration/:regId/transferQuestions',
                config: {
                    title: 'Edit Registration',
                    templateUrl: 'app/registration/views/transferQuestions.part.html'
                }
            }, {
                url: '/kitchensink',
                config: {
                    title: 'Kitchen Sink',
                    templateUrl: 'app/registration/views/kitchensink.html'
                }
            }
        ];
    }
})();
