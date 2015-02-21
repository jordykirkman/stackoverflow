'use strict';

angular.module('myApp.search', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search', {
    templateUrl: 'search/search.html',
    controller: 'SearchController'
  });
}])

.controller('SearchController', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {

	$scope.searchTitle = null;
	$scope.searchTags = null;
	$scope.searchNotTags = null;

	$scope.search = function(){
		// fetch the the current user and set it as the model
		$http({
			url: 'https://api.stackexchange.com/2.2/search',
			method: "GET",
			params: {
				access_token: $rootScope.access_token,
				intitle: $scope.searchTitle,
				tagged: $scope.searchTags,
				nottagged: $scope.searchNotTags,
				key: '6S9zu7acV8JdHBn473Q6yw((',
				site: 'stackoverflow'
			}
		}).success(function(data, status, headers, config) {
			// this callback will be called asynchronously
			// when the response is available
			console.log(data);
			$scope.model = data.items;
		}).error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			console.log('error ' + data.error_message);
			$scope.error = data;
		});
	}

}]);