'use strict';

describe('Service stockCountFactory', function(){
  beforeEach(module('lmisChromeApp', 'lmisChromeAppMocks', 'stockCountMocks'));

  var stockCountFactory,
      stockCount,
      scope;
  beforeEach(inject(function(_stockCountFactory_, $rootScope, stockData, $q, $templateCache, $httpBackend){
    stockCountFactory = _stockCountFactory_;
    scope = $rootScope.$new();
    stockCount = stockData;

    spyOn(stockCountFactory, 'getStockCountByDate').andCallFake(function (date) {
      //TODO: re-write this when local storage and storageprovider mocks are completed.
      if (date > new Date()) {
        return $q.when({uuid: '1234567890-08829199-89872-9087-1234567892'});
      } else {
        return $q.when(null);
      }
    });
    $httpBackend.whenGET('/locales/en.json').respond(200, {});
    $httpBackend.whenGET('/locales/en_GB.json').respond(200, {});
  }));

  it('should expose a load method aliased as "get"', function(){
    expect(stockCountFactory).toBeDefined();
  });

  it('should contain the name of a function', function(){
    expect(stockCountFactory.get.allStockCount).toBeDefined();
  });

  it('should return Month object', function(){
    expect(stockCountFactory.monthList).toBeDefined();
  });

  it('should return 12 months', function(){
    var monthsCount = Object.keys(stockCountFactory.monthList).length;
    expect(monthsCount).toBeDefined(12);
  });

  it('should return the first month in the object', function(){
    expect(stockCountFactory.monthList['01']).toEqual('January');
  });

  it('should confirm validate object exist', function(){
    expect(stockCountFactory.validate).toBeDefined();
  });

  it('it should return true if variable is empty (""), undefined, not a number or is negative', function(){
    expect(stockCountFactory.validate.invalid(-20)).toBeTruthy();
  });

  it('as user i want to be access stock count for a given date', function(){
    var stockCount = {};
    stockCountFactory.getStockCountByDate((new Date()).getDate() + 1).then(function(result){
      stockCount = result;
    });
    expect(stockCount).not.toBeNull();
    scope.$digest();
    expect(stockCountFactory.getStockCountByDate).toHaveBeenCalled();
    expect(stockCount).toBeNull();
  });
});
