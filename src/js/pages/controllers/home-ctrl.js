/**
 * Alerts Controller
 */

angular
    .module('RDash.pages')
    .controller('HomeCtrl', ['$scope', 'HttpService', '$filter', HomeCtrl]);

function HomeCtrl($scope, HttpService, $filter) {

    $scope.offerCampCount=0;
    $scope.surveyCampCount=0;
    getCampaignList();

    function getCampaignList() {
        var campaignList = new HttpService("campaign/list");
        campaignList.get("").then(function (data) {
            $scope.offerCampCount = $filter('filter')(data.campaigns, {type: 'NORMAL'}, true).length;
            $scope.surveyCampCount = $filter('filter')(data.campaigns, {type: 'SURVEY'}, true).length;
        }, function (e) {
            //displayToast("error", 'Error while Fetching data.Try Again!')
        });
    }

    /* $scope.alerts = [{
         type: 'success',
         msg: 'Thanks for visiting! Feel free to create pull requests to improve the dashboard!'
     }, {
         type: 'danger',
         msg: 'Found a bug? Create an issue with as many details as you can.'
     }];

     $scope.addAlert = function() {
         $scope.alerts.push({
             msg: 'Another alert!'
         });
     };

     $scope.closeAlert = function(index) {
         $scope.alerts.splice(index, 1);
     };*/
}