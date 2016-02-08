# MEAN-basic

#Takeaways

 - **This app uses client-side Angular ui.Router to control controllers and views.

 - using ```app.param([name], callback)``` to fetch data.
 
 - using ```Model.findById(id)```
 
 - Methods in Model Objects, being triggered by POST requests.
 
 ```
                /* Upvote a comment */
                router.put('/posts/:post/comments/:comment/upvote', function (req, res, next) {
                    req.comment.upvote( function (err, comment) {
                        if (err) { return next(err); }
                        res.json(comment);
                    });
                });
                
        //Comments.js   
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
