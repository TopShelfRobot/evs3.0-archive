(function () {
	'use strict';

	var app = angular.module('evReg');

	// Collect the routes
	app.constant('reg.routes', getRoutes());

	// Define the routes
	function getRoutes() {
		return [
			{
				url: '/eventure',
				config: {
					title: 'Eventure',
					templateUrl: 'app/registration/standard/eventure.part.html',
					authorized : ['super-user'],
					settings: {
						nav: 2,
						content: 'Events'
					},
				}
			}, {
				url: '/eventure/:eventureId/list/',
				config: {
					title: 'Eventure List',
					templateUrl: 'app/registration/standard/eventurelist.part.html',
					authorized : ['super-user'],
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
					authorized : ['super-user'],
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
					authorized : ['super-user'],
					settings: {
						nav: 4,
						content: 'Coupons & Addons'
					}
				}
			}, {
				url: '/team/:teamGuid/member/:teamMemberGuid/payment',
				config: {
					title: 'Member Payment',
					templateUrl: 'app/registration/team/memberPayment.part.html',
					authorized : ['super-user'],
				}
			}, {
				url: '/participant',
				config: {
					title: 'Participant',
					templateUrl: 'app/registration/profile/setparticipant.part.html',
					authorized : ['super-user'],
				}
			}, {
				url: '/participant/add',
				config: {
					title: 'Add Participant',
					templateUrl: 'app/registration/profile/addparticipant.part.html',
					authorized : ['super-user'],
				}
			}, {
				url: '/participant/:partId',
				config: {
					title: 'Edit Participant',
					templateUrl: 'app/registration/profile/setparticipant.part.html',
					authorized : ['super-user'],
				}
			}, {
				url: '/eventure/:eventureId/list/:listId/questions',
				config: {
					title: 'Questions',
					templateUrl: 'app/registration/standard/questions.part.html',
					authorized : ['super-user'],
				}
			}, {
				url: '/confirm',
				config: {
					title: 'Confirm',
					templateUrl: 'app/registration/payment/confirm.part.html',
					authorized : ['super-user'],
				}
			}, {
				url: '/receipt/:registrationId',
				config: {
					title: 'Receipt',
					templateUrl: 'app/registration/payment/teamMemberReceipt.part.html',
					authorized : ['super-user'],
				}
			}, {
				url: '/orderreceipt/:orderId',
				config: {
					title: 'Receipt Cart',
					templateUrl: 'app/registration/payment/orderreceipt.part.html',
					authorized : ['super-user'],
				}
			}, {
				url: '/new-user/add',
				config: {
					title: 'Add User Profile',
					templateUrl: 'app/registration/profile/addProfile.part.html',
					authorized : ['super-user'],
				}
			}, {
				url: '/user-profile/:participantId',
				config: {
					title: 'User Profile',
					templateUrl: 'app/registration/profile/profile.part.html',
					authorized : ['super-user'],
				}
			},{
				url: '/editteam/:teamId',
				config: {
					title: 'Edit Team',
					templateUrl: 'app/registration/team/editteam.part.html',
					authorized : ['super-user'],
				}
			}, {
				url: '/registration/:regId',
				config: {
					title: 'Edit Registration',
					templateUrl: 'app/registration/profile/registrationedit.part.html',
					authorized : ['super-user'],
				}
			}, {
				url: '/registration/:regId/edit',
				config: {
					title: 'Edit Registration',
					templateUrl: 'app/registration/profile/registrationEditConfirm.part.html',
					authorized : ['super-user'],
				}
			}, {
				url: '/registration/:regId/transferQuestions',
				config: {
					title: 'Edit Registration',
					templateUrl: 'app/registration/profile/transferQuestions.part.html',
					authorized : ['super-user'],
				}
			}, {
				url: '/shoppingcart',
				config: {
					title: 'Shopping Cart',
					templateUrl: 'app/registration/_layout/shoppingcart.part.html',
					authorized : ['super-user'],
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
				url: '/terms',
				config: {
					title: 'Terms & Conditions',
					templateUrl: 'app/registration/payment/terms.part.html'
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
