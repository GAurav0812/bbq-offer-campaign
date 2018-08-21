'use strict';
angular.module('RDash.services').factory('Campaign', ['$filter', function ($filter) {
    var Campaign = {
        createObject: function (obj) {
            return {
                closeMessage:obj.closeMessage ,
                subTypeId:obj.subTypeId,
                endDate: $filter('date')(obj.endDate, 'yyyy-MM-dd HH:mm:ss'),
                mobileCsv: obj.mobileCsv,
                name: obj.name,
                questionTemplate: null,
                smsTemplate: obj.smsTemplate,
                startDate: $filter('date')(obj.startDate, 'yyyy-MM-dd HH:mm:ss'),
                termsTemplate: obj.termsTemplate
            }
        },
        updateObject: function (obj) {
            return {
                closeMessage:obj.closeMessage ,
                id:obj.id,
                //subTypeId:obj.subTypeId,
                status:obj.status,
                endDate: $filter('date')(obj.endDate, 'yyyy-MM-dd HH:mm:ss'),
                mobileCsv: obj.mobileCsv===null ? "" : obj.mobileCsv,
                name: obj.name,
                questionTemplate: null,
                smsTemplate: obj.smsTemplate,
                startDate: $filter('date')(obj.startDate, 'yyyy-MM-dd HH:mm:ss'),
                termsTemplate: obj.termsAndCondition
            }
        }
    };
    return Campaign;
}]);

