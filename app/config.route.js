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
                url: '/eventure',
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
                url: '/couponaddon',
                config: {
                    title: 'Coupons & Addons',
                    templateUrl: 'app/dashboard/couponaddon.html',
                    settings: {
                        nav: 4,
                        content: 'Coupons & Addons'
                    }
                }
            }, {
                url: '/resourcecenter',
                config: {
                    title: 'Resources',
                    templateUrl: 'app/dashboard/resourcecenter.html',
                    settings: {
                        nav: 5,
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
                        nav: 6,
                        content: 'Reporting'
                    }
                }
            },
            {
                url: '/elistcenter',
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
                url: '/resourcedetail',
                config: {
                    title: 'Resource Detail',
                    templateUrl: 'app/dashboard/resourcedetail.html'
                }
            }, {
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
                url: '/seteventplan',
                config: {
                    title: 'Create An Event Plan',
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
                url: '/setexpense',
                config: {
                    title: 'Create An Expense',
                    templateUrl: 'app/dashboard/setup/setexpense.html'
                }
            }, {
                url: '/setfee',
                config: {
                    title: 'Create Fees & Groups',
                    templateUrl: 'app/dashboard/setup/setfee.html'
                }
            }, {
                url: '/setlist',
                config: {
                    title: 'Create A Listing',
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
            },{
                url: '/kitchensink',
                config: {
                    title: 'Kitchen Sink',
                    templateUrl: 'app/dashboard/kitchensink.html'
                }
            }
        ];
    }
})();
