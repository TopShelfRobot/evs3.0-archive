(function(){

	function Service($q, datacontext){
		var self = this;
		this.manager = null;

		function copyItem(item){
			var manager = item.entityAspect.entityManager;
		    var exported = JSON.parse(manager.exportEntities([item], false));
		    var type = item.entityType;
			var copy = exported.entityGroupMap[type.name].entities[0];
			delete copy.entityAspect;
		    type.keyProperties.forEach(function (p) { delete copy[p.name]; });
			return {type: type, copy: copy};
		}

		this.cloneEventure = function(original){
			self.manager = original.entityAspect.entityManager;
			var cEventure = copyItem(original);
			cEventure.copy.name = "cloned: " + cEventure.copy.name;
			cEventure.copy.active = false;
			var cloned = self.manager.createEntity(cEventure.type, cEventure.copy);
			var def = datacontext.saveChanges([cloned])
				.then(function(){
					return self.cloneLists(original.id, cloned.id);
				})
				.then(function(){
					datacontext.save();
				});

			return def;
		};

		this.cloneEventureList = function(originalList){
			self.manager = originalList.entityAspect.entityManager;
			var cEventureList = copyItem(originalList);
			cEventureList.copy.name = "cloned: " + cEventureList.copy.name;
			cEventureList.copy.active = false;
			var cloned = self.manager.createEntity(cEventureList.type, cEventureList.copy);
			var def = datacontext.saveChanges([cloned]);

			return def;
		};

		this.cloneLists = function(oldEventureId, newEventureId){
			var def = datacontext.eventure.getEventureListsByEventureId(oldEventureId)
				.then(function(items){
					var dlist = [];
					items.forEach(function(listItem){
						dlist.push(self.cloneListItem(listItem, newEventureId));
					});
					return $q.all(dlist);
				});
			return def;
		};

		this.cloneListItem = function(item, eventureId){
			var copy = copyItem(item);
			copy.copy.eventureId = eventureId;
			var cloned = self.manager.createEntity(copy.type, copy.copy);
			var def = datacontext.saveChanges([cloned])
				.then(function(){
					return self.cloneQuestions(item.id, cloned.id);
				})
				.then(function(){
					return self.cloneGroups(item.id, cloned.id);
				});
			return def;
		};

		this.cloneQuestions = function(oldListId, newListId){
			var def = datacontext.question.getCustomQuestionSetByEventureListId(oldListId)
				.then(function(list){
					var dlist = [];
					list.forEach(function(item){
						dlist.push(self.cloneQuestionItem(item, newListId));
					});
					return $q.all(dlist);
				});
			return def;
		};

		this.cloneQuestionItem = function(item, listId){
			var copy = copyItem(item);
			copy.copy.eventureListId = listId;
			var cloned = self.manager.createEntity(copy.type, copy.copy);
			var def = datacontext.saveChanges([cloned])
				.then(function(){
					return cloned;
				});
			return def;
		};

		this.cloneGroups = function(oldListId, newListId){
			var def = datacontext.eventure.getGroupsByEventureListId(oldListId)
				.then(function(list){
					var dlist = [];
					list.forEach(function(item){
						dlist.push(self.cloneGroupItem(item, newListId));
					});
					return $q.all(dlist);
				});
			return def;
		};

		this.cloneGroupItem = function(item, listId){
			var copy = copyItem(item);
			copy.copy.eventureListId = listId;
			var cloned = self.manager.createEntity(copy.type, copy.copy);
			var def = datacontext.saveChanges([cloned])
				.then(function(){
					return cloned;
				});
			return def;
		};
	}

	angular.module("common").service("Cloner", ["$q", "datacontext", Service]);
})();
