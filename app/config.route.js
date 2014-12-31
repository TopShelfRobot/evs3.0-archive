(function () {
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());

    // Configure the routes and route resolvers
    app.config(['$routeProvider', 'routes', "reg.routes", routeConfigurator]);
    function routeConfigurator($routeProvider, routes, regRoutes) {

        routes.forEach(function (r) {
            setRoute(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/eventurecenter' });

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
					authorized: ["money"],
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
					authorized: ["user"],
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
					authorized: ["user"],
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
					authorized: ["user"],
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
					authorized: ["user"],
                    settings: {
                        nav: 5,
                        content: 'Volunteers'
                    }
                }
            }, {
                url: '/discounts',
                config: {
                    title: 'Discounts',
                    templateUrl: 'app/dashboard/discounts.html',
					authorized: ["user"],
                    settings: {
                        nav: 6,
                        content: 'Discounts'
                    }
                }
            }, {
                url: '/resourcecenter',
                config: {
                    title: 'Resources',
                    templateUrl: 'app/dashboard/resourcecenter.html',
					authorized: ["user"],
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
					authorized: ["user"],
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
                    templateUrl: 'app/dashboard/elistcenter.html',
					authorized: ["user"],
                }
            }, {
                url: '/enterpriseeventure/:eventureId',
                config: {
                    title: 'Enterprise Eventure',
                    templateUrl: 'app/dashboard/enterpriseeventure.html',
					authorized: ["money"],
                }
            }, {
                url: '/eventuredetail/:eventureId',
                config: {
                    title: 'Eventure Detail',
                    templateUrl: 'app/dashboard/eventuredetail.html',
					authorized: ["user"],
                }
            }, {
                url: '/resourcedetail/:resourceId',
                config: {
                    title: 'Resource Detail',
                    templateUrl: 'app/dashboard/resourcedetail.html',
					authorized: ["user"],
                }
            }, {
                url: '/manreg',
                config: {
                    title: 'Manual Registration',
                    templateUrl: 'app/dashboard/manreg.html',
					authorized: ["user"],
                }
            },{
                url: '/setowner',
                config: {
                    title: 'Owner Setup',
                    templateUrl: 'app/admin/setowner.html',
					authorized: ["admin", "super-user"]
                }
            }, {
                url: '/setaddon',
                config: {
                    title: 'Create An Addon',
                    templateUrl: 'app/dashboard/setup/setaddon.html',
					authorized: ["user"],
                }
            }, {
                url: '/setaddon/:addonId',
                config: {
                    title: 'Create An Addon',
                    templateUrl: 'app/dashboard/setup/setaddon.html',
					authorized: ["user"],
                }
            }, {
                url: '/setclient',
                config: {
                    title: 'Create A Client',
                    templateUrl: 'app/dashboard/setup/setclient.html',
					authorized: ["user"],
                }
            }, {
                url: '/setcoupon',
                config: {
                    title: 'Create A Coupon',
                    templateUrl: 'app/dashboard/setup/setcoupon.html',
					authorized: ["user"],
                }
            }, {
                url: '/setcoupon/:couponId',
                config: {
                    title: 'Create A Coupon',
                    templateUrl: 'app/dashboard/setup/setcoupon.html',
					authorized: ["user"],
                }
            }, {
                url: '/:eventureId/seteventplan',
                config: {
                    title: 'Create An Event Plan',
                    templateUrl: 'app/dashboard/setup/seteventplan.html',
					authorized: ["user"],
                }
            }, {
                url: '/seteventplan/:itemId',
                config: {
                    title: 'Edit An Event Plan',
                    templateUrl: 'app/dashboard/setup/seteventplan.html',
					authorized: ["user"],
                }
            }, {
                url: '/seteventure',
                config: {
                    title: 'Create An Event',
                    templateUrl: 'app/dashboard/setup/seteventure.html',
					authorized: ["user"],
                }
            }, {
                url: '/seteventure/:eventureId',
                config: {
                    title: 'Edit Your Event',
                    templateUrl: 'app/dashboard/setup/seteventure.html',
					authorized: ["user"],
                }
            }, {
                url: '/:eventureId/setexpense',
                config: {
                    title: 'Create An Expense',
                    templateUrl: 'app/dashboard/setup/setexpense.html',
					authorized: ["user"],
                }
            }, {
                url: '/:eventureId/setexpense/:expenseId',
                config: {
                    title: 'Edit An Expense',
                    templateUrl: 'app/dashboard/setup/setexpense.html',
					authorized: ["user"],
                }
            }, {
                url: '/:eventureId/:listId/setfee',
                config: {
                    title: 'Create Fees & Groups',
                    templateUrl: 'app/dashboard/setup/setfee.html',
					authorized: ["user"],
                }
            }, {
                url: '/:eventureId/:listId/setquestion',
                config: {
                    title: 'Create Questions',
                    templateUrl: 'app/dashboard/setup/setquestion.html',
					authorized: ["user"],
                }
            }, {
                url: '/:eventureId/setlist/',
                config: {
                    title: 'Create A Listing',
                    templateUrl: 'app/dashboard/setup/setlist.html',
					authorized: ["user"],
                }
            }, {
                url: '/setlist/:listId',
                config: {
                    title: 'Edit A Listing',
                    templateUrl: 'app/dashboard/setup/setlist.html',
					authorized: ["user"],
                }
            }, {
                url: '/setrefund',
                config: {
                    title: 'Issue A Refund',
                    templateUrl: 'app/dashboard/setup/setrefund.html',
					authorized: ["user"],
                }
            }, {
                url: '/setresource',
                config: {
                    title: 'Create A Resource',
                    templateUrl: 'app/dashboard/setup/setresource.html',
					authorized: ["user"],
                }
            }, {
                url: '/setresource/:resourceId',
                config: {
                    title: 'Create A Resource',
                    templateUrl: 'app/dashboard/setup/setresource.html',
					authorized: ["user"],
                }
            }, {
                url: '/:resourceId/setresourceitem',
                config: {
                    title: 'Create A Resource Item',
                    templateUrl: 'app/dashboard/setup/setresourceitem.html',
					authorized: ["user"],
                }
            }, {
                url: 'setresourceitem/:itemId',
                config: {
                    title: 'Edit A Resource Item',
                    templateUrl: 'app/dashboard/setup/setresourceitem.html',
					authorized: ["user"],
                }
            }, {
                url: '/:resourceId/setresourceitemcategory',
                config: {
                    title: 'Create A Resource Item Category',
                    templateUrl: 'app/dashboard/setup/setresourceitemcategory.html',
					authorized: ["user"],
                }
            }, {
                url: '/:eventureId/setvolunteerjob',
                config: {
                    title: 'Create A Volunteer Job',
                    templateUrl: 'app/dashboard/setup/setvolunteerjob.html',
					authorized: ["user"],
                }
            }, {
                url: '/setvolunteerjob/:jobId',
                config: {
                    title: 'Edit A Volunteer Job',
                    templateUrl: 'app/dashboard/setup/setvolunteerjob.html',
					authorized: ["user"],
                }
            }, {
                url: '/setvolunteerscheduleedit/:scheduleId',
                config: {
                    title: 'Edit A Volunteer Schedule',
                    templateUrl: 'app/dashboard/setup/setvolunteerscheduleedit.html',
					authorized: ["user"],
                }
            }, {
                url: '/setvolunteerscheduleedit',       //mjb delete this
                config: {
                    title: 'Edit A Volunteer Schedule',
                    templateUrl: 'app/dashboard/setup/setvolunteerscheduleedit.html',
					authorized: ["user"],
                }
            }, {
                url: '/setbundle',
                config: {
                    title: 'Create A Bundle',
                    templateUrl: 'app/dashboard/setup/setbundle.html',
					authorized: ["user"],
                }
            }, {
                url: '/setbundle/:bundleId',
                config: {
                    title: 'Edit A Bundle',
                    templateUrl: 'app/dashboard/setup/setbundle.html',
					authorized: ["user"],
                }
            }, {
                url: '/yearsummary/:eventureId',  //Move this
                config: {
                    title: 'Year Summary',
                    templateUrl: 'app/admin/yearsummary.html',
					authorized: ["user"],
                }
            }, {
                url: '/editteam/:teamId',
                config: {
                    title: 'Edit Team',
                    templateUrl: 'app/registration/views/editteam.part.html',
					authorized: ["user"],
                }
            }, {
                url: '/registrationedit',
                config: {
                    title: 'Edit a Registration',
                    templateUrl: 'app/common/registrationedit.html',
					authorized: ["user"],
                }
            }, {
                url: '/email',
                config: {
                    title: 'Participant Communication',
                    templateUrl: 'app/dashboard/email.html',
					authorized: ["user"],
                }
            }, {
                url: '/demographics/:eventureId',
                config: {
                    title: 'Demographics',
                    templateUrl: 'app/admin/analytics/demographics.html',
					authorized: ["user"],
                }
            }, {
                url: '/marketing/:eventureId',
                config: {
                    title: 'Marketing',
                    templateUrl: 'app/admin/analytics/marketing.html',
					authorized: ["user"],
                }
            }, {
                url: '/coupons/:eventureId',
                config: {
                    title: 'Coupons',
                    templateUrl: 'app/admin/analytics/coupons.html',
					authorized: ["user"],
                }
            }, {
                url: '/financials/:eventureId',
                config: {
                    title: 'Financials',
                    templateUrl: 'app/admin/analytics/financials.html',
					authorized: ["user"],
                }
            }, {
                url: '/volunteers/:eventureId',
                config: {
                    title: 'Volunteers',
                    templateUrl: 'app/admin/analytics/volunteers.html',
					authorized: ["user"],
                }
            }, {
                url: '/charities/:eventureId',
                config: {
                    title: 'Charities',
                    templateUrl: 'app/admin/analytics/charities.html',
					authorized: ["user"],
                }
            }, {
                url: '/teams/:eventureId',
                config: {
                    title: 'Teams',
                    templateUrl: 'app/admin/analytics/teams.html',
					authorized: ["user"],
                }
            }, {
                url: '/deferrals/:eventureId',
                config: {
                    title: 'Deferrals',
                    templateUrl: 'app/admin/analytics/deferrals.html',
					authorized: ["user"],
                }
            }, {
                url: '/transfers/:eventureId',
                config: {
                    title: 'Transfers',
                    templateUrl: 'app/admin/analytics/transfers.html',
					authorized: ["user"],
                }
            }, {
                url: '/manregs/:eventureId',
                config: {
                    title: 'Manual Registrations',
                    templateUrl: 'app/admin/analytics/manreg.html',
					authorized: ["user"],
                }
            }

        ];
    }
})();
