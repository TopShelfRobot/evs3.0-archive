(function () {
    var controllerId = 'sendemail';

    function Controller($scope, $http, $q, config, common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var self = this;
        self.title = 'Listing Detail';
        self.ownerId = config.owner.ownerId;
        self.emailType = 'eventure';
		self.eventures = [];
		self.eventures;
		self.listings = [];
		self.listing;
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
		
		function dedup(array){
			
			var hash = {};
			var out = [];
			
			for(var i = 0; i < array.length; i++){
				if(typeof hash[array[i]] == "undefined"){
					out.push(array[i]);
					hash[array[i]] = 0;
				}
				hash[array[i]]++;
			}
			
			return $q.when(out);
		}
		
		function participantsFromRegistrations(list){
			var parts = [];
			list.map(function(item){
				parts.push(item.participant);
			});
			console.log("parts:", parts);
			return $q.when(parts);
		}
		
		function emailFromString(string){
			var out = [];
			if(string && string.length && string.length > 0){
				out = string.replace(/\s/g, "").split(",");
			}
			return out;
		}
				
        self.sendMessage = function () {

			var getParts;
			switch(self.emailType){
			case "eventure":
				getParts = datacontext.registration.getByEventureIdWithParticipants(self.eventure)
					.then(participantsFromRegistrations);
				break;
			case "listing":
				getParts = datacontext.registration.getByListingIdWithParticipants(self.listing)
					.then(participantsFromRegistrations);
				break;
			case "volunteer":
				getParts = datacontext.volunteer.getAllWithParticipants()
					.then(participantsFromRegistrations);
				break;
			case "all":
				getParts = datacontext.registration.getAllWithParticipants()
					.then(participantsFromRegistrations);
				break;
			}
			
			getParts
				.then(function(list){
					var emails = [];
					list.map(function(item){
						emails.push(item.email);
					});
					return emails;
				})
				.then(dedup)
				.then(function(emails){
					var source = {
						ownerId: config.owner.ownerId,
						email: emails,
						subject : self.subject,
						body : self.body,
						bcc : emailFromString(self.bcc),
						cc: emailFromString(self.cc),
					};
					console.log("sending email:", source);
					return source;
				})
				.then(function(source){
	            	return $http.post(config.apiPath + "api/mail/SendMassMessage", source)
				})
				.then(function(reply){
					console.log(reply.data);
				})
				.catch(function(data){
					console.error(data);
				});
        };
    }
	
	angular.module('app').controller(controllerId, ['$scope', '$http', "$q", 'config', 'common', 'datacontext', Controller]);

})();
