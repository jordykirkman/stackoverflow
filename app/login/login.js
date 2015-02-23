'use strict';

angular.module('app.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider, $routeParams) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginController'
  });
}])

.controller('LoginController', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope) {

	// checks to see if stackoverflow oath put an access token in the url
	if($location.hash()){
		$rootScope.access_token = $location.hash().split('&')[0].split('=')[1];
		$location.path('/user/').hash('');
	}

}]);