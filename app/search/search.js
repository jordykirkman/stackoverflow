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

	$scope.filterOptions = [
		{name: 'Relevence', value: null},
		{name: 'Votes', value: 'up_vote_count'},
		{name: 'Answers', value: 'answer_count'},
		{name: 'Is Answered', value: 'is_answered'}
	];

	$scope.changeFilter = function(filter){
		$scope.questionFilter = filter;
	}

	$scope.searchTitle = null;
	$scope.searchTags = null;
	$scope.searchNotTags = null;
	$scope.model = [];

	// search function performs a query with the criteria and parameters
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