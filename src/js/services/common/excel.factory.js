/*'use strict';
angular.module('RDash.services').factory('Excel', ['$q','$window', function ($q,$window) {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) {
            return $window.btoa(unescape(encodeURIComponent(s)));
        },
        format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            })
        };
    return {
        tableToExcel: function (tableId, worksheetName) {
            /!*var table = $(tableId)*!/
            var table = document.getElementById(tableId),
                ctx = {worksheet: worksheetName, table: table.innerHTML},
                href = uri + base64(format(template, ctx));
            return href;
        }
    };
}]);*/

'use strict';
angular.module('RDash.services').factory('Excel', ['$window','Base64',function ($window, Base64) {
    var uri = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;base64,',
        template = '<html xmlns:v="urn:schemas-microsoft-com:vml"  xmlns:o="urn:schemas-microsoft-com:office:office"  xmlns:x="urn:schemas-microsoft-com:office:excel"  xmlns="http://www.w3.org/TR/REC-html40">' +
            '<head><style>font-family{font-size:10.0pt; font-family:Verdana, sans-serif;  mso-font-charset:0;} th, td {border:.1pt solid black;}</style>' +
            '<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) {
            return $window.btoa(unescape(encodeURIComponent(s)));
        },
        format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            })
        };
    return {
        tableToExcel: function (tableId, worksheetName, fileName) {
            /*var table = $(tableId),
             ctx = {worksheet: worksheetName, table: table.html()},
             href = uri + base64(format(template, ctx));
             return href;*/
            var table = document.getElementById(tableId),
                template = '<html xmlns:v="urn:schemas-microsoft-com:vml"  xmlns:o="urn:schemas-microsoft-com:office:office"  xmlns:x="urn:schemas-microsoft-com:office:excel"  xmlns="http://www.w3.org/TR/REC-html40">' +
                    '<head><style>font-family{font-size:10.0pt; font-family:Verdana, sans-serif;  mso-font-charset:0;} th, td {border:.1pt solid black;}</style>' +
                    '<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>' + worksheetName + '</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>' + table.innerHTML + '</table></body></html>';
            var blob = new Blob([template], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, fileName);

        }
    };
}]);
