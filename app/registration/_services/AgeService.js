(function () {
    angular.module('evReg').service('AgeService', ['CartModel',  Service]);
    function Service(cart) {

        var exports = {};

        exports.age = function getAge(birthDateString, ageOnDateString) {
            var ageOnDate;
            if (ageOnDateString === undefined) {
                ageOnDate = new Date();
            }
            else {
                ageOnDate = newDate(ageOnDateString);
            }
            var birthDate = new Date(birthDateString);
            var age = ageOnDate.getFullYear() - birthDate.getFullYear();
            var m = ageOnDate.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && ageOnDate.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        };

        return exports;
    }
})();
