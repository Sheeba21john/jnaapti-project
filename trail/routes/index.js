var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser'); //middleware
var mongojs = require('mongojs');
var db =  mongojs('contact_app', ['my_contacts']);
/* GET home page */
router.get('/', function (req, res, next) {
	db.my_contacts.find().toArray(function (err,result){
		if (err) 
			throw err;
			console.log(result);
		res.render('index',{title:"Contact Management", result: result,msg:""});
	});
});

router.get('/add', function (req, res, next){
    res.render('add');
});

//this route uses to add contact name, number, category and profile image
router.post('/add_contact', function (req, res, next) {
    var name = req.body.name;
   	var number = req.body.number;
    var category = req.body.category;
    var sample = req.files.file;
 //adds and saves image by the name of the contact in the images folder. Thus the image url is not saved in the database.
   	sample.mv(__dirname+'/../public/images/'+req.body.name+'.png',function (err){
   		if (err)
   			return res.status(500).send(err);
    });
 //query for inserting   
   	db.my_contacts.insert({name: name, number: number, category: category});

    db.my_contacts.find().toArray(function (err,result){
		if (err) 
			throw err;
			console.log(result);
		res.render('index',{title:"Contact Management", result: result,msg:"Contact Added"});
	});

});

//this route deleted the contact by his/her name
router.post('/delete_contact/:name', function (req, res, next){
    var name = req.params.name;
    db.my_contacts.remove({name: name});
    db.my_contacts.find().toArray(function (err,result){
		if (result.length==1)
			res.render('index',{title:"Contact Management", result: result,msg:""});
		else 
			res.send("Contact does not exist.");
    });
});

//displaying the category of contacts by using the query.
router.get('/friends',function(req,res,next) {
	console.log("here too");
	db.my_contacts.find({category:"friends"}).toArray(function (err,result){
		console.log(result.length);
		res.render('index',{title:"Contact Management", result: result,msg:""});
    });

});

router.get('/family',function(req,res,next) {
	console.log("here too");
	db.my_contacts.find({category:"family"}).toArray(function (err,result){
		console.log(result.length);
		res.render('index',{title:"Contact Management", result: result,msg:""});

	});
});

router.get('/acquaintance',function(req,res,next) {
	console.log("here too");
	db.my_contacts.find({category:"acquaintance"}).toArray(function (err,result){
		console.log(result.length);
		res.render('index',{title:"Contact Management", result: result,msg:""});
	});
});

router.get('/others',function(req,res,next) {
	console.log("here too");
	db.my_contacts.find({category:"others"}).toArray(function (err,result){
		console.log(result.length);
		res.render('index',{title:"Contact Management", result: result,msg:""});
	});
});

router.get('/update', function(req, res, next){
	res.render('update');
});

//this route is used to update the contact.
router.post('/update_contact', function (req, res, next){
	var name = req.body.name;
	var number = req.body.number;
	var category = req.body.category;
	db.my_contacts.update({name: name}, {name: name, number: number, category: category}, {upsert: false});
	db.my_contacts.find({name:name}).toArray(function (err,result) {
		console.log(result.length);
		if (result.length==1) {
			res.render('index',{title:"Contact Management", result: result,msg:"Contact Updated."});
		}
		else 
			res.render('index',{title:"Contact Management", result: result,msg:"Contact does not exist."});
	});
});

//route to display the contact details.
router.get('/display', function (req, res, next){
	db.my_contacts.find().toArray(function (err,result){
		if (err) 
			throw err;
		res.render('display',{result: result});
	});
});

module.exports = router;
