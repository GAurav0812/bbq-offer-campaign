'use strict';
angular.module('RDash.services').factory('HttpService', ['$http', '$q', function ($http, $q) {
    var apiRoot = "../instant-1.0/rest/";

    var HttpService = function (apiModule) {
        this.apiModule = apiModule;
    };

    function makeRequestSuccess(response) {
        if (response.data.messageType === "SUCCESS") {
            return response.data;
        } else if (response.data.messageType === "UNAUTHORIZED") {
            //toastr.error("Unauthorized access!", "Error");
        } else {
            return $q.reject(response.data.message);
        }
    }

    function makeRequestFailed(response) {
        var errMsg = "Some problem in server, try reloading the page. If the issue still persist contact admin.";
        return $q.reject("Error#" + response.status + ": " + errMsg);
    }

    HttpService.prototype.get = function (url) {
        var self = this;
        var endPoint = "/" + url;
        if (url == "")
            endPoint = "";
        return $http.get(apiRoot + self.apiModule + endPoint).then(makeRequestSuccess, makeRequestFailed);
    };
    HttpService.prototype.post = function (url, params) {
        var self = this;
        var endPoint = "/" + url;
        if (url == "")
            endPoint = "";
        return $http.post(apiRoot + self.apiModule + endPoint, params).then(makeRequestSuccess, makeRequestFailed);
    };
    HttpService.prototype.devare = function (url) {
        var self = this;
        var endPoint = "/" + url;
        if (url == "")
            endPoint = "";
        return $http.devare(apiRoot + self.apiModule + endPoint).then(makeRequestSuccess, makeRequestFailed);
    };
    return HttpService;
}]);
