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
		
		this.cloneLists = function(oldEventureId, newEventureId){
			var def = datacontext.eventure.getEventureListsByEventureId(oldEventureId)
				.then(function(items){
					var list = [];
					items.forEach(function(listItem){
						list.push(self.cloneListItem(listItem, newEventureId));
					});
					return $q.all(list);
				});
			return def;
		}
		
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
			
		};
		
		this.cloneQuestionItem = function(item, listId){
			
		};
		
		this.cloneGroups = function(oldListId, newListId){
			
		};
		
		this.cloneGroupItem = function(item, listId){
			
		};
		
		this.cloneEventure = function(original){
			self.manager = original.entityAspect.entityManager;
			var cEventure = copyItem(original);
			cEventure.copy.name = "cloned: " + cEventure.copy.name;
			var cloned = self.manager.createEntity(cEventure.type, cEventure.copy);
			var def = datacontext.saveChanges([cloned])
				.then(function(){
					return self.cloneLists();
				});
				
			return def;
		};
		
		
	}
	
	angular.module("common").service("Cloner", ["$q", "datacontext", Service]);
})();