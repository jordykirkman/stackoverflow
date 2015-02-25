'use strict';

angular.module('app.user', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider, $routeParams) {
  $routeProvider.when('/user/', {
    templateUrl: 'scripts/user/user.html',
    controller: 'UserController'
  });
}])

// get the currently logged in user via the /me method
.factory('User', ['$resource', '$rootScope',
	function($resource, $rootScope){
		return $resource('https://api.stackexchange.com/2.2/me', {}, {
			query: {
				cache: true,
				method:'GET',
				params:{
					access_token: $rootScope.access_token,
					key: '6S9zu7acV8JdHBn473Q6yw((',
					filter: '!9YdnSA07B',
					site: 'stackoverflow'
				},
				isArray:false,
				// stackoverflow returns objects in an "items" array
				// with the "me" method, we only need the first item in the response
				transformResponse: function(data){
					if(JSON.parse(data).items){
						var user = JSON.parse(data).items[0];
						user.profile_image = user.profile_image.split('?')[0];
						return user;
					} else {
						return JSON.parse(data);
					}
				}
			}
		});
	}
])

// get the timeline of the currently logged in user
.factory('Timeline', ['$resource', '$rootScope',
	function($resource, $rootScope){
		return $resource('https://api.stackexchange.com/2.2/me/timeline', {}, {
			query: {
				cache: true,
				method:'GET',
				params:{
					access_token: $rootScope.access_token,
					key: '6S9zu7acV8JdHBn473Q6yw((',
					// limit response to last 6 items
					pagesize: 6,
					site: 'stackoverflow'
				},
				isArray:true,
				transformResponse: function(data){
					if(JSON.parse(data).items){
						return JSON.parse(data).items;
					} else {
						return JSON.parse(data);
					}
				}
			}
		});
	}
])

// get the timeline of the currently logged in user
.factory('Badges', ['$resource', '$rootScope',
	function($resource, $rootScope){
		return $resource('https://api.stackexchange.com/2.2/me/badges', {}, {
			query: {
				cache: true,
				method:'GET',
				params:{
					access_token: $rootScope.access_token,
					key: '6S9zu7acV8JdHBn473Q6yw((',
					filer: '!9aPrOqc.Y',
					site: 'stackoverflow'
				},
				isArray:true,
				transformResponse: function(data){
					if(JSON.parse(data).items){
						return JSON.parse(data).items;
					} else {
						return JSON.parse(data);
					}
				}
			}
		});
	}
])

// get the timeline of the currently logged in user
.factory('Tags', ['$resource', '$rootScope',
	function($resource, $rootScope){
		return $resource('https://api.stackexchange.com/2.2/me/tags', {}, {
			query: {
				cache: true,
				method:'GET',
				params:{
					access_token: $rootScope.access_token,
					key: '6S9zu7acV8JdHBn473Q6yw((',
					filter: '!9YdnSQVoS',
					site: 'stackoverflow'
				},
				isArray:false,
				transformResponse: function(data){
					if(JSON.parse(data).items){
						var tags = JSON.parse(data);
						// find the largest tag count, this is used in our word cloud
						tags.largestCount = 0;
						tags.tagList = [];
						tags.items.forEach(function(tag){
							tags.tagList.push(tag.name);
							if(tag.count > tags.largestCount){
								tags.largestCount = tag.count;
							}
						});
						return tags;
					} else {
						return JSON.parse(data);
					}
				}
			}
		});
	}
])

// get the timeline of the currently logged in user
.factory('Favorites', ['$resource', '$rootScope',
	function($resource, $rootScope){
		return $resource('https://api.stackexchange.com/2.2/me/favorites', {}, {
			query: {
				cache: false,
				method:'GET',
				params:{
					access_token: $rootScope.access_token,
					key: '6S9zu7acV8JdHBn473Q6yw((',
					filter: '!bB.KRGAQOGAQ18',
					site: 'stackoverflow'
				},
				isArray:true,
				transformResponse: function(data){
					if(JSON.parse(data).items){
						return JSON.parse(data).items;
					} else {
						return JSON.parse(data);
					}
				}
			}
		});
	}
])

.controller('UserController', ['User', 'Timeline', 'Badges', 'Tags', 'Favorites', '$scope', '$routeParams', '$rootScope', '$http', '$location',
	function(User, Timeline, Badges, Tags, Favorites, $scope, $routeParams, $rootScope, $http, $location) {

	// fetch our models
	var me = 				User.query();
	var tags = 				Tags.query();
	
	$rootScope.me = 		me;
	$scope.model = 			me;
	$scope.timeline = 		Timeline.query();
	$scope.badges =			Badges.query();
	$scope.tags = 			tags;
	$rootScope.tags = 		tags;
	$scope.favorites = 		Favorites.query();

	$scope.searchTags = function(){
		$rootScope.autoSearch = true;
		$location.path('/search');
	}

}]);