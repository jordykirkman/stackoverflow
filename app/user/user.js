'use strict';

angular.module('myApp.user', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider, $routeParams) {
  $routeProvider.when('/user/', {
    templateUrl: 'user/user.html',
    controller: 'UserCtrl'
  });
}])

.controller('UserCtrl', ['$scope', '$routeParams', '$rootScope', '$http', '$location', function($scope, $routeParams, $rootScope, $http, $location) {

	// clear the hash from the oath
	$location.hash('');

	if($rootScope.user){
		$scope.model = $rootScope.user;
	} else {
		// fetch the the current user and set it as the model
		$http({
			url: 'https://api.stackexchange.com/2.2/me',
			method: "GET",
			params: {
				access_token: $rootScope.access_token,
				key: '6S9zu7acV8JdHBn473Q6yw((',
				site: 'stackoverflow'
			}
		}).success(function(data, status, headers, config) {
			// this callback will be called asynchronously
			// when the response is available
			$rootScope.user = data.items[0];
			$scope.model = data.items[0];
			$scope.getTimeline($scope.model);
		}).error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			console.log('error ' + data.error_message);
			$scope.error = data;
		});
	}

	$scope.getTimeline = function(user){
		$http({
			url: 'https://api.stackexchange.com/2.2/me/timeline',
			method: "GET",
			params: {
				access_token: $rootScope.access_token,
				key: '6S9zu7acV8JdHBn473Q6yw((',
				site: 'stackoverflow'
			}
		}).success(function(data, status, headers, config) {
			// this callback will be called asynchronously
			// when the response is available
			user.timeline = data.items;
		}).error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			console.log('error ' + data.error_message);
		});
	}

}]);