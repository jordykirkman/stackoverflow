'use strict';

angular.module('app.search', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search', {
    templateUrl: 'search/search.html',
    controller: 'SearchController'
  });
}])

// search questions by title and tags
.factory('Search', ['$resource', '$rootScope', function($resource, $rootScope){
	return $resource('https://api.stackexchange.com/2.2/search/', {}, {
		query: {
			method:'GET',
			isArray:true,
			// strip out of root key and just return the array
			transformResponse: function(data){
				if(JSON.parse(data).items){
					return JSON.parse(data).items;
				} else {
					return JSON.parse(data);
				}
			}
		}
	});
}])

.controller('SearchController', ['Search', '$scope', '$rootScope', '$http', function(Search, $scope, $rootScope, $http) {

	$scope.searchTitle = null;
	$scope.searchTags = null;
	$scope.searchNotTags = null;
	$scope.model = [];

	// search function performs a query with the criteria
	$scope.search = function(){
		$scope.model = Search.query({
			intitle: $scope.searchTitle,
			tagged: $scope.searchTags,
			nottagged: $scope.searchNotTags,
			access_token: $rootScope.access_token,
			key: '6S9zu7acV8JdHBn473Q6yw((',
			filter: "!tRhd)msKfDI_kdNs2zdw2HVvoAIWUBj",
			site: 'stackoverflow'
		});
	}

}]);