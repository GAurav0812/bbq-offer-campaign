/**
 * Master Controller
 */

angular.module('RDash')
    .controller('MasterCtrl', ['$scope','$rootScope','$state', '$cookieStore', MasterCtrl]);

function MasterCtrl($scope,$rootScope, $state,$cookieStore) {
    /**
     * Sidebar Toggle & Cookie Control
     */
    $scope.$watch(function () {
        $rootScope.activePageTitle = $state.current.title;
        $rootScope.activePageSubTitle = $state.current.subTitle;
        $rootScope.isLoginPage = $state.current.name === 'login';

    });
    var mobileView = 992;

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() {
        $scope.$apply();
    };
}