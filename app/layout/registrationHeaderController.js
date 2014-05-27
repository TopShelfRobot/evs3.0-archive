(function(){

    function controller($scope, $interval){

        $scope.cart = [
            {name : "butts"}
        ];

        $interval(function(){
            $scope.cart.push({name : "butts"});
        }, 2000);

    }

    angular.module("app").controller("Header", ["$scope", "$interval", controller]);

})();
