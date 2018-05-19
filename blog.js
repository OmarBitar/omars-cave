var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// user schema 
var blogSchema   = new Schema({
    forignKey: {type: String, required: true },//project title
    last_updated : { type : Date, default: Date.now, required: true },
    blog_body: { type: String, required: true }
})

//middleware that will check if connectedd to the database
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection to data base error!'));
db.once('open', function() {
  console.log('we are connected to the photo blog collection!');
});

module.exports = mongoose.model('blog', blogSchema);//the models contains(collection name, collection schema)