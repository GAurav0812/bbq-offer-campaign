'use strict';
angular.module('RDash.services').factory('AuthenticationService',['Base64', '$http', '$q', 'HttpService', '$cookieStore', '$rootScope' ,function(Base64, $http, $q, HttpService, $cookieStore, $rootScope) {

    var httpService = new HttpService("user");
    var logoutService = new HttpService("user/logout");

    var AuthenticationService = {};

    AuthenticationService.authenticate = function () {
        return angular.isDefined($rootScope.globals.currentUser)
            && angular.isDefined($rootScope.globals.currentUser.userId)
            && angular.isDefined($rootScope.globals.currentUser.authData)
            && angular.isDefined($rootScope.globals.currentUser.sessionId)
    };

    AuthenticationService.getUserId = function () {
        return angular.isDefined($rootScope.globals.currentUser.userId);
    };


    AuthenticationService.init = function () {
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            var cookieUser = $rootScope.globals.currentUser;
            if (angular.isUndefined(cookieUser.userId)
                || angular.isUndefined(cookieUser.authData)
                || angular.isUndefined(cookieUser.sessionId)) {
                AuthenticationService.clearCredentials();
            }else {
                $http.defaults.headers.common['Auth'] = $rootScope.globals.currentUser.authData; // jshint ignore:line
                $http.defaults.headers.common['sessionId'] = $rootScope.globals.currentUser.sessionId; // jshint ignore:line
            }
        }
    };

    AuthenticationService.getUserInfo = function () {
        var cookieUser = $rootScope.globals.currentUser;
        // $rootScope.globals = {};
        return httpService.get('userInfo/' + cookieUser.userId).then(function (response) {
            $http.defaults.headers.common['Auth'] = cookieUser.authData; // jshint ignore:line
            $http.defaults.headers.common['sessionId'] = cookieUser.sessionId; // jshint ignore:line
            return response;

        });
    };

    AuthenticationService.login = function (username, password) {
        return httpService.post('login', {
            "userName": username,
            "password": password
        });

        /*  //OFFLINE LOGIN
         var loginResponse = {
         message : "1280918200@1"
         }
         return $q.resolve(loginResponse);*/
    };

    AuthenticationService.logout = function () {
        return logoutService.get('');
    };

    AuthenticationService.setCredentials = function (username, password, sessionId) {
        var sessionTimeStamp = sessionId.split("@")[0];
        var authData = Base64.encode(username + ':' + password + ":" + sessionTimeStamp);
        $rootScope.globals = {
            currentUser: {
                userId: sessionId.split("@")[1],
                authData: authData,
                sessionId: sessionId
            }
        };

        $http.defaults.headers.common['Auth'] = authData; // jshint ignore:line
        $http.defaults.headers.common['sessionId'] = sessionId; // jshint ignore:line
        $cookieStore.put('globals', $rootScope.globals);
    };

    AuthenticationService.clearCredentials = function () {
        $rootScope.globals = {};
        $cookieStore.remove('globals');
        $http.defaults.headers.common.Authorization = '';
    };

    return AuthenticationService;

}]);
