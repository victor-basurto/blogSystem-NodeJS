var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');


/**
 * Get posts
 */
router.get('/add', function( req, res, next ) {
	var categories = db.get('categories');

	categories.find({}, {}, function( err, categories ) {
		res.render('addpost', {
			'title' : 'Add Post',
			'categories' : categories
		});
	});

});

/**
 * Post
 */
router.post('/add', function( req, res, next ) {
	// get form values
	var title		= req.body.title;
	var category	= req.body.category;
	var body		= req.body.body;
	var author		= req.body.author;
	var date		= new Date();

	console.log('title: ' + title);


	if( req.file ) {

		console.log('Uploading Files');
		

		var mainImageOriginalName 	= req.file.originalname;
		var mainImageName 			= req.file.fieldname;
		var mainImageFileName		= req.file.filename;
		var mainImageMime 			= req.file.mimetype;
		var mainImagePath 			= req.file.path;
		var mainImageSize 			= req.file.size;

		console.log('File: ' + mainImageOriginalName);
		console.log('Body: ' + mainImageOriginalName);
	} else {
		// if there's no image
		var mainImageFileName = "noimage.jpg";

	}
	
	// form validation
	req.checkBody('title', 'Title Field is Required').notEmpty;
	req.checkBody('body', 'Body Field is Required');

	// check errors
	var errors = req.validationErrors();

	if ( errors ) {
		// if errors, render addposts
		res.render('addpost', {
			'errors': errors,
			'title': title,
			'body': body
		});
	} else {
		var posts = db.get('posts');

		// submit to db
		posts.insert({
			'title': title,
			'body': body,
			'category': category,
			'date': date,
			'author': author,
			'avatar': mainImageFileName

		}, function( err, post ) {
			if ( err ) {
				res.send('There was an issue submitting your post');
			} else {
				req.flash('success', 'Post Submitted');
				res.location('/');
				res.redirect('/');
			}
		});
	}

});

module.exports = router;