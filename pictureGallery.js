var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// user schema 
var photoGallerySchema   = new Schema({
    forignKey: {type: String, required: true },//project title
    img_url: { type: [String], required: true, index: { unique: true }},
    last_updated : { type : Date, default: Date.now, required: true },
    picture_comment: {type: String, required: false }
})

//middleware that will check if connectedd to the database
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection to data base error!'));
db.once('open', function() {
  console.log('we are connected to the photo gallery collection!');
});

module.exports = mongoose.model('photo gallery', photoGallerySchema);//the models contains(collection name, collection schema)