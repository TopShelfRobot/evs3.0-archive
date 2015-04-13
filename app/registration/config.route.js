(function() {
	'use strict';

	var app = angular.module('evReg');

	// Collect the routes
	app.constant('reg.routes', getRoutes());

	// Configure the routes and route resolvers
	app.config(['$routeProvider', 'reg.routes', routeConfigurator]);

	function routeConfigurator($routeProvider, routes) {
		routes.forEach(function(r) {
			// $routeProvider.when(r.url, r.config);
			setRoute(r.url, r.config);
		});
		$routeProvider.otherwise({
			redirectTo: '/user-profile'
		});


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
		return [{
				url: '/eventure',
				config: {
					title: 'Eventure',
					templateUrl: 'app/registration/standard/eventure.part.html',
					settings: {
						nav: 2,
						content: 'Events'
					}
				}
			}, {
				url: '/eventure/:eventureId/list/',
				config: {
					title: 'Eventure List',
					templateUrl: 'app/registration/standard/eventurelist.part.html',
					settings: {
						nav: 3,
						content: 'Participants'
					}
				}
			}, {
				url: '/eventure/:eventureId/list/:listId/team',
				config: {
					title: 'Create Team',
					templateUrl: 'app/registration/team/createteam.part.html',
					settings: {
						nav: 1,
						content: 'Enterprise'
					}
				}
			}, {
				url: '/eventure/:eventureId/list/:listId/team/:teamId/payment',
				config: {
					title: 'Team Payment',
					templateUrl: 'app/registration/team/teamPayment.part.html',
					settings: {
						nav: 4,
						content: 'Coupons & Addons'
					}
				}
			}, {
				url: '/team/:teamGuid/member/:teamMemberGuid/payment',
				config: {
					title: 'Member Payment',
					templateUrl: 'app/registration/team/memberPayment.part.html'
				}
			}, {
				url: '/participant',
				config: {
					title: 'Participant',
					templateUrl: 'app/registration/profile/setparticipant.part.html'
				}
			}, {
				url: '/participant/add',
				config: {
					title: 'Add Participant',
					templateUrl: 'app/registration/profile/addparticipant.part.html'
				}
			}, {
				url: '/participant/:partId',
				config: {
					title: 'Edit Participant',
					templateUrl: 'app/registration/profile/setparticipant.part.html'
				}
			}, {
				url: '/eventure/:eventureId/list/:listId/questions',
				config: {
					title: 'Questions',
					templateUrl: 'app/registration/standard/questions.part.html'
				}
			}, {
				url: '/confirm',
				config: {
					title: 'Confirm',
					templateUrl: 'app/registration/payment/confirm.part.html'
				}
			}, {
				url: '/team-receipt/:registrationId',
				config: {
					title: 'Receipt',
					templateUrl: 'app/registration/payment/teamReceipt.part.html'
				}
			}, {
				url: '/member-receipt/:teamGuid',
				config: {
					title: 'Receipt',
					templateUrl: 'app/registration/payment/teamMemberReceipt.part.html'
				}
			}, {
				url: '/orderreceipt/:orderId',
				config: {
					title: 'Receipt Cart',
					templateUrl: 'app/registration/payment/orderreceipt.part.html'
				}
			}, {
				url: '/new-user/add',
				config: {
					title: 'Add User Profile',
					templateUrl: 'app/registration/profile/addProfile.part.html'
				}
			}, {
				url: '/user-profile/:participantGuid',
				config: {
					title: 'User Profile',
					templateUrl: 'app/registration/profile/profile.part.html'
				}
			}, {
				url: '/user-profile',
				config: {
					title: 'User Profile',
					templateUrl: 'app/registration/profile/profile.part.html'
				}
			}, {
				url: '/editteam/:teamId',
				config: {
					title: 'Edit Team',
					templateUrl: 'app/registration/team/editteam.part.html'
				}
			}, {
				url: '/registration/:regId',
				config: {
					title: 'Edit Registration',
					templateUrl: 'app/registration/profile/registrationedit.part.html'
				}
			}, {
				url: '/registration/:regId/edit',
				config: {
					title: 'Edit Registration',
					templateUrl: 'app/registration/profile/registrationEditConfirm.part.html'
				}
			}, {
				url: '/registration/:regId/transferQuestions',
				config: {
					title: 'Edit Registration',
					templateUrl: 'app/registration/profile/transferQuestions.part.html'
				}
			}, {
				url: '/shoppingcart',
				config: {
					title: 'Shopping Cart',
					templateUrl: 'app/registration/_layout/shoppingcart.part.html'
				}
			}, {
				url: '/login',
				config: {
					title: 'Login',
					templateUrl: 'app/registration/authentication/login.part.html'
				}
			}, {
				url: '/login/:requestPath*',
				config: {
					title: 'Login',
					templateUrl: 'app/registration/authentication/login.part.html'
				}
			}, {
				url: '/loggedout',
				config: {
					title: 'Logged Out',
					templateUrl: 'app/registration/authentication/loggedOut.part.html'
				}
			}, {
				url: '/signup',
				config: {
					title: 'Sign-Up',
					templateUrl: 'app/registration/authentication/signup.part.html'
				}
			}, {
				url: '/forgotpassword',
				config: {
					title: 'Forgot Password',
					templateUrl: 'app/registration/authentication/forgotpassword.part.html'
				}
			}, {
				url: '/resetpassword',
				config: {
					title: 'Reset Password',
					templateUrl: 'app/registration/authentication/resetpassword.part.html'
				}
			}, {
				url: '/policies',
				config: {
					title: 'Policies',
					templateUrl: 'app/registration/standard/policies.part.html'
				}
			}
			//, {
			//    url: '/resetpassword/:token',
			//    config: {
			//        title: 'Reset Password',
			//        templateUrl: 'app/registration/views/resetpassword.part.html'
			//    }
			//}
		];
	}
})();
