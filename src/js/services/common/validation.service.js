'use strict';
angular.module('RDash.services').factory('ValidationServices', function () {
    var _validations = {};

    _validations.isNumeric = function isNumeric(num) {
        return !isNaN(num) && num > 0;
    };

    _validations.isInteger = function isInteger(num) {
        return !isNaN(num) && num != 0;
    };
    _validations.isUnselected = function isUnselected(value) {
        return angular.isDefined(value)
    };

    _validations.isName = function isName(val) {
        var regex = /^[-.A-z0-9 ]+$/;
        return regex.test(val);
    };

    _validations.isUsername = function isUsername(val) {
        var regex = /^[a-z0-9]{3,30}$/;
        return regex.test(val);
    };
    _validations.isPassword = function isPassword(val) {
        var regex = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        return regex.test(val);
    };

    return _validations;
});

