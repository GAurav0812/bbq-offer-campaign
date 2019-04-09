'use strict';
angular.module('RDash.services').factory('Campaign', ['$filter', function ($filter) {
    var Campaign = {
        createObject: function (obj,cityArr,branchArr) {
            var dataObj = {
                closeMessage:obj.closeMessage ,
                subTypeId:obj.subTypeId,
                endDate: $filter('date')(obj.endDate, 'yyyy-MM-dd 23:59:59'),
                mobileCsv: obj.mobileCsv,
                city:JSON.stringify(cityArr),
                branch:JSON.stringify(branchArr),
                name: obj.name,
                createdBy:obj.createdBy,
                //questionTemplate: null,
                smsTemplate: obj.smsTemplate,
                startDate: $filter('date')(obj.startDate, 'yyyy-MM-dd HH:mm:ss'),
                termsTemplate: obj.termsTemplate
            }
            if(obj.type == 'SURVEY'){
                dataObj.questionTemplate = obj.questionTemplate
                if(obj.skipVoucher){
                    dataObj.termsTemplate.offerDetails = null;
                }
            }
            return dataObj;
        },
        updateObject: function (obj,cityArr,branchArr) {
            var dataObj = {
                closeMessage:obj.closeMessage ,
                id:obj.id,
                //subTypeId:obj.subTypeId,
                city:JSON.stringify(cityArr),
                branch:JSON.stringify(branchArr),
                status:obj.status,
                endDate: $filter('date')(obj.endDate, 'yyyy-MM-dd 23:59:59'),
                mobileCsv: obj.mobileCsv===null ? "" : obj.mobileCsv,
                name: obj.name,
                //questionTemplate: null,
                smsTemplate: obj.smsTemplate,
                startDate: $filter('date')(obj.startDate, 'yyyy-MM-dd HH:mm:ss'),
                termsTemplate: obj.termsAndCondition
            }
            if(obj.type == 'SURVEY'){
                dataObj.questionTemplate = obj.questionTemplate
                if(obj.skipVoucher){
                    dataObj.termsTemplate.offerDetails = null;
                }
            }
            return dataObj;
        }
    };
    return Campaign;
}]);

