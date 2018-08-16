'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('RDash').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/dashboard');

        // Application routes
        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'templates/dashboard.html',
                controller: 'HomeCtrl',
                title: 'Dashboard',
                subTitle: 'Dashboard'
            })
            .state('login', {
                url: '/login',
                views: {
                    'auth': {
                        controller: 'LoginCtrl',
                        templateUrl: 'templates/login.html'
                    }
                }
            })
            .state('profile', {
                url: '/profile/:userId',
                templateUrl: 'templates/profile.html',
                controller: 'UserCtrl',
                title: 'Profile',
                subTitle: 'Profile'
            })
            .state('campaign', {
                url: '/campaign',
                templateUrl: 'templates/campaign/campaigns.html',
                controller: 'CampaignCtrl',
                title: 'Campaign',
                subTitle: 'Campaign'
            })
            .state('createCampaign', {
                url: '/campaign/add',
                templateUrl: 'templates/campaign/campaign.create.html',
                controller: 'CampaignCtrl',
                title: 'Campaign',
                subTitle: 'Campaign / Add'
            });
    }
]);