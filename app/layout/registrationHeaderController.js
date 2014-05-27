(function(){

    function controller($scope){

        $scope.cart = [
            {name : "butts"}
        ];

    }

    angular.module("app").controller("Header", ["$scope", controller]);

})();
