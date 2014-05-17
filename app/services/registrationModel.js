(function(){


    function Model(){

        console.log("RegistrationModel Entered");

        model = {};

        model.teamName = "Banditos";

        model.players = [{name : "Bill Burke", email : "billstron@gmail.com"},
            {name : "Mike Boone", email : "boone@gmail.com"}];

        model.totalCost = 400;
        model.currentlyPaid = 200;

        return model;
    }

    angular.module("app").service("RegistrationModel", Model);

})();
