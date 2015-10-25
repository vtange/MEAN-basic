var app = angular.module('flapperNews', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl'
    })
    .state('posts', {
      url: '/posts/{id}',
      templateUrl: '/posts.html',
      controller: 'PostsCtrl'
    });


  $urlRouterProvider.otherwise('home');
}]);//end of config

app.factory('posts', [function(){
  var o = {
    posts: []
  };
  return o;
}]);//end of service

app.controller('MainCtrl', ['$scope', 'posts', function($scope, posts){
    $scope.test = 'Hello world!';
    $scope.posts = posts.posts;
    $scope.addPost = function(){
      if(!$scope.title || $scope.title === '') { return; } // return immediately if empty
      $scope.posts.push({
        title: $scope.title,
        link: $scope.link,
        upvotes: 0
      });
      $scope.title = '';
      $scope.link = '';
    };
    $scope.incrementUpvotes = function(post) {
      post.upvotes += 1;
    };
    //mock posts
    $scope.posts.push({
      title: $scope.title,
      link: $scope.link,
      upvotes: 0,
      comments: [
        {author: 'Joe', body: 'Cool post!', upvotes: 0},
        {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
      ]
    });
}]);//end of controller

app.controller('PostsCtrl', [
'$scope',
'$stateParams',
'posts',
function($scope, $stateParams, posts){

}]);//end of controller