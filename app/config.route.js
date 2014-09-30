(function () {
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());

    // Configure the routes and route resolvers
    app.config(['$routeProvider', 'routes', "reg.routes", routeConfigurator]);
    function routeConfigurator($routeProvider, routes, regRoutes) {

        routes.forEach(function (r) {
            //$routeProvider.when(r.url, r.config);
            setRoute(r.url, r.config);
        });
		
		regRoutes.forEach(function(r){
			// console.log("route:", r);
			setRoute(r.url, r.config);
		});
		
        $routeProvider.otherwise({ redirectTo: '/' });

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
    function prime(dc) { return dc.prime(); }

    //// Configure the routes and route resolvers
    //app.config(['$routeProvider', 'routes', routeConfigurator]);
    //function routeConfigurator($routeProvider, routes) {

    //    routes.forEach(function (r) {
    //        $routeProvider.when(r.url, r.config);
    //    });
    //    $routeProvider.otherwise({ redirectTo: '/kitchensink' });
    //}

    // Define the routes
    function getRoutes() {
        return [
            { url: '/dash', config: { templateUrl: 'app/admin/dashboard.html' } },
            { url: '/admin', config: { templateUrl: 'app/admin/admin.html' } },
            //{ url: '/reporting', config: { templateUrl: 'app/dashboard/reporting.html' } },
            {
                url: '/enterprise',
                config: {
                    title: 'Enterprise Launchpad',
                    templateUrl: 'app/dashboard/enterpriselaunchpad.html',
                    settings: {
                        nav: 1,
                        content: 'Enterprise'
                    }
                }
            }, {
                url: '/eventurecenter',
                config: {
                    title: 'Eventure Workcenter',
                    templateUrl: 'app/dashboard/eventurecenter.html',
                    settings: {
                        nav: 2,
                        content: 'Events'
                    }
                }
            }, {
                url: '/partcenter',
                config: {
                    title: 'Participants',
                    templateUrl: 'app/dashboard/partcenter.html',
                    settings: {
                        nav: 3,
                        content: 'Participants'
                    }
                }
            }, {
                url: '/teamcenter',
                config: {
                    title: 'Team Workcenter',
                    templateUrl: 'app/dashboard/teamcenter.html',
                    settings: {
                        nav: 4,
                        content: 'Teams'
                    }
                }
            }, {
                url: '/volunteercenter',
                config: {
                    title: 'Volunteers',
                    templateUrl: 'app/dashboard/volunteercenter.html',
                    settings: {
                        nav: 5,
                        content: 'Volunteers'
                    }
                }
            }, {
                url: '/couponaddon',
                config: {
                    title: 'Coupons & Addons',
                    templateUrl: 'app/dashboard/couponaddon.html',
                    settings: {
                        nav: 6,
                        content: 'Coupons & Addons'
                    }
                }
            }, {
                url: '/resourcecenter',
                config: {
                    title: 'Resources',
                    templateUrl: 'app/dashboard/resourcecenter.html',
                    settings: {
                        nav: 7,
                        content: 'Resources'
                    }
                }
            },
            {
                url: '/reporting',
                config: {
                    title: 'Reporting',
                    templateUrl: 'app/dashboard/reporting.html',
                    settings: {
                        nav: 8,
                        content: 'Reporting'
                    }
                }
            },
            {
                url: '/elistcenter/:listingId',
                config: {
                    title: 'Listing Workcenter',
                    templateUrl: 'app/dashboard/elistcenter.html'
                }
            }, {
                url: '/enterpriseeventure',
                config: {
                    title: 'Enterprise Eventure',
                    templateUrl: 'app/dashboard/enterpriseeventure.html'
                }
            }, {
                url: '/eventuredetail/:eventureId',
                config: {
                    title: 'Eventure Detail',
                    templateUrl: 'app/dashboard/eventuredetail.html'
                }
            }, {
                url: '/resourcedetail/:resourceId',
                config: {
                    title: 'Resource Detail',
                    templateUrl: 'app/dashboard/resourcedetail.html'
                }
            }, {
                url: '/manreg',
                config: {
                    title: 'Manual Registration',
                    templateUrl: 'app/dashboard/manreg.html'
                }
            },{
                url: '/setowner',
                config: {
                    title: 'Owner Setup',
                    templateUrl: 'app/admin/setowner.html'
                }
            }, {
                url: '/setaddon',
                config: {
                    title: 'Create An Addon',
                    templateUrl: 'app/dashboard/setup/setaddon.html'
                }
            }, {
                url: '/setaddon/:addonId',
                config: {
                    title: 'Create An Addon',
                    templateUrl: 'app/dashboard/setup/setaddon.html'
                }
            }, {
                url: '/setclient',
                config: {
                    title: 'Create A Client',
                    templateUrl: 'app/dashboard/setup/setclient.html'
                }
            }, {
                url: '/setcoupon',
                config: {
                    title: 'Create A Coupon',
                    templateUrl: 'app/dashboard/setup/setcoupon.html'
                }
            }, {
                url: '/setcoupon/:couponId',
                config: {
                    title: 'Create A Coupon',
                    templateUrl: 'app/dashboard/setup/setcoupon.html'
                }
            }, {
                url: '/:eventureId/seteventplan',
                config: {
                    title: 'Create An Event Plan',
                    templateUrl: 'app/dashboard/setup/seteventplan.html'
                }
            }, {
                url: '/:eventureId/seteventplan/:planItemId',
                config: {
                    title: 'Edit An Event Plan',
                    templateUrl: 'app/dashboard/setup/seteventplan.html'
                }
            }, {
                url: '/seteventure',
                config: {
                    title: 'Create An Event',
                    templateUrl: 'app/dashboard/setup/seteventure.html'
                }
            }, {
                url: '/seteventure/:eventureId',
                config: {
                    title: 'Edit Your Event',
                    templateUrl: 'app/dashboard/setup/seteventure.html'
                }
            }, {
                url: '/:eventureId/setexpense',
                config: {
                    title: 'Create An Expense',
                    templateUrl: 'app/dashboard/setup/setexpense.html'
                }
            }, {
                url: '/:eventureId/setexpense/:expenseId',
                config: {
                    title: 'Edit An Expense',
                    templateUrl: 'app/dashboard/setup/setexpense.html'
                }
            }, {
                url: '/:eventureId/:listId/setfee',
                config: {
                    title: 'Create Fees & Groups',
                    templateUrl: 'app/dashboard/setup/setfee.html'
                }
            }, {
                url: '/:eventureId/:listId/setquestion',
                config: {
                    title: 'Create Questions',
                    templateUrl: 'app/dashboard/setup/setquestion.html'
                }
            }, {
                url: '/:eventureId/setlist/',
                config: {
                    title: 'Create A Listing',
                    templateUrl: 'app/dashboard/setup/setlist.html'
                }
            }, {
                url: '/setlist/:listId',
                config: {
                    title: 'Edit A Listing',
                    templateUrl: 'app/dashboard/setup/setlist.html'
                }
            }, {
                url: '/setrefund',
                config: {
                    title: 'Issue A Refund',
                    templateUrl: 'app/dashboard/setup/setrefund.html'
                }
            }, {
                url: '/setresource',
                config: {
                    title: 'Create A Resource',
                    templateUrl: 'app/dashboard/setup/setresource.html'
                }
            }, {
                url: '/setresource/:resourceId',
                config: {
                    title: 'Create A Resource',
                    templateUrl: 'app/dashboard/setup/setresource.html'
                }
            }, {
                url: '/setresourceitem',
                config: {
                    title: 'Create A Resource Item',
                    templateUrl: 'app/dashboard/setup/setresourceitem.html'
                }
            }, {
                url: '/setresourceitemcategory',
                config: {
                    title: 'Create A Resource Item Category',
                    templateUrl: 'app/dashboard/setup/setresourceitemcategory.html'
                }
            }, {
                url: '/setvolunteerjob',
                config: {
                    title: 'Create A Volunteer Job',
                    templateUrl: 'app/dashboard/setup/setvolunteerjob.html'
                }
            }, {
                url: '/editteam/:teamId',
                config: {
                    title: 'Edit Team',
                    templateUrl: 'app/registration/views/editteam.part.html'
                }
            }, {
                url: '/kitchensink',
                config: {
                    title: 'Kitchen Sink',
                    templateUrl: 'app/dashboard/kitchensink.html'
                }
            }
        ];
    }
})();
