/**
 * Alerts Controller
 */

angular
    .module('RDash.pages')
    .controller('LoginCtrl', ['$scope','AuthenticationService','$location','toastr', LoginCtrl]);

function LoginCtrl($scope,AuthenticationService,$location,toastr) {
    $scope.userLoginInfo = {
        username: "",
        password: ""
    };
    $scope.loginForm = {};

    // reset login status
    AuthenticationService.clearCredentials();


    $scope.login = function (isValid) {
        if (isValid) {
            $scope.dataLoading = true;
            AuthenticationService.login($scope.userLoginInfo.username, $scope.userLoginInfo.password).then(function (response) {
                $scope.dataLoading = false;
                AuthenticationService.setCredentials($scope.userLoginInfo.username, $scope.userLoginInfo.password, response.message, response.menuAccess,response.outletAccess);
                $location.path('/dashboard');
            }, function (response) {
                $scope.dataLoading = false;
                toastr.error(response, "Error");
            });
        }
    };
}