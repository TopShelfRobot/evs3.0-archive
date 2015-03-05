(function () {
    var controllerId = 'sendemail';

    function Controller($scope, $http, config, common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var self = this;
        self.title = 'Listing Detail';
        self.ownerId = config.owner.ownerId;
        self.emailType = 'eventure';
		self.eventures = [];
		self.listings = [];
		self.delivery = "email";

        function getEvents() {
            return datacontext.eventure.getEventuresByOwnerId(self.ownerId)
                .then(function (data) {
					self.eventures = data;
                    return self.eventures;
                });
        }

        function getListings() {
            return datacontext.eventure.getEventureListsByOwnerId(self.ownerId)
                .then(function (data) {
					self.listings = data;
                    return self.listings;
                });
        }
		
        function activate() {
            onDestroy();
            var promises = [getEvents(), getListings()];

            common.activateController(promises, controllerId)
                .then(function () {
                    console.log("eventures:", self.eventures);
					console.log("listings:", self.listings);
                });
        }
		
		activate();

        function onDestroy() {
            $scope.$on('$destroy', function () {
                datacontext.cancel();
            });
        }
				
        self.sendMessage = function () {

			var getParts;
			switch(self.emailType){
			case "event":
				getParts = datacontext.participant.getByEventureId(self.eventure);
				break;
			case "listing":
				getParts = datacontext.participant.getByEventureListId(self.listing);
				break;
			case "volunteer":
				getParts = datacontext.volunteer.getByOwnerId(config.owner.id);
				break;
			case "all":
				getParts = getParticipantsAll();
				break;
			}
			
			console.log("sending email:", source);
			getParts
				.then(function(list){
					var source = {
						ownerId: config.owner.id,
						email: [],
						subject : self.bcc,
					};
					for(var i = 0; i < list.length; i++){
						source.email.push(list.email);
					}
					return source;
				})
				.then(function(source){
	            	return $http.post(config.apiPath + "api/mail/SendMassMessage", source);
				})
				.then(function(reply){
					console.log(reply.data);
				})
				.catch(function(data){
					alert(data);
				});
        };
    }
	
	angular.module('app').controller(controllerId, ['$scope', '$http', 'config', 'common', 'datacontext', Controller]);

})();
