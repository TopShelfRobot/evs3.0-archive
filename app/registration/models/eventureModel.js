(function(){


    function Model(q, emFactory, breeze){

        var manager = emFactory.newManager();

        model = {};

        model.getEventures = function(){

            var query = breeze.EntityQuery
                .from("Eventures")

            return manager.executeQuery(query).then(function(data){
                return data.results;
            });
        };

        model.getEventure = function(id){

            var query = breeze.EntityQuery
                .from("Eventures")
                .where("id", "==", id);

            return manager.executeQuery(query).then(function(data){
                return data.results[0];
            });

            return q.when(eventures[id - 1]);
        }

        model.getEventureListAll = function(id){

            var query = breeze.EntityQuery
                .from("EventureLists")
                .where("eventureId", "==", id);

            return manager.executeQuery(query).then(function(data){
                return data.results;
            });
        }

        model.getEventureListItem = function(eventureId, listId){

            var query = breeze.EntityQuery
                .from("EventureLists")
                .where("eventureId", "==", eventureId)
                .where("id", "==", listId);

            return manager.executeQuery(query).then(function(data){
                return data.results[0];
            });
        }

        return model;
    }

    angular.module("app").service("EventureModel", ["$q", "entityManagerFactory", "breeze", Model]);

})();
