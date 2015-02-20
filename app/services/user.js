'use strict';

var userServices = angular.module('userServices', ['ngResource']);

userServices.factory('User', ['$resource',
  function($resource){
    // return $resource('phones/:phoneId.json', {}, {
    //   query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    // });
return {};
  }]);
