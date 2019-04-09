/**
 * Alerts Controller
 */

angular
    .module('RDash.pages')
    .controller('CampaignCtrl', ['$scope', '$http', '$filter', '$q', '$rootScope', '$timeout', 'ValidationServices', 'HttpService', 'Campaign', '$uibModal', 'Upload', 'toastr', '$window', '$location', 'editableOptions', 'editableThemes', CampaignCtrl]);

function CampaignCtrl($scope, $http, $filter, $q, $rootScope, $timeout, ValidationServices, HttpService, Campaign, $uibModal, Upload, toastr, $window, $location, editableOptions, editableThemes) {

    $scope.format = 'dd-MMMM-yyyy';
    $scope.curDate = new Date();
    $scope.altInputFormat = [];
    $scope.campaignPageSize = 10;
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
            $scope.normalCampaignListMasterData = $filter('filter')( data.campaigns, {type: "NORMAL"}).slice().reverse();
            $scope.normalCampaignListData = [].concat($scope.normalCampaignListMasterData);
            $scope.surveyCampaignListMasterData = $filter('filter')( data.campaigns, {type: "SURVEY"}).slice().reverse();
            $scope.surveyCampaignListData = [].concat($scope.surveyCampaignListMasterData);
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
    $scope.campaignStartPage = true;
    $scope.startCreateCampaign = function () {
        getSubTypeList();
        $scope.campaignStartPage = !$scope.campaignStartPage;
    };
    $scope.backToSelectionForm = function () {
        $scope.campaignStartPage = !$scope.campaignStartPage;
    };
    $scope.CampaignTypeList = [
        {id: 'NORMAL', text: 'Normal'},
        {id: 'SURVEY', text: 'Survey'}
    ];
    $scope.branchList = [];

    function getSubTypeList() {
        var postMethod = '';
        postMethod = $scope.selected.type === 'NORMAL' ? 'normal' : 'survey';
        var subTypeList = new HttpService("campaign/list/subType/" + postMethod);
        subTypeList.get("").then(function (data) {
            $scope.CampaignSubTypeList = data.subTypes;
        }, function (e) {
            //displayToast("error", 'Error while Fetching data.Try Again!')
        });
    }

    function getCityList() {
        $http.get("../../campaignData/city.json").then(function (response) {
            $scope.cityList = response.data.city;
        }, function (e) {
            toastr.error('Failed!Unable to fetch City List!', "Try Again");
            //displayToast("error", 'Error while Fetching data.Try Again!')
        });
    }

    $scope.getBranchByCityId = function () {
        $scope.branchList = [];
        var tempBranchList = $scope.selected.branch;
        for (var i = 0; i < $scope.selected.city.length; i++) {
            for (var j = 0; j < $scope.selected.city[i].branch.length; j++) {
                $scope.branchList.push($scope.selected.city[i].branch[j]);
            }
        }
    };

    /*   $scope.onCitySelected = function () {
           for (var i = 0; i < $scope.selected.city.length; i++) {
               if (angular.isDefined($scope.selected.branch)) {
                   for (var j = 0; j < $scope.selected.branch.length; j++) {
                       if ($scope.selected.city[i].cityId !== $scope.selected.branch[j].cityId) {
                           $scope.selected.branch.splice(j, 1);
                       }
                   }
               }
           }
       };*/

    function arrayObjectIndexOf(myArray, searchTerm, property) {
        for (var i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i][property] === searchTerm) return i;
        }
        return -1;
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
    getCampaignList();
    getCityList();
    $scope.allCity = {
        checked: false
    };
    $scope.allBranch = {
        checked: false
    };
    var CampaignObj = {
        closeMessage: "",
        endDate: "",
        mobileCsv: "",
        subTypeId: null,
        name: "",
        createdBy: parseInt($rootScope.globals.currentUser.userId),
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
            title: new Date().getTime(),
            numberOfQuestion: undefined
        },
        smsTemplate: "Your celebration starts when you get to share this exclusive code %cpn%, during your visit to Barbeque Nation.",
        startDate: "",
        skipVoucher : false,
        termsTemplate: {
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
        type: "NORMAL"
    };
    $scope.newCampaign = {
        start: {},
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
    $scope.goToCustomerListPage = function (item) {
        $location.path('/campaign/customers/' + item.id);
    };

    $scope.open1 = function () {
        $scope.popup1.opened = true;
        $scope.newCampaign.info.endDate = '';
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
    $scope.questionType = [
        {value: 'SINGLESELECT', label: 'Single Selection'},
        {value: 'MULTISELECT', label: 'Multi Selection'},
        {value: 'OPENTEXT', label: 'Open Text'},
        {value: 'FILLTEXT', label: 'Fill in the blank'}];

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
    $scope.questionFormat = [{description: '', type: "", answers: [{description: ""}]}];

    $scope.addNewColumn = function () {
        var newItemNo = $scope.questionFormat.length + 1;
        $scope.questionFormat.push({
            description: '',
            type: "",
            answers: [{description: ""}]
        });
    };


    $scope.removeColumn = function (index) {
        $scope.questionFormat.splice(index, 1);
        if ($scope.questionFormat.length() === 0 || $scope.questionFormat.length() == null) {
            $scope.questionFormat.push = [{
                description: '',
                type: "",
                answers: [{description: ""}]
            }];
        }
    };

    $scope.addQuestion = function (item, index) {
        var questionIndex = $scope.questionFormat.indexOf(item);
        var obj = {description: ""};
        if ($scope.questionFormat[questionIndex].answers.length <= index + 1) {
            $scope.questionFormat[questionIndex].answers.splice(index + 1, 0, obj);
        }
    };
    $scope.deleteRow = function ($event, index) {
        if ($event.which == 1)
            $scope.newCampaign.info.termsTemplate.offerDetails.splice(index, 1);
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
    /*  $scope.$watch('selected.type', function () {
          if (angular.isDefined($scope.selected.type)) {

          }
      });*/

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
        var city = {
            allSelected: false,
            cityId: []
        };
        var branch = {
            allSelected: false,
            branchId: []
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
        $scope.creatingCampaign = true;
        var postMethod = '';
        $scope.newCampaign.info.subTypeId = $scope.selected.subType.id;
        postMethod = $scope.selected.type === 'NORMAL' ? 'normal' : 'survey';
        $scope.newCampaign.info.type = $scope.selected.type;
        switch ($scope.selected.type) {
            case 'NORMAL':
                $scope.newCampaign.info.questionTemplate = null;
                break;
            default:
                $scope.newCampaign.info.questionTemplate.numberOfQuestion = parseInt($scope.newCampaign.info.questionTemplate.numberOfQuestion);
                $scope.newCampaign.info.questionTemplate.questions = $scope.questionFormat;
                break;
        }
        var createCampaign = new HttpService("campaign/create/" + postMethod);
        createCampaign.post('', Campaign.createObject($scope.newCampaign.info, city, branch)).then(function (response) {
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