'use strict';

angular.module('lmisChromeApp')
  .factory('productProfileFactory', function ($q, storageService, utility, presentationFactory, productTypeFactory, productCategoryFactory) {

    var getByUuid = function(uuid) {
      uuid = utility.getStringUuid(uuid);
      var deferred = $q.defer();
      storageService.find(storageService.PRODUCT_PROFILE, uuid)
          .then(function (productProfile) {
            if (typeof productProfile !== 'undefined') {
              var promises = {
                presentation: presentationFactory.get(utility.getStringUuid(productProfile.presentation)),
                product: productTypeFactory.get(utility.getStringUuid(productProfile.product))
              };
              $q.all(promises).then(function (results) {
                for (var key in results) {
                  productProfile[key] = results[key];
                }
                deferred.resolve(productProfile);
              });
            } else {
              deferred.resolve();
            }
          }, function (err) {
            deferred.reject(err);
          })
          .catch(function (reason) {
            deferred.reject(reason);
          });
      return deferred.promise;
    };

    var getAll = function() {
      var deferred = $q.defer();
      storageService.all(storageService.PRODUCT_PROFILE)
        .then(function(productProfiles) {
          var promises = [];
          //attach complete nested object such as presentation to each product profile
          for(var index in productProfiles){
            var productProfile = productProfiles[index];
            var uuid = utility.getStringUuid(productProfile);
            promises.push(getByUuid(uuid));
          }

          $q.all(promises).then(function(productProfiles){
            deferred.resolve(productProfiles);
          })
          .catch(function(reason){
            deferred.reject(reason);
          });
        })
        .catch(function(reason) {
          deferred.reject(reason);
        });
      return deferred.promise;
    };

    /**
     * This function returns product profiles for a given product type
     *
     * @param productType
     * @returns {promise|promise|*|Function|promise}
     */
    var getByProductType = function(productType) {
      var deferred = $q.defer();
      var ptUuid = utility.getStringUuid(productType);
      storageService.all(storageService.PRODUCT_PROFILE).then(function(profiles){
        profiles = profiles.filter(function(p) { return utility.getStringUuid(p.product) === ptUuid; });
        deferred.resolve(profiles);
      })
      .catch(function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    var getProductProfileBatch = function(prodProfiles){
      if(!Array.isArray(prodProfiles)){
        throw 'expected argument to be an array. not array argument passed';
      }
      var deferred = $q.defer(), batchPromises = [];
      for(var index in prodProfiles){
        var uuid = utility.getStringUuid(prodProfiles[index]);
        batchPromises.push(getByUuid(uuid));
      }

      $q.all(batchPromises)
          .then(function(result){
            deferred.resolve(result);
          })
          .catch(function(reason){
            deferred.reject(reason);
          });
      return deferred.promise;
    };

    var getAllWithoutNestedObject = function(){
      return storageService.all(storageService.PRODUCT_PROFILE);
    };

    var getAllGroupedByProductCategory = function(){
      var deferred = $q.defer();
      var groupedList = {};
      var promises = [];
      promises.push(storageService.all(storageService.PRODUCT_PROFILE));
      promises.push(productCategoryFactory.getKeyValuePairs());

      $q.all(promises)
          .then(function (result) {
            var productProfiles = result[0];
            var categoriesKeyValuePairs = result[1];
            for (var index in productProfiles) {
              var productProfile = productProfiles[index];
              var NOT_FOUND = -1;
              var existingGroups = Object.keys(groupedList);
              if (existingGroups.indexOf(productProfile.category) === NOT_FOUND) {
                var categoryObj = categoriesKeyValuePairs[productProfile.category];
                var group = {
                  category: categoryObj,
                  productProfiles: []
                }
                groupedList[productProfile.category] = group;
              }
              var groupCategory = groupedList[productProfile.category];
              groupCategory.productProfiles.push(productProfile);
            }
            deferred.resolve(groupedList);
          })
          .catch(function (reason) {
            deferred.reject(reason);
          });
      return deferred.promise;
    };

    return {
      get: getByUuid,
      getAll: getAll,
      getByProductType: getByProductType,
      getBatch: getProductProfileBatch,
      getAllWithoutNestedObject: getAllWithoutNestedObject,
      getAllGroupedByCategory: getAllGroupedByProductCategory
    };
  });
