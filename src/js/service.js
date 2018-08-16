'use strict';
angular.module('RDash').run(['$rootScope', '$location', 'AuthenticationService',
    function ($rootScope, $location, AuthenticationService) {
        // keep user logged in after page refresh
        AuthenticationService.init();

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            setPageLocation();
        });
        setPageLocation();

        function setPageLocation() {
            if (AuthenticationService.authenticate()) {
                if ($location.path() === '/login' || $location.path() === "" || $location.path() === '/') {
                    $location.path('/dashboard');
                }
            } else {
                if ($location.path() !== '/login')
                    $location.path('/login');
            }
        }

    }]);
