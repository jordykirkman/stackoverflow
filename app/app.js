'use strict';

// Declare app level module which depends on views, and components
var App = angular.module('app', [
  'ngRoute',
  'app.login',
  'app.user',
  'app.search',
  'app.question',
  // 'app.version'
]);
// config(['$routeProvider', function($routeProvider) {
  // $routeProvider.otherwise({redirectTo: '/view1'});
// }]);
