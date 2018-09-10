/**
 * Alerts Controller
 */

angular
    .module('RDash.pages')
    .controller('CampaignCustomerCtrl', ['$stateParams', 'ExcelW', 'Excel', '$scope', '$http', '$filter', '$q', '$rootScope', '$timeout', 'HttpService', '$uibModal', 'toastr', '$window', '$location', CampaignCustomerCtrl]);

function CampaignCustomerCtrl($stateParams, ExcelW, Excel, $scope, $http, $filter, $q, $rootScope, $timeout, HttpService, $uibModal, toastr, $window, $location) {

    $scope.customerData = undefined;
    $scope.tableHeader = {
        questions: []
    };
    var campaignList = new HttpService("campaign/infoById/" + $stateParams.campaignId);
    campaignList.get("").then(function (data) {
        $scope.campaignInfo = data;
        var postMethod='';
        if(data.type==='SURVEY'){
            postMethod="getSurveyResponse";
        }else {
            postMethod="getCustomers";
        }
        getCustomerList(postMethod)
    }, function (e) {
        //displayToast("error", 'Error while Fetching data.Try Again!')
    });

    function getCustomerList(postMethod) {
        var campaignCustomers = new HttpService("instantBooking/"+postMethod+"/" + $stateParams.campaignId);
        campaignCustomers.get("").then(function (data) {
            if(postMethod==='getSurveyResponse'){
                $scope.customerMasterData = data.survey.surveyDetailsList;
                $scope.customerData = [].concat($scope.customerMasterData);
                $scope.tableHeader = data.survey.questionHeaders
            }else {
                $scope.customerMasterData = data.customers;
                $scope.customerData = [].concat($scope.customerMasterData);
            }
        }, function (errorMsg) {
            toastr.error(errorMsg, "Failed");
        });
    }

    /* $scope.exportToExcel = function (tables, wsnames, wbname, appname) { // ex: '#my-table'
         ExcelW(tables, wsnames, wbname, appname);
     }*/ //multiple worksheet

    $scope.exportToExcel = function () {
        $timeout(function () {
            Excel.tableToExcel('customerTableToExport', 'Customers', 'Customers.xls');
        }, 1000);
    }
}