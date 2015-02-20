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

	// fetch the the current user and set it as the model
	$http({
		url: 'https://api.stackexchange.com/2.2/me',
		method: "GET",
		params: {
			access_token: key + $rootScope.access_token,
			// key: '6S9zu7acV8JdHBn473Q6yw((',
			site: 'stackoverflow'
		}
	}).success(function(data, status, headers, config) {
		// this callback will be called asynchronously
		// when the response is available
		console.log(data);
		$scope.model = data;
	}).error(function(data, status, headers, config) {
		// called asynchronously if an error occurs
		// or server returns response with an error status.
		console.log('error ' + data.error_message);
		$scope.error = data;
	});

}]);