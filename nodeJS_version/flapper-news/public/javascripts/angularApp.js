var app = angular.module('flapperNews', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
        postPromise: ['posts', function(posts){
          return posts.getAll();
        }]
      }
    })
    .state('posts', {
      url: '/posts/{id}',
      templateUrl: '/posts.html',
      controller: 'PostsCtrl'
    });


  $urlRouterProvider.otherwise('home');
}]);//end of config

app.factory('posts', ['$http', function($http){
  var o = {
    posts: []
      //get posts
        o.getAll = function() {
            return $http.get('/posts').success(function(data){
              angular.copy(data, o.posts);
            });
          };
                      //create posts
                      o.create = function(post) {
                          return $http.post('/posts', post).success(function(data){
                            o.posts.push(data);
                          });
                        };
  };
  return o;
}]);//end of service

app.controller('MainCtrl', ['$scope', 'posts', function($scope, posts){
    $scope.test = 'Hello world!';
    $scope.posts = posts.posts;
    $scope.addPost = function(){
      if(!$scope.title || $scope.title === '') { return; } // return immediately if empty
    //with mock comments
    $scope.posts.push({
      title: $scope.title,
      link: $scope.link,
      upvotes: 0,
      comments: [
        {author: 'Joe', body: 'Cool post!', upvotes: 0},
        {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
      ]
    });
    //reset input
      $scope.title = '';
      $scope.link = '';
    };
    $scope.incrementUpvotes = function(post) {
      post.upvotes += 1;
    };
}]);//end of controller

app.controller('PostsCtrl', ['$scope', '$stateParams', 'posts', function($scope, $stateParams, posts){
    $scope.post = posts.posts[$stateParams.id];
    $scope.addPost = function(){
      if(!$scope.title || $scope.title === '') { return; }
      posts.create({
        title: $scope.title,
        link: $scope.link,
      });
      $scope.title = '';
      $scope.link = '';
    };
    $scope.addComment = function(){
      if($scope.body === '') { return; }
      $scope.post.comments.push({
        body: $scope.body,
        author: 'user',
        upvotes: 0
      });
      $scope.body = '';
    };
    
}]);//end of controller