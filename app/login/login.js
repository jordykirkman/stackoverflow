'use strict';

angular.module('app.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider, $routeParams) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginController'
  });
}])

.controller('LoginController', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope) {

	if(typeof(Storage) !== 'undefined') {
		localStorage.removeItem('access_token');
	}

	// checks to see if stackoverflow oath put an access token in the url
	if($location.hash()){
		var token = $location.hash().split('&')[0].split('=')[1];
		$rootScope.access_token = token;
		$location.path('/user/').hash('');

		// if the browser allows sessionStorage, lets put the user's session token in it
		if(typeof(Storage) !== 'undefined') {
			localStorage.setItem('access_token', token);
		}
	}

}]);