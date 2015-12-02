var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

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

// Runs for all comment related actions
router.param('comment', function (req, res, next, id) {
	var query = Comment.findById(id);

	query.exec( function(err, comment) {
		if (err) { return next(err); }
		if (!comment) {
			return ('Could not find comment');
		}

		req.comment = comment;
		return next();
	});
});

                /* GET home page. */
                router.get('/', function(req, res) {
                  res.render('index', { title: 'Flapper News' });
                });

/* GET posts */
router.get('/posts', function(req, res, next) {
	Post.find(function (err, posts) {
		if (err) { return next(err); }
		res.json(posts);
	});
});

                /* POST new post */
                router.post('/posts', function(req, res, next) {
                    var post = new Post(req.body);

                    post.save(function (err, post) {
                        if (err) { return next(err); }

                        res.json(post);
                    });
                });

/* GET post
   Query auto-ran on router.param
 */
router.get('/posts/:post', function (req, res) {
	req.post.populate('comments', function(err, post) {
		res.json(post);
	});
});

                /* PUT Upvote a post */
                router.put('/posts/:post/upvote', function (req, res, next) {
                    req.post.upvote( function (err, post) {
                        if (err) { return next(err); }
                        res.json(post);
                    });
                });

/* POST new comment */
router.post('/posts/:post/comments', function (req, res, next) {
	var comment = new Comment(req.body);
	// get related comments for post
	comment.post = req.post;

	comment.save( function (err, comment) {
		if (err) { return next(err); }

		// push new comment to post
		req.post.comments.push(comment);
		// push new comment to storage
		req.post.save( function (err, post) {
			if (err) { return next(err); }
			res.json(comment);
		});
	});
});

                /* Upvote a comment */
                router.put('/posts/:post/comments/:comment/upvote', function (req, res, next) {
                    req.comment.upvote( function (err, comment) {
                        if (err) { return next(err); }
                        res.json(comment);
                    });
                });

module.exports = router;
