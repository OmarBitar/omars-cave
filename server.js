//author: Omar Bitar
// CALL THE PACKAGES --------------------
var express    = require('express');    // call express
var app        = express();         // define our app using express
var bodyParser = require('body-parser');  // get body-parser
var morgan     = require('morgan');     // used to see requests
var mongoose   = require('mongoose');   // methods for mongo db
var dotenv      = require('dotenv').config();
var cloudinary  = require('cloudinary');    // for image hosting
var fs          = require('fs');            // for reading buffer data
var http        = require('http');
var multer  = require('multer');
var authController = require('./auth');
var passport = require('passport');
var PictureGallery = require('./pictureGallery');
var Blog = require('./blog');
var Project = require('./project');

// set the port for our app
var port        = process.env.PORT || 8080; 

// APP CONFIGURATION ---------------------
mongoose.connect(process.env.DB); // connect to our database 
cloudinary.config({ 
    cloud_name: process.env.cloudName, 
    api_key: process.env.cloudKey, 
    api_secret: process.env.cloudSecret
});                             // connect to the image cloud service
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});
app.use(morgan('dev'));
var apiRouter = express.Router();
//requierd for the 'basic' authorization
app.use(passport.initialize());
app.use(passport.session());
//handeling file buffer
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
// ROUTES ----------------------------

apiRouter.get('/', function(req, res) {
    res.send('this is the omars-cave db, if you are not omar then fuck off');
  });

//=============================================================================================
//post a new project
//=============================================================================================
apiRouter.post('/create_project',upload.single('profile_img'),authController.isAuthenticated, function (req,res){

  if (!req.file) {
    console.log("No file received");
    return res.send({
    success: false
    });
  } 
  //save image to the cloud
  cloudinary.uploader.upload_stream( (result) => {
    
    //save the project information to db
    var project = new Project();
    project.profile_img_url = result.secure_url;//save img url
    project.title = req.body.title;
    project.video_link = req.body.video_link;
    project.details = req.body.details;
    project.comments = req.body.comments;
    project.project_type = req.body.project_type;
    project.save(function(err,tempObject){
      if(err){
        return res.send(err);
      }
      else {
        res.json({
          success: true,
          message: 'project was created with id: ' + tempObject.id
        })
      }  
    });
    console.log('url is: ' + result.secure_url);
  }).end( req.file.buffer );
});
//=============================================================================================
//post a new photo
//=============================================================================================
apiRouter.post('/create_img',upload.single('img'),authController.isAuthenticated, function (req,res){

  if (!req.file) {
    console.log("No file received");
    return res.send({
    success: false
    });
  } 
  //save image to the cloud
  cloudinary.uploader.upload_stream( (result) => {
    
    //save the project information to db
    var picture = new PictureGallery();
    picture.forignKey = req.body.forignKey;
    picture.img_url = result.secure_url;
    picture.picture_comment = req.body.picture_comment;
    picture.save(function(err){
      if(err){
        return res.send(err);
      }
      else {
        res.json({
          success: true,
          message: 'image saved to db'
        })
      }
    });
    console.log('url is: ' + result.secure_url);
  }).end( req.file.buffer );
 
});
//=============================================================================================
//post a new blog
//=============================================================================================
apiRouter.post('/create_blog',authController.isAuthenticated, function (req,res){

  //save the project information to db
  var blog = new Blog();
  blog.forignKey = req.body.forignKey;
  blog.blog_body = req.body.blog_body;
  blog.save(function(err){
    if(err){
      return res.send(err);
    }
    else {
      res.json({
        success: true,
        message: 'blog saved to db'
      })
    }
  });
 
});
//=============================================================================================
//getting project info routes
//=============================================================================================
//return an array of films
apiRouter.get('/get_project', function (req,res){

  console.log('searching ' + req.query.project_type);

  Project.find({project_type: req.query.project_type}, function(err,project){
    if (err) return res.send(err);
    res.json(project);
  }).sort({'last_updated':-1})

});

//return information for a specific film
apiRouter.get('/get_project/:project_id', function (req,res){

  var projectID = req.params.project_id;
  //get the film information
  Project.findById(projectID, function(err,project){
    if (err) return res.send(err);
    //get all the pictures
    PictureGallery.find({forignKey: projectID},function(err,picture){
      if (err) return res.send(err);
      //get all the blogs
      Blog.find({forignKey: projectID},function(err,blog){
        if (err) return res.send(err);
        res.json({project,picture,blog});
      }).sort({'last_updated':-1})
    }).sort({'last_updated':-1})
  })

});
//=============================================================================================
//get array of pictures
//=============================================================================================
apiRouter.get('/get_pictures', function (req,res){

  PictureGallery.find(function(err,picture){
    if (err) return res.send(err);
    res.json(picture);
  }).sort({'last_updated':-1})

});
//=============================================================================================
//get array of blogs
//=============================================================================================
apiRouter.get('/get_blogs', function (req,res){

  Blog.find(function(err,blog){
    if (err) return res.send(err);
    res.json(blog);
  }).sort({'last_updated':-1})

});

// REGISTER OUR ROUTES -------------------------------
app.use('/api', apiRouter);
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);