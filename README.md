# MEAN-basic

#Takeaways

 - **This app uses client-side Angular ui.Router (NOT NgRoute) to control controllers and views.
```
          == angularApp.js (clientside JS, angular route) ==
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
      controller: 'PostsCtrl',
      resolve: {
        post: ['$stateParams', 'posts', function($stateParams, posts) {
          return posts.get($stateParams.id);
        }]
      }
    });
 
```
 - use of MongoDB's ```.populate``` to get ```post.comments```
```
	=== HTML Template ===

    <script type="text/ng-template" id="/posts.html">
      <div class="page-header">
        <h3>
          <a ng-show="post.link" href="{{post.link}}">
            {{post.title}}
          </a>
          <span ng-hide="post.link">
            {{post.title}}
          </span>
        </h3>
      </div>

      <div ng-repeat="comment in post.comments | orderBy:'-upvotes'">
        <span class="glyphicon glyphicon-thumbs-up"
          ng-click="incrementUpvotes(comment)"></span>
        {{comment.upvotes}} - by {{comment.author}}
        <span style="font-size:20px; margin-left:10px;">
          {{comment.body}}
        </span>
      </div>
          <!-- post template -->

      <form ng-submit="addComment()"
        style="margin-top:30px;">
        <h3>Add a new comment</h3>

        <div class="form-group">
          <input type="text"
          class="form-control"
          placeholder="Comment"
          ng-model="body"></input>
        </div>
        <button type="submit" class="btn btn-primary">Post</button>
      </form>
    </script>

         == angularApp.js (clientside JS, angular service) ==

   o.get = function(id) {
       return $http.get('/posts/' + id).then(function(res){
       	//return post with comments expanded
         return res.data;
       });
     };
     
     
         == index.js (routes file) ==
/* GET post
   Query auto-ran on router.param
 */
router.get('/posts/:post', function (req, res) {
	req.post.populate('comments', function(err, post) {
		res.json(post);
	});
});
```


 - using express Router```.param``` with ```Model.findById(id)``` instead if ```req.params.(blah)```. app.param is depreciated in Express 4.11x ->
 
 ```
         == index.js (routes file) ==
 /*------*/
/* PARAM */
/*------*/
// Runs for all post related actions
router.param('post', function (req, res, next, id) {
	var query = Post.findById(id);

	query.exec( function (err, post) {
		if (err) { return next(err); }
		if (!post) {
			return next('Could not find post');
		}

		req.post = post;
		return next();
	});
});

////Example use, note how we can use 'req.comment' in the PUT request.

        == index.js (routes file) ==
CLIENT

   //upvote comment
   o.upvoteComment = function(post, comment) {
       return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote')
         .success(function(data){
           comment.upvotes += 1;
         });
     };
     
 SERVER
 
/* Upvote a comment */
router.put('/posts/:post/comments/:comment/upvote', function (req, res, next) {
	req.comment.upvote( function (err, comment) {
		if (err) { return next(err); }
		res.json(comment);
	});
});
 ```
 
 - Methods in Model Objects, being triggered by POST requests.
 
 ```
        == index.js (routes file) ==
        /* Upvote a comment */
        router.put('/posts/:post/comments/:comment/upvote', function (req, res, next) {
            req.comment.upvote( function (err, comment) {
                if (err) { return next(err); }
                res.json(comment);
            });
        });
                
        == Comments.js ==
        CommentSchema.methods.upvote = function(cb) {
          this.upvotes += 1;
          this.save(cb);
        };
 ```

 - Relations in Model Objects and Default Settings
 
 ```
   upvotes: {type: Number, default: 0},
   post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
 ```
