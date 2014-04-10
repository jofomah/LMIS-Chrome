'use strict';

angular.module('lmisChromeApp', [
  'ui.bootstrap',
  'ui.router',
  'tv.breadcrumbs',
  'pouchdb',
  'config'
])
  // Load fixture data
  .run(function(storageService) {
      storageService.getAll().then(function(result){
        if(result !== undefined && Object.keys(result).length === 0){
          storageService.loadFixtures().then(function(result){
            console.info('fixture loaded');
          }, function(error){
            console.error(error);
          });
        }
      });

  }).constant('cacheConfig', {
      "id": "lmisChromeAppCache"
    });
