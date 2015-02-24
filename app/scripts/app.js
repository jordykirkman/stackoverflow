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
App.config(['$routeProvider', function($routeProvider) {}]);
App.run(['$rootScope', '$location', function($rootScope, $location) {
	// $routeProvider.otherwise({redirectTo: '/view1'});
	$rootScope.$on('$locationChangeStart', function (e, next, current) {
		if(!$rootScope.access_token){
			if(typeof(Storage) !== 'undefined') {
				if(localStorage.getItem('access_token')){
					$rootScope.access_token = localStorage.getItem('access_token');
				} else {
					$location.path('/login');
				}
			} else {
				$location.path('/login');
			}
		}
	});
}]);
