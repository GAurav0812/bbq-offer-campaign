/**
 * Alerts Controller
 */

angular
    .module('RDash.pages')
    .controller('CampaignCtrl', ['$scope', '$q', '$timeout', 'HttpService', '$uibModal', 'toastr', 'Upload', CampaignCtrl]);

function CampaignCtrl($scope, $q, $timeout, HttpService, $uibModal, toastr, Upload) {


    function getCampaignList() {
        var campaignList = new HttpService("campaign/list");
        campaignList.get("").then(function (data) {
            $scope.campaignListData = $scope.campaignListMasterData = data.campaigns;
        }, function (e) {
            //displayToast("error", 'Error while Fetching data.Try Again!')
        });
    }

    getCampaignList();
    var editCampaignInfo;
    $scope.editCampaignInfoModal = function (item) {
        console.info(item);
        editCampaignInfo = $uibModal.open({
            animation: true,
            templateUrl: '../templates/campaign/edit.campaign.html',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            scope: $scope
        });
    };
    var CampaignObj = {
        closeMessage: "",
        endDate: "",
        mobileCsv: "",
        name: "",
        questionTemplate: null,
        smsTemplate: "",
        startDate: "",
        headerTemplate: [
            {
                noOfAdult: "",
                voucherId: "",
                columnLabel: "",
                voucherLabel: ""
            }
        ]
    };
    $scope.newCampaign = {
        form1: {},
        form2: {},
        form3: {},
        info: CampaignObj
    };
    $scope.CampaignSubTypeListt = [
        {id: 1, label: "Pre-Validated"},
        {id: 2, label: "Open Campaign"}
    ]
    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };
    $scope.popup1 = {
        opened: false
    };
    $scope.open2 = function () {
        $scope.popup2.opened = true;
    };
    $scope.popup2 = {
        opened: false
    };
    $scope.addRow = function (index) {
        var obj = {noOfAdult: "", voucherId: "", columnLabel: "", voucherLabel: ""};
        if ($scope.newCampaign.info.headerTemplate.length <= index + 1) {
            $scope.newCampaign.info.headerTemplate.splice(index + 1, 0, obj);
        }
    };
    $scope.deleteRow = function ($event, index) {
        if ($event.which == 1)
            $scope.newCampaign.info.headerTemplate.splice(index, 1);
    };
    $scope.upload = {
        mobileCsv: undefined,
    };
    var uploadMobileService;
    $scope.uploadMobileCsv = function (file) {
        if (file != null) {
            $scope.invalidMobileCsv = false;
            var curDate = new Date();
            $scope.mobileCsvUploading = true;
            var folderName;
            var label = 'mobile';
            folderName = $scope.newCampaign.mobileCsv.indexOf("/") >= 0 ? $scope.newCampaign.mobileCsv.split("/")[0] : ("mobile_csv" + curDate.getTime());
            uploadMobileService = Upload.upload({
                url: '../instant-1.0/rest/campaign/upload?fn=' + folderName + '&csv=' + label,
                data: {file: file}
            });
            uploadMobileService.then(function (resp) {
                if (resp.data.messageType === "SUCCESS") {
                    toastr.success("File uploaded successfully", "Success");
                    $scope.newCampaign.info.mobileCsv = resp.data.filePath;
                    $scope.mobileCsvUploading = false;
                    $scope.newCampaign.mobileCsv = "";
                } else if (resp.data.messageType === "FAILURE") {
                    toastr.error(resp.data.message, "Failed");
                    $scope.upload.mobileCsv = undefined;
                    $scope.invalidMobileCsv = true;
                    $scope.mobileCsvUploading = false;
                    $scope.newCampaign.mobileCsv = ""
                }
            }, function (resp) {
                $scope.mobileCsvUploading = false;
                $scope.upload.mobileCsv = undefined;
                $scope.newCampaign.mobileCsv = ""
            });
        } else {
            $scope.invalidMobileCsv = true;
        }
    };

    $scope.enterValidation = function () {
        return true;
    };

    $scope.exitValidation = function () {
        return true;
    };
//example using context object
    $scope.exitValidation = function (context) {
        return context.firstName === "Jacob";
    }
//example using promises
    $scope.exitValidation = function () {
        var d = $q.defer()
        $timeout(function () {
            return d.resolve(true);
        }, 2000);
        return d.promise;
    }

}