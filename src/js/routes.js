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
                controller: 'HomeCtrl'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })
            .state('profile', {
                url: '/profile/:userId',
                templateUrl: 'templates/profile.html',
                controller: 'UserCtrl'
            })
            .state('templates', {
                url: '/templates',
                templateUrl: 'templates/templates.html',
                controller: 'TemplateCtrl'
            })
            .state('questions', {
                url: '/questions',
                templateUrl: 'templates/questions.html',
                controller: 'QuestionCtrl'
            })
            .state('createQuestion', {
                url: '/question/add',
                templateUrl: 'templates/question.create.html',
                controller: 'QuestionCtrl'
            })
            .state('createTemplate', {
                url: '/template/add',
                templateUrl: 'templates/template.create.html',
                controller: 'TemplateCtrl'
            })
            .state('campaigns', {
                url: '/campaigns',
                templateUrl: 'templates/campaign.manage.html',
                controller: 'CampaignCtrl'
            });
    }
]);