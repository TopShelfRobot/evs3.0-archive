(function(){

    function Model($q, emFactory, breeze){
        var manager = emFactory.newManager();

        model = {};

        model.id = 3306;

        model.getAll = function(){
            var query = breeze.EntityQuery
                .from("Participants")
                .where("houseId", "==", model.id);

            return manager.executeQuery(query).then(function(data){
                return data.results;
            });
        }

        return model;
    }

    angular.module("app").service("ParticipantModel", ["$q", "entityManagerFactory", "breeze", Model])
})();
