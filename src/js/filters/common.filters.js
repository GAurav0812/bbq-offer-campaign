/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('RDash.filters', [])
        .filter('statusFullForm', statusFullForm)
        .filter('emptyInputFilter', emptyInputFilter)
        .filter('dateFilter', dateFilter)
        .filter('arrayToStringFilter', arrayToStringFilter)
        .filter('campaignDateFilter', campaignDateFilter)
        .filter('timeFilter', timeFilter)
        .filter('dateMonthFilter', dateMonthFilter)
        .filter('yesNoValueFilter', yesNoValueFilter);

    function timeFilter($filter) {
        return function (value) {
            var dt = new Date(value);
            return $filter('date')(dt, 'hh:mm:ss a')
        };
    }
    function arrayToStringFilter() {
        return function (array) {
            return array.toString();
        };
    }
    function campaignDateFilter() {
        return function (value) {
            if(value!="" && value!=null) {
                var date = value.split(" ");
                return date[0];
            }else {
                return " - "
            }
        };
    }
    function statusFullForm() {
        return function (value) {
            return value == "I" ? "InActive" : "Active";
        };
    }
    function yesNoValueFilter() {
        return function (value) {
            if (value == 1) {
                return "Yes"
            } else if (value == 0) {
                return "No"
            }
        };
    }
    function dateFilter($filter) {
        return function (value) {
            if (value == "" || value == null) {
                return " - "
            } else {
                var dt = new Date(value);
                return $filter('date')(dt, 'yyyy-MM-dd')

            }
        };
    }
    function dateMonthFilter($filter) {
        return function (value) {
            if (value == "" || value == null) {
                return " - "
            } else {
                var dt = new Date(value);
                return $filter('date')(dt, 'dd-MMM')

            }
        };
    }
    function emptyInputFilter() {
        return function (value) {
            return value == "" || value == "NULL" || value == null || value == "0" ? "<em class='text-color-muted '><small>No Value</small></em>" : value;
        };
    }
})();
