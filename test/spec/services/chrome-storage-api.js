'use strict';

ddescribe('chromeStorageApi', function () {
  var mockWindow, chromeStorageApi, objectStore = {};

  beforeEach(module('lmisChromeApp'));

  beforeEach(function () {
    mockWindow = {
      chrome: {
        storage: {
          local: {
            set: function (obj) {
              objectStore[obj.key] = obj.value;
            },
            get: function () {
            },
            remove: function () {
            },
            clear: function () {
              objectStore = {};
            }
          }
        }
      },
      addEventListener: function () {
      }
    };
    module(function ($provide) {
      $provide.value('$window', mockWindow);
    });
  });

  beforeEach(inject(function (_chromeStorageApi_) {
    chromeStorageApi = _chromeStorageApi_;
  }));

  afterEach(function(){
    objectStore = {};//clear object store after each test
  });

  it('should be able to set data to the storage', function () {
    expect(Object.keys(objectStore).length).toBe(0);
    spyOn(mockWindow.chrome.storage.local,'set').andCallThrough();
    var promise = chromeStorageApi.set({'key': 'value'});
    expect(mockWindow.chrome.storage.local.set).toHaveBeenCalled();
    expect(Object.keys(objectStore).length).toBe(1);
  });

  it('should be able to get an item from the storage', function () {
    spyOn(mockWindow.chrome.storage.local, 'get');
    expect(Object.keys(objectStore).length).toBe(0);
    chromeStorageApi.get('value');
    expect(mockWindow.chrome.storage.local.get).toHaveBeenCalled();
  });

  it('should be able to remove an item from the storage', function () {
    spyOn(mockWindow.chrome.storage.local, 'remove');
    chromeStorageApi.remove('key');
    expect(mockWindow.chrome.storage.local.remove).toHaveBeenCalled();
  });

  it('should be able to remove all item from the storage', function () {
    spyOn(mockWindow.chrome.storage.local, 'clear');
    chromeStorageApi.clear();
    expect(mockWindow.chrome.storage.local.clear).toHaveBeenCalled();
  });

});