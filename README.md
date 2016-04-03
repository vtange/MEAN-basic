# MEAN-basic

#Takeaways

 - **This app uses client-side Angular ui.Router to control controllers and views.
```
 GET "/" -> always send index.js, AngularApp.js controls multiple webpages
 Other Routes just work with DB.
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
