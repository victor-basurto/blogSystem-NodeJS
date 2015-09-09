var express = require('express');
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');
var router = express.Router();

/**
 * Get posts
 */
router.get('/add', function(req, res, next) {
	res.render('addcategory', {
		'title': 'Add Category'
	});
});

router.post('/add', function( req, res, next ) {
	// get form values
	var title = req.body.title;

	console.log('title: ' + title);

	// form validation
	req.checkBody('title', 'Title Field is Required').notEmpty;

	// check errors
	var errors = req.validationErrors();

	if ( errors ) {
		// if errors, render addposts
		res.render('addcategory', {
			'errors': errors,
			'title': title
		});
	} else {
		var categories = db.get('categories');

		// submit to db
		categories.insert({
			'title': title
		}, function( err, category ) {
			if ( err ) {
				res.send('There was an issue submitting your category');
			} else {
				req.flash('success', 'Category Submitted');
				res.location('/');
				res.redirect('/');
			}
		});
	}

});

module.exports = router;
