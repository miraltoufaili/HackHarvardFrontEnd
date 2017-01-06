var express = require('express');
bodyParser = require('body-parser')
var app = express();

var http = require ('http');         // For serving a basic web page.
var mongoose = require ("mongoose"); // The reason for this demo.

    // Here we find an appropriate database to connect to, defaulting to
    // localhost if we don't find one.
    var uristring =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/HelloMongoose';

    // The http server will listen to an appropriate port, or default to
    // port 5000.
    var theport = process.env.PORT || 5000;

    // Makes connection asynchronously.  Mongoose will queue up database
    // operations and release them when the connection is complete.
    mongoose.connect(uristring, function (err, res) {
      if (err) {
      console.log ('ERROR connecting to: ' + uristring + '. ' + err);
      } else {
      console.log ('Succeeded connected to: ' + uristring);
      }
    });

    

var userSchema = new mongoose.Schema({
      category: { type: String },
      heartrate: { type: String },
      name: {
        first: String,
        last: { type: String, trim: true }
      },
      age: { type: Number, min: 0 }
    });

var PUser = mongoose.model('PowerUsers', userSchema);
 
 //Creating one user.
    var johndoe = new PUser ({
      name: { first: 'John', last: '  Doe   ' },
      age: 25
    });

    console.log(johndoe);

    // Saving it to the database.
    johndoe.save(function (err) {if (err) console.log ('Error on save!')});
    // Saving it to the database.
    //johndoe.save(function (err) {if (err) console.log ('Error on save!')});

app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('pages/index');
});

app.get('/template', function(req, res){
	res.render('pages/index');
});

app.get('/patients', function(req, res) {
  res.render('pages/patients');
});
app.get('/trump', function(req, res) {
  res.render('pages/Trump');
});

app.get('/submit', function(req,res){
	res.render('pages/submit')
	console.log("Submit")

	/*
	PUser.find({ category: "heartrate" }).cursor();
	cursor.on('data', function(doc) {
  	console.log(data)
	});
cursor.on('close', function() {
  // Called when done
}); */
});


app.get('/result', function(req,res){
	console.log('hello');

	var query = PUser.find({}, { 'name': 0, 'age': 0, 'category': 0, '_id': 0, '__v': 0}, function(err, usr) {
		console.log(usr);
	});
	
});

app.get('/patient',function(req,res){
	res.render('pages/patient')
});

app.post("/post", function (req, res) {
	console.log('post page activate')
    console.log(req.body)

    var fs = require('fs');
	fs.writeFile("test.txt", JSON.stringify(req.body.HR), function(err) {
    
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 

    	var userHR = new PUser ({
    		category: "heartrate",
    		heartrate: req.body.HR

    });

	userHR.save(function (err) {if (err) console.log ('Error on save!')});    
});



  // Handle 404
  app.use(function(req, res) {
     res.send('404: Page not Found', 404);
  });
  
  // Handle 500
  app.use(function(error, req, res, next) {
     res.send('500: Internal Server Error', 500);
  });

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});