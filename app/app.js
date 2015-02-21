'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.login',
  'myApp.user',
  'myApp.search',
  'myApp.question',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  // $routeProvider.otherwise({redirectTo: '/view1'});
}]);
