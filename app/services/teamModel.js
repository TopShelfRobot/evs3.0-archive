(function(){


    function Model($q, emFactory, breeze){
        var manager = emFactory.newManager();
        var model = {};

        model.getTeamById = function(id){
            var query = breeze.EntityQuery()
                .from("Teams").
                .where("id", "==", id);

            return manager.execute(query)
                then(function(response){
                    return response.results[0];
                });
        }

        return model;
    }

    angular.module("app").service("TeamModel", ["$q", "entityManagerFactory", "breeze", Model]);

})();
