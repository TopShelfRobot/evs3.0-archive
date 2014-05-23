(function(){


    function Model($q){

        console.log("TeamModel Entered");

        model = {};

        model.teamName = "Banditos";

        model.players = [{name : "Bill Burke", email : "billstron@gmail.com"},
            {name : "Mike Boone", email : "boone@gmail.com"}];

        model.totalCost = 400;
        model.currentlyPaid = 200;

        model.makeTeam = function(){
            return $q.when(true);
        }

        return model;
    }

    angular.module("app").service("TeamModel", ["$q", Model]);

})();
