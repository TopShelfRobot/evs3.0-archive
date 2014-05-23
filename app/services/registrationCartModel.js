(function(){

    function Model($http){

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

        // Submits orders to be processed by the backend.
        model.submitOrder = function(token, value){
            console.log("token value:", token, value);
            var order = {
                token : token,
                eventureId : model.eventureId,
                eventureListId : model.eventureListId,
                participantId : model.participantId,
                teamName : model.teamName,
                teamMembers : model.teamMembers,
                payment : value
            };

            console.log(order);
            return $http.post("/api/teamCreation", order, {headers : {"Content-Type" : "application/json"}})
            // expected response:
            // var response = {
            //     teamId : "1233534656"
            // }
        }

        return model;
    }

    angular.module("app").service("RegistrationCartModel", ["$http", "StripeService", Model]);
})()
