(function(){

    function Model($q){

        var model = {};

        model.eventureId = 1;
        model.eventureListId = 2;
        model.participantId = 3306;
        model.waiverSigned = false;
        model.teamName = "butts";
        model.teamMembers = [];
        model.teamId = "tbd";
        model.currentlyPaid = 0;
        model.allowZeroPayment = false;

        model.addTeamMember = function(name, email){
            model.teamMembers.push({name : name, email: email});
        }

        model.getPaymentToken = function(total, name, cardNumber, cardCVC, expireMonth, expireYear){
            return $q.when({id : "123435"});
        }

        model.submitOrder = function(total, teamCaptainId, teamMembers, teamName){
            return $q.when({id : "123435"});
        }

        return model;
    }

    angular.module("app").service("RegistrationCartModel", ["$q", Model]);
})()
