'use strict';

angular.module('lmisChromeApp').config(function ($stateProvider) {
  $stateProvider.state('counterSamples', {
    url: '/counter-samples',
    parent: 'root.index',
    templateUrl: 'views/counter/counter-sample.html',
    data: {
      label: 'Counter samples'
    },
    controller: function($scope, storageService) {
      $scope.file  = {};
        storageService.getAll().then(function(result){
          console.log(result);
          $scope.file = result;
          var DB_FILE_URL = 'scripts/fixtures/lomis-db/db.json';
          console.log(DB_FILE_URL);
        }, function(reason){
          console.log(reason);
        });
      $scope.dropDownCounter = '';
      $scope.textInputCounter = '';
      $scope.numberInputCounter = 0;
    }
  });
});
