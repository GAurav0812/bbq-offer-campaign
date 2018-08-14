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
            .state('index', {
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
            .state('header', {
                url: '/headers',
                templateUrl: 'templates/headers.html',
                controller: 'HeaderCtrl',
                title: 'Header',
                subTitle: 'Header'
            })
            .state('createHeader', {
                url: '/header/add',
                templateUrl: 'templates/header.create.html',
                controller: 'HeaderCtrl',
                title: 'Header',
                subTitle: 'Header / Add'
            })
            .state('campaigns', {
                url: '/campaigns',
                templateUrl: 'templates/campaigns.html',
                controller: 'CampaignCtrl',
                title: 'Campaign',
                subTitle: 'Campaign'
            })
            .state('createCampaign', {
                url: '/campaign/add',
                templateUrl: 'templates/campaign.create.html',
                controller: 'CampaignCtrl',
                title: 'Campaign',
                subTitle: 'Campaign / Add'
            });
    }
]);