(function(){


    function Model(q, emFactory, breeze){

        console.log("EventureModel Entered");

        var manager = emFactory.newManager();

        model = {};

        var eventures = [
            {id : 1, name : "Kids Soccer", logo : "/img/kids.png", date : "always", location : "Mockingbird Valley"},
            {id : 2, name : "Adult Soccer", logo : "/img/adult.png", date : "always", location : "Mockingbird Valley"}
        ];

        var list = [
            {
                id : 1,
                name : "Monday Premier",
                logo : "/img/premier.png",
                description : "some long text that describes the premier league. ",
            },
            {
                id : 2,
                name : "Tuesday Rec",
                logo : "/img/rec.png",
                description : "some long text that describes the recreation league. "
            }
        ];

        model.getEventures = function(){
            return q.when(eventures);
        };

        model.getEventure = function(id){
            return q.when(eventures[id - 1]);
        }

        model.getEventureList = function(id){
            return q.when(list);
        }

        return model;
    }

    angular.module("app").service("EventureModel", ["$q", "entityManagerFactory", "breeze", Model]);

})();
