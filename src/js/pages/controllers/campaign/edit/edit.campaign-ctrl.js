/**
 * Alerts Controller
 */

angular
    .module('RDash.pages')
    .controller('EditCampaignCtrl', ['$stateParams', '$filter', '$scope', '$q', '$timeout', 'ValidationServices', 'HttpService', 'Campaign', '$uibModal', 'Upload', 'toastr', '$window', '$location', EditCampaignCtrl]);

function EditCampaignCtrl($stateParams, $filter, $scope, $q, $timeout, ValidationServices, HttpService, Campaign, $uibModal, Upload, toastr, $window, $location) {

    $scope.format = 'dd-MMMM-yyyy';
    var CampaignObj = {
        closeMessage: "",
        endDate: "",
        mobileCsv: "",
        subTypeId: null,
        name: "",
        questionTemplate: null,
        smsTemplate: "",
        startDate: "",
        termsAndCondition: {
            title: "",
            description: "",
            offerDetails: [
                {
                    paxNo: "",
                    headerId: "",
                    voucherDetails: "",
                    voucherValue: ""
                }
            ]
        }

    };
    $scope.selected = {
        subType: ""
    };

    $scope.editCampaign = {
        form1: {},
        form2: {},
        form3: {},
        info: CampaignObj
    };

    function getSubTypeList() {
        var subTypeList = new HttpService("campaign/list/subType/normal");
        subTypeList.get("").then(function (data) {
            $scope.CampaignSubTypeList = data.subTypes;
            getCampaignInfo();
        }, function (e) {
            //displayToast("error", 'Error while Fetching data.Try Again!')
        });
    }

    $scope.campaign = {
        status: false
    };

    function getCampaignInfo() {
        var campaignList = new HttpService("campaign/infoById/" + $stateParams.campaignId);
        campaignList.get("").then(function (data) {
            $scope.campaignInfo = data;
            var selectedSubType = $filter('filter')($scope.CampaignSubTypeList, {id: data.subTypeId}, true);
            $scope.selected.subType = selectedSubType[0];
            $scope.campaign.status = data.status === 'A';
            var userInfo = {};
            userInfo = angular.copy(data);
            userInfo.termsAndCondition.offerDetails = JSON.parse(data.termsAndCondition.offerDetails);
            var sd = new Date(data.startDate);
            var ed = new Date(data.endDate);
            userInfo.startDate = $filter('date')(sd, 'yyyy-MM-dd');
            userInfo.endDate = $filter('date')(ed, 'yyyy-MM-dd');
            $scope.editCampaign.info = angular.copy(userInfo);
        }, function (e) {
            //displayToast("error", 'Error while Fetching data.Try Again!')
        });
    }

    $scope.isNumeric = ValidationServices.isNumeric;

    $scope.isValidSmsTemplate = function isValidSmsTemplate(val) {
        return !!val.includes("%cpn%");
    };
    $scope.curDate = new Date();
    getSubTypeList();
    $scope.open1 = function () {
        $scope.popup1.opened = true;
        $scope.editCampaign.info.endDate='';
    };
    $scope.popup1 = {
        opened: false
    };
    $scope.open2 = function () {
        $scope.popup2.opened = true;
        setMinMaxDate($scope.editCampaign.info.startDate)
    };
    $scope.popup2 = {
        opened: false
    };
    function setMinMaxDate(dt) {
        var date = new Date(dt);
        $scope.endMinDate = date;
    }
    $scope.addRow = function (index) {
        var obj = {paxNo: "", headerId: "", voucherDetails: "", voucherValue: ""};
        if ($scope.editCampaign.info.termsAndCondition.offerDetails.length <= index + 1) {
            $scope.editCampaign.info.termsAndCondition.offerDetails.splice(index + 1, 0, obj);
        }
    };
    $scope.deleteRow = function ($event, index) {
        if ($event.which === 1)
            $scope.editCampaign.info.termsAndCondition.offerDetails.splice(index, 1);
    };
    $scope.upload = {
        mobileCsv: undefined,
    };
    $scope.dynamic = 0;
    var uploadMobileService;
    $scope.uploadMobileCsv = function (file) {
        if (file == null) {
            $scope.invalidMobileCsv = true;
        } else {
            $scope.invalidMobileCsv = false;
            var curDate = new Date();
            $scope.mobileCsvUploading = true;
            var folderName;
            var label = 'mobile';
            folderName = $scope.editCampaign.info.mobileCsv.indexOf("/") >= 0 ? $scope.editCampaign.info.mobileCsv.split("/")[0] : ("mobile_csv" + curDate.getTime());
            uploadMobileService = Upload.upload({
                url: '../instant-1.0/rest/campaign/upload?fn=' + folderName,
                data: {file: file}
            });
            uploadMobileService.then(function (resp) {
                if (resp.data.messageType === "SUCCESS") {
                    toastr.success("File uploaded successfully", "Success");
                    $scope.upload.mobileCsv = "";
                    $scope.editCampaign.info.mobileCsv = resp.data.filePath;
                    $scope.mobileCsvUploading = false;
                } else if (resp.data.messageType === "FAILURE") {
                    toastr.error(resp.data.message, "Failed");
                    $scope.upload.mobileCsv = "";
                    $scope.invalidMobileCsv = true;
                    $scope.mobileCsvUploading = false;
                }
            }, function (resp) {
                $scope.mobileCsvUploading = false;
                $scope.upload.mobileCsv = "";
            }, function (evt) {
                $scope.dynamic = parseInt(100.0 * evt.loaded / evt.total);
            });
        }
    };


    $scope.updateCampaign = function () {
        $scope.editCampaign.info.subTypeId = $scope.selected.subType.id;
        if($scope.campaign.status===true){
            $scope.editCampaign.info.status='A';
        }else {
            $scope.editCampaign.info.status='I'
        };
        var createCampaign = new HttpService("campaign/update/normal");
        createCampaign.post('', Campaign.updateObject($scope.editCampaign.info)).then(function (response) {
            toastr.success("Campaign updated successfully!", "Success");
            $scope.editCampaign.info = CampaignObj;
            $scope.selected.subType = '';
            $scope.campaign.status = $scope.editCampaign.info.status === 'A';
            $location.path("/campaign");
        }, function (errorMsg) {
            $scope.campaign.status = $scope.editCampaign.info.status === 'A';
            toastr.error(errorMsg, "Failed");
        });
    };
}