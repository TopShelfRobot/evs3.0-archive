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
                    templateUrl: 'app/dashboard/enterprise/enterpriselaunchpad.html',
                    settings: {
                        nav: 1,
                        content: 'Enterprise'
                    }
                }
            }, {
                url: '/eventurecenter',
                config: {
                    title: 'Eventure Workcenter',
                    templateUrl: 'app/dashboard/eventure/eventurecenter.html',
                    settings: {
                        nav: 2,
                        content: 'Events'
                    }
                }
            }, {
                url: '/partcenter',
                config: {
                    title: 'Participants',
                    templateUrl: 'app/dashboard/participant/partcenter.html',
                    settings: {
                        nav: 3,
                        content: 'Participants'
                    }
                }
            }, {
                url: '/teamcenter',
                config: {
                    title: 'Team Workcenter',
                    templateUrl: 'app/dashboard/team/teamcenter.html',
                    settings: {
                        nav: 4,
                        content: 'Teams'
                    }
                }
            }, {
                url: '/volunteercenter',
                config: {
                    title: 'Volunteers',
                    templateUrl: 'app/dashboard/volunteer/volunteercenter.html',
                    settings: {
                        nav: 5,
                        content: 'Volunteers'
                    }
                }
            }, {
                url: '/discounts',
                config: {
                    title: 'Discounts',
                    templateUrl: 'app/dashboard/surcharge/discounts.html',
                    settings: {
                        nav: 6,
                        content: 'Discounts'
                    }
                }
            }, {
                url: '/resourcecenter',
                config: {
                    title: 'Resources',
                    templateUrl: 'app/dashboard/resource/resourcecenter.html',
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
                    templateUrl: 'app/dashboard/admin/reporting.html',
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
                    templateUrl: 'app/dashboard/eventure/elistcenter.html'
                }
            }, {
                url: '/enterpriseeventure/:eventureId',
                config: {
                    title: 'Enterprise Eventure',
                    templateUrl: 'app/dashboard/enterprise/enterpriseeventure.html'
                }
            }, {
                url: '/eventuredetail/:eventureId',
                config: {
                    title: 'Eventure Detail',
                    templateUrl: 'app/dashboard/eventure/eventuredetail.html'
                }
            }, {
                url: '/resourcedetail/:resourceId',
                config: {
                    title: 'Resource Detail',
                    templateUrl: 'app/dashboard/resource/resourcedetail.html'
                }
            }, {
                url: '/manreg',
                config: {
                    title: 'Manual Registration',
                    templateUrl: 'app/dashboard/admin/manreg.html'
                }
            },{
                url: '/setowner',
                config: {
                    title: 'Owner Setup',
                    templateUrl: 'app/dashboard/admin/setowner.html'
                }
            }, {
                url: '/setaddon',
                config: {
                    title: 'Create An Addon',
                    templateUrl: 'app/dashboard/surcharge/setaddon.html'
                }
            }, {
                url: '/setaddon/:addonId',
                config: {
                    title: 'Create An Addon',
                    templateUrl: 'app/dashboard/surcharge/setaddon.html'
                }
            }, {
                url: '/setclient',
                config: {
                    title: 'Create A Client',
                    templateUrl: 'app/dashboard/resource/setclient.html'
                }
            }, {
                url: '/setcoupon',
                config: {
                    title: 'Create A Coupon',
                    templateUrl: 'app/dashboard/surcharge/setcoupon.html'
                }
            }, {
                url: '/setcoupon/:couponId',
                config: {
                    title: 'Create A Coupon',
                    templateUrl: 'app/dashboard/surcharge/setcoupon.html'
                }
            }, {
                url: '/:eventureId/seteventplan',
                config: {
                    title: 'Create An Event Plan',
                    templateUrl: 'app/dashboard/resource/seteventplan.html'
                }
            }, {
                url: '/seteventplan/:itemId',
                config: {
                    title: 'Edit An Event Plan',
                    templateUrl: 'app/dashboard/resource/seteventplan.html'
                }
            }, {
                url: '/seteventure',
                config: {
                    title: 'Create An Event',
                    templateUrl: 'app/dashboard/eventure/seteventure.html'
                }
            }, {
                url: '/seteventure/:eventureId',
                config: {
                    title: 'Edit Your Event',
                    templateUrl: 'app/dashboard/eventure/seteventure.html'
                }
            }, {
                url: '/:eventureId/setexpense',
                config: {
                    title: 'Create An Expense',
                    templateUrl: 'app/dashboard/resource/setexpense.html'
                }
            }, {
                url: '/:eventureId/setexpense/:expenseId',
                config: {
                    title: 'Edit An Expense',
                    templateUrl: 'app/dashboard/resource/setexpense.html'
                }
            }, {
                url: '/:eventureId/:listId/setfee',
                config: {
                    title: 'Create Fees & Groups',
                    templateUrl: 'app/dashboard/eventure/setfee.html'
                }
            }, {
                url: '/:eventureId/:listId/setquestion',
                config: {
                    title: 'Create Questions',
                    templateUrl: 'app/dashboard/eventure/setquestion.html'
                }
            }, {
                url: '/:eventureId/setlist/',
                config: {
                    title: 'Create A Listing',
                    templateUrl: 'app/dashboard/eventure/setlist.html'
                }
            }, {
                url: '/setlist/:listId',
                config: {
                    title: 'Edit A Listing',
                    templateUrl: 'app/dashboard/eventure/setlist.html'
                }
            }, {
                url: '/setrefund',
                config: {
                    title: 'Issue A Refund',
                    templateUrl: 'app/dashboard/admin/setrefund.html'
                }
            }, {
                url: '/setresource',
                config: {
                    title: 'Create A Resource',
                    templateUrl: 'app/dashboard/resource/setresource.html'
                }
            }, {
                url: '/setresource/:resourceId',
                config: {
                    title: 'Create A Resource',
                    templateUrl: 'app/dashboard/resource/setresource.html'
                }
            }, {
                url: '/:resourceId/setresourceitem',
                config: {
                    title: 'Create A Resource Item',
                    templateUrl: 'app/dashboard/resource/setresourceitem.html'
                }
            }, {
                url: 'setresourceitem/:itemId',
                config: {
                    title: 'Edit A Resource Item',
                    templateUrl: 'app/dashboard/resource/setresourceitem.html'
                }
            }, {
                url: '/:resourceId/setresourceitemcategory',
                config: {
                    title: 'Create A Resource Item Category',
                    templateUrl: 'app/dashboard/resource/setresourceitemcategory.html'
                }
            }, {
                url: '/:eventureId/setvolunteerjob',
                config: {
                    title: 'Create A Volunteer Job',
                    templateUrl: 'app/dashboard/volunteer/setvolunteerjob.html'
                }
            }, {
                url: '/setvolunteerjob/:jobId',
                config: {
                    title: 'Edit A Volunteer Job',
                    templateUrl: 'app/dashboard/volunteer/setvolunteerjob.html'
                }
            }, {
                url: '/setvolunteerscheduleedit/:scheduleId',
                config: {
                    title: 'Edit A Volunteer Schedule',
                    templateUrl: 'app/dashboard/volunteer/setvolunteerscheduleedit.html'
                }
            }, {
                url: '/setbundle',
                config: {
                    title: 'Create A Bundle',
                    templateUrl: 'app/dashboard/surcharge/setbundle.html'
                }
            }, {
                url: '/setbundle/:bundleId',
                config: {
                    title: 'Edit A Bundle',
                    templateUrl: 'app/dashboard/surcharge/setbundle.html'
                }
            }, {
                url: '/yearsummary/:eventureId',
                config: {
                    title: 'Year Summary',
                    templateUrl: 'app/dashboard/analytic/yearsummary.html'
                }
            }, {
                url: '/editteam/:teamId',
                config: {
                    title: 'Edit Team',
                    templateUrl: 'app/registration/team/editteam.part.html'
                }
            }, {
                url: '/registrationedit',
                config: {
                    title: 'Edit a Registration',
                    templateUrl: 'app/registration/profile/registrationedit.html'
                }
            }, {
                url: '/email',
                config: {
                    title: 'Participant Communication',
                    templateUrl: 'app/dashboard/admin/email.html'
                }
            }, {
                url: '/demographics/:eventureId',
                config: {
                    title: 'Demographics',
                    templateUrl: 'app/dashboard/analytic/demographics.html'
                }
            }, {
                url: '/marketing/:eventureId',
                config: {
                    title: 'Marketing',
                    templateUrl: 'app/dashboard/analytic/marketing.html'
                }
            }, {
                url: '/coupons/:eventureId',
                config: {
                    title: 'Coupons',
                    templateUrl: 'app/dashboard/analytic/coupons.html'
                }
            }, {
                url: '/financials/:eventureId',
                config: {
                    title: 'Financials',
                    templateUrl: 'app/dashboard/analytic/financials.html'
                }
            }, {
                url: '/volunteers/:eventureId',
                config: {
                    title: 'Volunteers',
                    templateUrl: 'app/dashboard/analytic/volunteers.html'
                }
            }, {
                url: '/charities/:eventureId',
                config: {
                    title: 'Charities',
                    templateUrl: 'app/dashboard/analytic/charities.html'
                }
            }, {
                url: '/teams/:eventureId',
                config: {
                    title: 'Teams',
                    templateUrl: 'app/dashboard/analytic/teams.html'
                }
            }, {
                url: '/deferrals/:eventureId',
                config: {
                    title: 'Deferrals',
                    templateUrl: 'app/dashboard/analytic/deferrals.html'
                }
            }, {
                url: '/transfers/:eventureId',
                config: {
                    title: 'Transfers',
                    templateUrl: 'app/dashboard/analytic/transfers.html'
                }
            }, {
                url: '/manregs/:eventureId',
                config: {
                    title: 'Manual Registrations',
                    templateUrl: 'app/dashboard/analytic/manreg.html'
                }
            }

        ];
    }
})();