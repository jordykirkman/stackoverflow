'use strict';

var loginModule = angular.module('myApp.login', ['ngRoute']);

loginModule.config(['$routeProvider', function($routeProvider, $routeParams) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginController'
  });
}])

loginModule.controller('LoginController', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope) {

	// checks to see if stackoverflow oath put an access token in the url
	if($location.hash().access_token){
		$rootScope.access_token = $location.hash().access_token;
		$location.path('/user/');
	}


}]);