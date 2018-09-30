/**
 * Alerts Controller
 */

angular
    .module('RDash.pages')
    .controller('EditCampaignCtrl', ['$stateParams', '$http', '$rootScope', '$filter', '$scope', '$q', '$timeout', 'ValidationServices', 'HttpService', 'Campaign', '$uibModal', 'Upload', 'toastr', '$window', '$location', EditCampaignCtrl]);

function EditCampaignCtrl($stateParams, $http, $rootScope, $filter, $scope, $q, $timeout, ValidationServices, HttpService, Campaign, $uibModal, Upload, toastr, $window, $location) {

    $scope.format = 'dd-MMMM-yyyy';
    var CampaignObj = {
        closeMessage: "",
        endDate: "",
        mobileCsv: "",
        subTypeId: null,
        name: "",
        questionTemplate: {
            questions: [
                {
                    answers: [
                        {
                            description: ""
                        }
                    ],
                    description: "",
                    type: ""
                }
            ],
            title: "DEMO",
            numberOfQuestion:undefined,
            templateId: null
        },
        smsTemplate: "",
        startDate: "",
        termsAndCondition: {
            title: "",
            description: "",
            customMessage: "",
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
        type: ''
    };
    $scope.allCity = {
        checked: false
    };
    $scope.allBranch = {
        checked: false
    };
    $scope.editCampaign = {
        form1: {},
        form2: {},
        form3: {},
        info: CampaignObj
    };
    $scope.questionType = [
        {value: 'SINGLESELECT', label: 'Single Selection'},
        {value: 'MULTISELECT', label: 'Multi Selection'},
        {value: 'OPENTEXT', label: 'Open Text'},
        {value: 'FILLTEXT', label: 'Fill in the blank'}];
    $scope.questionFormat = [{id: null, description: '', type: "", answers: [{description: ""}]}];
    $scope.addNewColumn = function () {
        var newItemNo = $scope.questionFormat.length + 1;
        $scope.questionFormat.push({
            id: 0,
            description: '',
            type: "",
            answers: [{description: ""}]
        });
    };


    $scope.removeColumn = function (index) {
        $scope.questionFormat.splice(index, 1);
        if ($scope.questionFormat.length() === 0 || $scope.questionFormat.length() == null) {
            $scope.questionFormat.push = [{
                id: 0,
                description: '',
                type: "",
                answers: [{description: ""}]
            }];
        }
    };
    $scope.addQuestion = function (item, index) {
        var questionIndex = $scope.questionFormat.indexOf(item);
        var obj = {id: 0, description: ""};
        if ($scope.questionFormat[questionIndex].answers.length <= index + 1) {
            $scope.questionFormat[questionIndex].answers.splice(index + 1, 0, obj);
        }
    };
    $scope.deleteQuestion = function ($event, item, index) {
        var questionIndex = $scope.questionFormat.indexOf(item);
        if ($event.which == 1)
            $scope.questionFormat[questionIndex].answers.splice(index, 1);
    };
    $scope.setAnswerData = function (item, index) {
        if (item.type === 'FILLTEXT')
            $scope.questionFormat[index].description = undefined;
    };
    getCityList();

    function getSubTypeList(type) {
        var postMethod = '';
        postMethod = type === 'NORMAL' ? 'normal' : 'survey';
        var subTypeList = new HttpService("campaign/list/subType/" + postMethod);
        subTypeList.get("").then(function (data) {
            $scope.CampaignSubTypeList = data.subTypes;
            var selectedSubType = $filter('filter')($scope.CampaignSubTypeList, {id: $scope.campaignInfo.subTypeId}, true);
            $scope.selected.subType = selectedSubType[0];
        }, function (e) {
            //displayToast("error", 'Error while Fetching data.Try Again!')
        });
    }

    function getCityList() {
        $http.get("../../campaignData/city.json").then(function (response) {
            $scope.cityList = response.data.city;
            getCampaignInfo();
        }, function (e) {
            toastr.error('Failed!Unable to fetch City List!', "Try Again");
            //displayToast("error", 'Error while Fetching data.Try Again!')
        });
    }

    $scope.getBranchByCityId = function () {
        $scope.branchList = [];
        for (var i = 0; i < $scope.selected.city.length; i++) {
            for (var j = 0; j < $scope.selected.city[i].branch.length; j++) {
                $scope.branchList.push($scope.selected.city[i].branch[j]);
            }
        }
    };

    function getBranchByCityId(cityArr, branchArr) {
        $scope.branchList = [];
        for (var i = 0; i < cityArr.length; i++) {
            for (var j = 0; j < cityArr[i].branch.length; j++) {
                $scope.branchList.push(cityArr[i].branch[j]);
            }
        }
        var tempBranchArr = [];
        for (var k = 0; k < branchArr.length; k++) {
            var tempBranch = $filter('filter')($scope.branchList, {branchId: branchArr[k]});
            if (angular.isDefined(tempBranch)) {
                tempBranchArr.push(tempBranch[0]);
            }
        }
        $scope.selected.branch = tempBranchArr;
    }

    $scope.campaign = {
        status: false
    };

    function getCampaignInfo() {
        var campaignList = new HttpService("campaign/infoById/" + $stateParams.campaignId);
        campaignList.get("").then(function (data) {
            $scope.campaignInfo = data;
            getSubTypeList(data.type);
            $scope.questionFormat = data.questionTemplate.questions;
            var cityData = JSON.parse(data.city);
            $scope.allCity.checked = cityData.allSelected === true;
            var CityIdArr = cityData.cityId;
            $scope.tempCityObj = {};
            var tempCityArr = [];
            for (var i = 0; i < CityIdArr.length; i++) {
                var cityArr = $filter('filter')($scope.cityList, {cityId: CityIdArr[i]});
                if (angular.isDefined(cityArr)) {
                    $scope.tempCityObj = cityArr[0];
                    tempCityArr.push($scope.tempCityObj);
                }
            }
            $scope.selected.city = tempCityArr;
            var branchData = JSON.parse(data.branch);
            var BranchIdArr = branchData.branchId;
            $scope.allBranch.checked = branchData.allSelected === true;
            $scope.campaign.status = data.status === 'A';
            var userInfo = {};
            userInfo = angular.copy(data);
            userInfo.termsAndCondition.offerDetails = JSON.parse(data.termsAndCondition.offerDetails);
            var sd = new Date(data.startDate);
            var ed = new Date(data.endDate);
            userInfo.startDate = $filter('date')(sd, 'yyyy-MM-dd');
            userInfo.endDate = $filter('date')(ed, 'yyyy-MM-dd');
            getBranchByCityId($scope.selected.city, BranchIdArr);
            $scope.editCampaign.info = angular.copy(userInfo);
        }, function (e) {
            //displayToast("error", 'Error while Fetching data.Try Again!')
        });
    }

    $scope.isNumeric = ValidationServices.isNumeric;
    $scope.isInteger = function isInteger(val) {
        var regex = /^\d+$/;
        return regex.test(val);
    };
    $scope.isValidSmsTemplate = function isValidSmsTemplate(val) {
        return !!val.includes("%cpn%");
    };
    $scope.isValidFillText = function isValidFillText(type, val) {
        if (angular.isDefined(val)) {
            if (type === 'FILLTEXT') {
                return !!val.includes("%_%");
            } else {
                return true
            }
        }
    };
    $scope.curDate = new Date();
    $scope.open1 = function () {
        $scope.popup1.opened = true;
        $scope.editCampaign.info.endDate = '';
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
        if ($scope.campaign.status === true) {
            $scope.editCampaign.info.status = 'A';
        } else {
            $scope.editCampaign.info.status = 'I'
        }
        var city = {
            allSelected: false,
            cityId: []
        };
        $scope.isLoading = true;
        if ($scope.allCity.checked) {
            city.allSelected = true;
            /* for (var i = 0; i < $scope.cityList.length; i++) {
                 city.cityIds.push($scope.cityList[i].cityId);
             }*/
        } else {
            city.allSelected = false;
            for (var i = 0; i < $scope.selected.city.length; i++) {
                if (!$scope.allBranch.checked) {
                    var tempBranch = $filter('filter')($scope.selected.branch, {cityId: $scope.selected.city[i].cityId});
                    if (angular.isDefined(tempBranch[0])) {
                        city.cityId.push($scope.selected.city[i].cityId);
                    }
                } else {
                    city.cityId.push($scope.selected.city[i].cityId);
                }
            }
        }
        var branch = {
            allSelected: false,
            branchId: []
        };
        if ($scope.allBranch.checked) {
            branch.allSelected = true;
            /* for (var i = 0; i < $scope.cityList.length; i++) {
                 city.cityIds.push($scope.cityList[i].cityId);
             }*/
        } else {
            branch.allSelected = false;
            for (var j = 0; j < $scope.selected.branch.length; j++) {
                var tempCity = $filter('filter')($scope.selected.city, {cityId: $scope.selected.branch[j].cityId});
                if (angular.isDefined(tempCity[0])) {
                    branch.branchId.push($scope.selected.branch[j].branchId);
                }
            }
        }
        var postMethod = '';
        postMethod = $scope.editCampaign.type === 'NORMAL' ? 'normal' : 'survey';
        switch ($scope.selected.type) {
            case 'NORMAL':
                $scope.editCampaign.info.questionTemplate = null;
                break;
            default:
                $scope.editCampaign.info.questionTemplate.questions = $scope.questionFormat;
                break;
        }
        $scope.editCampaign.info.questionTemplate.numberOfQuestion = parseInt($scope.editCampaign.info.questionTemplate.numberOfQuestion);
        var createCampaign = new HttpService("campaign/update/normal");
        createCampaign.post('', Campaign.updateObject($scope.editCampaign.info, city, branch)).then(function (response) {
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