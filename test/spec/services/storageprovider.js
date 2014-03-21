'use strict';

describe('storageService test', function () {
  // Load the controller's module
  beforeEach(module('lmisChromeApp', 'lmisChromeAppMocks'));

  // instantiate service
  var storageService, rootScope;
  beforeEach(inject(function (_storageService_, _$rootScope_) {
    storageService = _storageService_;
    rootScope = _$rootScope_;
  }));

  it('as a user, i expect storageService to be defined so i can access storage features', function () {
    expect(storageService).toBeDefined();
  });

  it('as a user, i expect rootScope to be defined', function () {
    expect(rootScope).toBeDefined();
  });

  it('i expect storageService.USER to be equal to "user" ', function () {
    expect(storageService.USER).toBe('user');
    expect(storageService.USER).not.toBe('product');
  });

  it('as a user, i want to know if i can check if chrome local storage is supported', function () {
    expect(storageService.isSupported).toBeDefined();
  });

  it('as a user, i expect chrome local storage to be supported', function () {
    //TODO: not this can change if we move completely to pouchDB
    expect(storageService.isSupported).toBeTruthy();
  });

  it('as a user, i expect storage service to have ability to generate uuid', function () {
    expect(angular.isFunction(storageService.uuid)).toBeTruthy();
  });

  it('as a user, i want uuid length to be 36', function () {
    var uuid = storageService.uuid();
    expect(uuid.length).toBe(36);
  });

});
