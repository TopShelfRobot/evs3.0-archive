
;(function(){
	
	function Cart(){
		
        var model = {};

        model.eventureId = $routeParams.eventureId || null;
        model.eventureListId = $routeParams.listId || null;
        model.teamId = $routeParams.teamId || null;
        model.memberId = $routeParams.memberId || null;
        model.waiverSigned = false;
        model.allowZeroPayment = true;
		
        model.participantId = $routeParams.uid || null;
        model.teamName;
        model.teamMembers = [];
        model.teamId = "tbd";
        model.currentlyPaid = 0;
		
		return model;
	}
	
	angular.module("evReg").service("cart", ["$http", "$routeParams", "config", Cart]);
	
})();