'use strict';

angular.module('myApp.user', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider, $routeParams) {
  $routeProvider.when('/user/', {
    templateUrl: 'user/user.html',
    controller: 'UserCtrl'
  });
}])

.controller('UserCtrl', ['$scope', '$routeParams', '$rootScope', '$resource', function($scope, $routeParams, $rootScope, $resource) {
  $scope.model = $resource('https://api.stackexchange.com/2.2/me?access_token=' + $rootScope.access_token);
}]);