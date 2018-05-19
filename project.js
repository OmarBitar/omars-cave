var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// user schema 
var project   = new Schema({
    profile_img_url: { type: String, required: true, index: { unique: true }},
    title : { type: String, required: true},
    video_link : { type: String, required: true},
    last_updated : { type : Date, default: Date.now, required: true },
    details: { type: String},
    comments: { type: String},
    project_type: { type: String}
})

//middleware that will check if connectedd to the database
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection to data base error!'));
db.once('open', function() {
  console.log('we are connected to the project collection!');
});

module.exports = mongoose.model('project', project);//the module exports(collection name, collection schema)