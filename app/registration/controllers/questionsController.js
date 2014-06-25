
;(function(){
	
	function Controller($scope, config, cartModel, datacontext, logger){
		
		$scope.cart = cartModel;
		
        var stockQuestionSet = ko.observable();
        var customQuestionSet = ko.observable();
        var stockAnswerSet = ko.observable();
        var groups = ko.observableArray();
        var isWaiverChecked = false;
        var groupId = ko.observable(0);
        var group2Id = ko.observable(0);

        var activate = function () {
            datacontext.getCustomQuestionSetByEventureListId(config.regEventureListId, customQuestionSet)
                .then(function(obs){

                    for(var i = 0; i < obs().length; i++){
                        obs()[i].answerValue = ko.observable();

                        if(obs()[i].options()){
                            var opts = obs()[i].options().split(",");
                            if(obs()[i].type() == "combo"){
                                opts.unshift(null);
                            }
                            obs()[i].options(opts);
                        }
                    }
                    customQuestionSet(obs());
                    console.log(obs());
                });

            datacontext.getGroupsActiveByEventureListId(config.regEventureListId, groups)
                .then(function () {

                    if (config.isGroupRequired && groups().length < 1) {
                        alert('There are currently no spaces available');
                        //router.navigateBack();
                        router.navigateTo("#eventurelist/" + config.regEventureId);
                    }
                });

            datacontext.getStockQuestionSetByEventureListId(config.regEventureListId, stockQuestionSet);

            stockAnswerSet({       //mjb question issue
                shirtSize: "",
                finishTime: "",
                bibName: "",
                howHear: "",
                usat: "",
                //ownRv: "",
                //nextRv: "",
                //howHearRv: "",
                school: "",
                howHearDropDown: "",
                estimatedSwimTime400: "",
                estimatedSwimTime: "",
                notes: "",
                relayTeamQuestion: "",
                annualIncome: "",
                stockQuestionSetId: "",
                shirtUpgrade: "",
                Wheelchair: "",
                PuretapUnisex: "",
                NortonUnisex: "",
                BourbonGenderSpecific: "",
                HearRunathon: "",
                HearPure: "",
                HearNorton: "",
                HearBourbon: "",
                ParticipatePure: "",
                ParticipateNorton: "",
                ParticipateBourbon: "",
                Mile15: "",
                SportsEmails: "",
                BourbonWaiver: "",
                Overnight: "",
                OvernightWhere: "",
                OvernightDays: ""
            });
            return datacontext.getEventureListById(config.regEventureListId, eventureList);
        };

        var viewAttached = function () {
            $('.form-horizontal').validate({
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                errorElement: 'span',
                errorClass: 'help-block',
                errorPlacement: function (error, element) {
                    if (element.parent('.input-group').length) {
                        error.insertAfter(element.parent());
                    } else {
                        error.insertAfter(element);
                    }
                }
            });

        };

        var getCustomAnswers = function(){
            var answers = [];
            for(var i = 0; i < customQuestionSet().length; i++){
                answers.push({
                	id : customQuestionSet()[i].id(),
					answerValue : customQuestionSet()[i].answerValue()
                });
            }
            return answers;
        }

        var clickAddToCart = function () {

            var form = $(".form-horizontal");
            form.validate();

            if (form.valid()) {
                cartModel.currentGroupId(groupId());
                stockAnswerSet().stockQuestionSetId = stockQuestionSet().id();
                cartModel.currentStockAnswerSet(stockAnswerSet());
                cartModel.currentCustomAnswerSet(getCustomAnswers());
                cartModel.addRegistration();
                var url = '#eventure'; //+ selectedEvent.id();
                router.navigateTo(url);
            }
        };

      // var vm = {
      //       activate: activate,
      //       viewAttached: viewAttached,
      //       clickAddToCart: clickAddToCart,
      //       cart: cart,
      //       eventureList: eventureList,
      //       stockQuestionSet: stockQuestionSet,
      //       stockAnswerSet: stockAnswerSet,
      //       groups: groups,
      //       groupId: groupId,
      //       //group2Id: group2Id,
      //       isWaiverChecked: isWaiverChecked,
      //       customQuestionSet : customQuestionSet,
      //       //isAddCartApproved: isAddCartApproved,
      //       title: 'question'
      //   };
      //   return vm;
	}
	
	angular.module("evReg").controller("QuestionsController", ["$scope", "config", "CartModel", "datacontext", Controller]);
})();