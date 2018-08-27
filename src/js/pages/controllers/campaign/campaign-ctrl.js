/**
 * Alerts Controller
 */

angular
    .module('RDash.pages')
    .controller('CampaignCtrl', ['$scope', '$q','$rootScope', '$timeout', 'ValidationServices', 'HttpService', 'Campaign', '$uibModal', 'Upload', 'toastr', '$window', '$location', 'editableOptions', 'editableThemes', CampaignCtrl]);

function CampaignCtrl($scope, $q, $rootScope,$timeout, ValidationServices, HttpService, Campaign, $uibModal, Upload, toastr, $window, $location, editableOptions, editableThemes) {

    $scope.format = 'dd-MMMM-yyyy';
    $scope.curDate = new Date();
    $scope.altInputFormat = [];

    $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1
    };
    $scope.campaignDataLoaded = false;
    $scope.domain = $location.protocol() + "://" + $location.host() + "/offer";

    function getCampaignList() {
        $scope.campaignDataLoaded = false;
        var campaignList = new HttpService("campaign/list");
        campaignList.get("").then(function (data) {
            $scope.tempCampData = data.campaigns;
            $scope.campaignListMasterData = $scope.tempCampData.slice().reverse();
            $scope.campaignListData = [].concat($scope.campaignListMasterData);
            $scope.campaignDataLoaded = true;
        }, function (data) {
            toastr.error('Failed!Unable to fetch Campaign List!', "Try Again");
            //displayToast("error", 'Error while Fetching data.Try Again!')
        });
    }

    $scope.statusOptions = [
        {id: 'A', text: 'Active'},
        {id: 'I', text: 'InActive'}
    ];

    function getSubTypeList() {
        var subTypeList = new HttpService("campaign/list/subType/normal");
        subTypeList.get("").then(function (data) {
            $scope.CampaignSubTypeList = data.subTypes;
        }, function (e) {
            //displayToast("error", 'Error while Fetching data.Try Again!')
        });
    }
    function getCityList() {
        var cityList = new HttpService("campaign/list/city");
        cityList.get("").then(function (data) {
            $scope.cityList = JSON.parse(data.city);
        }, function (e) {
            toastr.error('Failed!Unable to fetch City List!', "Try Again");
            //displayToast("error", 'Error while Fetching data.Try Again!')
        });
    }

    $scope.isNumeric = ValidationServices.isNumeric;
    $scope.isValidSmsTemplate = function isValidSmsTemplate(val) {
        return !!val.includes("%cpn%");
    };
    getSubTypeList();
    getCampaignList();
    getCityList();
    $scope.allCity = {
        checked: false
    };
    var CampaignObj = {
        closeMessage: "",
        endDate: "",
        mobileCsv: "",
        subTypeId: null,
        name: "",
        createdBy:parseInt($rootScope.globals.currentUser.userId),
        questionTemplate: null,
        smsTemplate: "Your celebration starts when you get to share this exclusive code %cpn%, during your visit to Barbeque Nation.",
        startDate: "",
        termsTemplate: {
            title: "",
            description: "",
            customMessage:"",
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
        subType: "",
        type: "NORMAL"
    };
    $scope.newCampaign = {
        form1: {},
        form2: {},
        form3: {},
        info: CampaignObj
    };

    var viewCampaignInfoModal;
    $scope.viewCampaignInfoModal = function (item) {
        $scope.campaignInfo = item;
        viewCampaignInfoModal = $uibModal.open({
            animation: true,
            templateUrl: 'templates/campaign/preview.html',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            scope: $scope
        });
    };
    $scope.goToEditPage = function (item) {
        $location.path('/campaign/edit/' + item.id);
    };

    $scope.open1 = function () {
        $scope.popup1.opened = true;
        //$scope.newCampaign.info.endDate='';
    };
    $scope.popup1 = {
        opened: false
    };
    $scope.open2 = function () {
        $scope.popup2.opened = true;
        setMinMaxDate($scope.newCampaign.info.startDate);
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
        if ($scope.newCampaign.info.termsTemplate.offerDetails.length <= index + 1) {
            $scope.newCampaign.info.termsTemplate.offerDetails.splice(index + 1, 0, obj);
        }
    };
    $scope.deleteRow = function ($event, index) {
        if ($event.which == 1)
            $scope.newCampaign.info.termsTemplate.offerDetails.splice(index, 1);
    };
    $scope.csv = {
        file: undefined,
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
            folderName = $scope.newCampaign.info.mobileCsv.indexOf("/") >= 0 ? $scope.newCampaign.info.mobileCsv.split("/")[0] : ("mobile_csv" + curDate.getTime());
            uploadMobileService = Upload.upload({
                url: '../instant-1.0/rest/campaign/upload?fn=' + folderName + "&csv=mobile",
                data: {file: file}
            });
            uploadMobileService.then(function (resp) {
                if (resp.data.messageType === "SUCCESS") {
                    toastr.success("File uploaded successfully", "Success");
                    $scope.newCampaign.info.mobileCsv = resp.data.filePath;
                    $scope.mobileCsvUploading = false;
                } else if (resp.data.messageType === "FAILURE") {
                    toastr.error(resp.data.message, "Failed");
                    $scope.csv.file = undefined;
                    $scope.invalidMobileCsv = true;
                    $scope.mobileCsvUploading = false;
                    $scope.newCampaign.info.mobileCsv = '';
                }
            }, function (resp) {
                $scope.mobileCsvUploading = false;
                $scope.csv.file = undefined;
                $scope.newCampaign.info.mobileCsv = '';
            }, function (evt) {
                $scope.dynamic = parseInt(100.0 * evt.loaded / evt.total);
            });
        }
    };

    $scope.deleteUploadedImage = function () {
        $scope.csv.file = undefined;
        $scope.newCampaign.info.mobileCsv = '';
    };
    var generateLinkModal;
    $scope.generateLinkModal = function (item) {
        $scope.generateUrlInfo = item;
        $scope.domain = $location.protocol() + "://" + $location.host() + "/offer";
        generateLinkModal = $uibModal.open({
            animation: true,
            templateUrl: 'templates/campaign/get.link.html',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            scope: $scope
        });
    };
    var csvInstructionModal;
    $scope.csvInstruction = function () {
        csvInstructionModal = $uibModal.open({
            animation: true,
            templateUrl: 'templates/campaign/csvInstruction.html',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            scope: $scope
        });
    };
    var viewPlaceHolderModal;
    $scope.openPlaceHolderInfoBox = function () {
        viewPlaceHolderModal = $uibModal.open({
            animation: true,
            templateUrl: 'templates/campaign/view.placeholder.html',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            scope: $scope
        });
    };

    $scope.creatingCampaign = false;
    $scope.createCampaign = function () {
        var cityIds = [];
        $scope.isLoading = true;
      /*  if($scope.allCity.checked){
            for (var i = 0; i < $scope.cityList.length; i++) {
                cityIds.push($scope.cityList[i].cityId);
            }
        }else {*/
            for (var i = 0; i < $scope.selected.city.length; i++) {
                cityIds.push($scope.selected.city[i].cityId);
            }
        /*}*/
        $scope.creatingCampaign = true;
        $scope.newCampaign.info.subTypeId = $scope.selected.subType.id;
        var createCampaign = new HttpService("campaign/create/normal");
        createCampaign.post('', Campaign.createObject($scope.newCampaign.info,cityIds)).then(function (response) {
            toastr.success("Campaign created successfully!", "Success");
            $scope.newCampaign.info = CampaignObj;
            $scope.selected.subType = '';
            $location.path("/campaign");
            $scope.creatingCampaign = false;
        }, function (errorMsg) {
            toastr.error(errorMsg, "Failed");
            $scope.creatingCampaign = false;
        });
    };
    editableOptions.theme = 'bs3';
    editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-md btn-with-icon"><i class="fa fa-check fa-lg" aria-hidden="true"></i></button>';
    editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-md btn-with-icon"><i class="fa fa-close fa-lg"></i></button>';

}