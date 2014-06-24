(function(){

    function controller($scope){

        $scope.cart = [
            {name : "butts"}
        ];

    }

    angular.module("evReg").controller("Header", ["$scope", controller]);

})();
