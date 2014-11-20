(function () {
	'use strict';

	var serviceId = 'datacontext';
	angular.module('common').factory(serviceId,
		['common', 'entityManagerFactory', 'model', 'config', 'repositories', datacontext]);

	function datacontext(common, emFactory, model, config, repositories) {
		var entityNames = model.entityNames;
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(serviceId);
		var logError = getLogFn(serviceId, 'error');
		var logSuccess = getLogFn(serviceId, 'success');
		var manager = emFactory.newManager();
		var primePromise;
		var repoNames = ['eventure', 'resource', 'participant', 'registration', 'analytic', 'surcharge', 'volunteer', 'team', 'question'];
		var $q = common.$q;

		var service = {
			cancel: cancel,
			prime: prime,
			save: save,
			saveChanges: saveChanges
			// Repositories to be added on demand:
			//      attendees
			//      lookups
			//      sessions
			//      speakers
		};

		init();

		return service;

		function init() {
			//alert('am i inintiing');
			repositories.init(manager);
			defineLazyLoadedRepos();
		}
		
		function cancel() {
			if (manager.hasChanges()) {
				manager.rejectChanges();
				logSuccess('Canceled changes', null, true);
			}
		}

		// Add ES5 property to datacontext for each named repo
		function defineLazyLoadedRepos() {
			repoNames.forEach(function (name) {
				Object.defineProperty(service, name, {
					configurable: true, // will redefine this property once
					get: function () {
						// The 1st time the repo is request via this property,
						// we ask the repositories for it (which will inject it).
						var repo = repositories.getRepo(name);
						// Rewrite this property to always return this repo;
						// no longer redefinable
						Object.defineProperty(service, name, {
							value: repo,
							configurable: false,
							enumerable: true
						});
						return repo;
					}
				});
			});
		}

		function prime() {

			//if (primePromise) return primePromise;

			primePromise = $q.all([service.eventure.getAll()])
			    .then(extendMetadata)
			    .then(success);
			return primePromise;
			//return true;

			function success() {
				//service.lookup.setLookups();
				//log('Primed the data');
			}

			function extendMetadata() {
			    var metadataStore = manager.metadataStore;
			    var types = metadataStore.getEntityTypes();
			    types.forEach(function (type) {
			        if (type instanceof breeze.EntityType) {
			            set(type.shortName, type);
			        }
			    });

			    //var personEntityName = entityNames.person;
			    //['Speakers', 'Speaker', 'Attendees', 'Attendee'].forEach(function (r) {
			    //    set(r, personEntityName);
			    //});

			    function set(resourceName, entityName) {
			        metadataStore.setEntityTypeForResourceName(resourceName, entityName);
			    }
			}
		}
		
		function saveChanges(entity) {
			return manager.saveChanges(entity)
			   .then(saveSucceeded, saveFailed);

			function saveSucceeded(result) {
				logSuccess('Saved data', result, true);
			}

			function saveFailed(error) {
				var msg = config.appErrorPrefix + 'Save failed: ' +
					breeze.saveErrorMessageService.getErrorMessage(error);
				error.message = msg;
				logError(msg, error);
				throw error;
			}
		}

		function save() {
			return manager.saveChanges()
			   .then(saveSucceeded, saveFailed);

			function saveSucceeded(result) {
				logSuccess('Saved data', result, true);
			}

			function saveFailed(error) {
				var msg = config.appErrorPrefix + 'Save failed: ' +
					breeze.saveErrorMessageService.getErrorMessage(error);
				error.message = msg;
				logError(msg, error);
				throw error;
			}
		}
	}
})();
