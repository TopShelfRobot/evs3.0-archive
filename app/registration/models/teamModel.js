(function(){


    function Model(emFactory, breeze){
        var manager = emFactory.newManager();
        var model = {};

        model.getTeamById = function(id) {
            var query = breeze.EntityQuery
                .from("Teams")
                .where("id", "==", id);

            return manager.executeQuery(query)
                .then(function(response) {
                    return response.results[0];
                });
        };

        return model;
    }

    angular.module("evReg").service("TeamModel", ["entityManagerFactory", "breeze", Model]);

})();
