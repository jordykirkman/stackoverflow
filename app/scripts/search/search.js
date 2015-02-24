'use strict';

angular.module('app.search', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search', {
    templateUrl: 'scripts/search/search.html',
    controller: 'SearchController'
  });
}])

// search questions by title and tags
.factory('Search', ['$resource', '$rootScope', function($resource, $rootScope){
	return $resource('https://api.stackexchange.com/2.2/search/', {}, {
		query: {
			method:'GET',
			cache: true,
			isArray:false,
			// strip out of root key and just return the array
			transformResponse: function(data){
				if(JSON.parse(data).items){
					var questionList = JSON.parse(data);
					// find the largest tag count, this is used in our word cloud
					questionList.largestTagCount = 0;
					questionList.tags = [];
					questionList.tagObjects = [];

					// using recursion to create a unique set of tag objects that contain their own quantity
					questionList.items.forEach(function(question){
						question.tags.forEach(function(tag){
							var tagObj = {name: tag, count: 1};
							if(questionList.tags.indexOf(tag) == -1){
								questionList.tags.push(tag);
								questionList.tagObjects.push({name: tag, count: 1});
							} else {
								questionList.tagObjects.forEach(function(obj){
									if(obj.name === tag){
										obj.count += 1;
										if(obj.count + 1 > questionList.largestTagCount){
											questionList.largestTagCount = obj.count + 1;
										}
									}
								});
							}
						});
					});
					return questionList;
				} else {
					return JSON.parse(data);
				}
			}
		}
	});
}])

.controller('SearchController', ['Search', '$scope', '$rootScope', '$http', function(Search, $scope, $rootScope, $http) {

	// default values
	$scope.searchTitle = null;
	$scope.searchTags = null;
	$scope.searchNotTags = null;

	$scope.model = [];

	// check the auto search flag
	if($rootScope.autoSearch){
		$scope.model = Search.query({
			tagged: $rootScope.tags.tagList,
			access_token: $rootScope.access_token,
			key: '6S9zu7acV8JdHBn473Q6yw((',
			filter: "!tRhd)msKfDI_kdNs2zdw2HVvoAIWUBj",
			site: 'stackoverflow'
		});
		$scope.searchTags = $rootScope.tags.tagList;
		$rootScope.autoSearch = false;
	}

	// predefined options for the filter dropdown
	$scope.filterOptions = [
		{name: 'Relevence', value: null},
		{name: 'Votes', value: 'up_vote_count'},
		{name: 'Answers', value: 'answer_count'},
		{name: 'Is Answered', value: 'is_answered'}
	];

	// trigger a change to the filter with a filter object
	$scope.changeFilter = function(filter){
		$scope.questionFilter = filter;
	}

	// search function performs a query with the criteria and parameters
	// more param is a bool to see if this is a new search, or pressing the "more" button
	$scope.search = function(more){
		if(more){
			$scope.pages += 1;
		} else {
			$scope.pages = 1;
			$scope.model = [];
		}
		Search.query({
			intitle: $scope.searchTitle,
			tagged: $scope.searchTags,
			nottagged: $scope.searchNotTags,
			access_token: $rootScope.access_token,
			pagesize: 30,
			page: $scope.pages,
			key: '6S9zu7acV8JdHBn473Q6yw((',
			filter: "!tRhd)msKfDI_kdNs2zdw2HVvoAIWUBj",
			site: 'stackoverflow'
		}, function(data){
			$scope.largestTagCount = data.largestTagCount;
			$scope.tags = data.tags;
			$scope.tagObjects = data.tagObjects;
			$scope.hasMore = data.has_more;
			data.items.forEach(function(item){
				$scope.model.push(item);
			});
		});
	}

}]);