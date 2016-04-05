var config = require(__dirname + '/config.js');
var mongoose = require('mongoose');


exports.connect = function(callback) {
        utils.log('Connecting to database...');
        mongoose.connect(config.database);

        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'Connection error:'));
        db.once('open', function() {
                utils.log('Connected to DB successfully!');
                callback();
        });
};


var WebSchema = mongoose.Schema({
   title: { type: String, index: true },
   url: { type: String, index: false },
   interval: { type: Number, index: false, default: 1},
   range: { type: String, index: false},
   revisions: [{
      timestamp: Number,
      content: String
   }]
});

var Web = mongoose.model('Web', WebSchema);
exports.model = Web;


exports.add = function(title, url, interval, range, callback) {
   var site = new Web({
      title: title,
      url: url,
      interval: interval,
      range: range
   });
   site.save(function(err) {
      callback(err, site);
   });
};

exports.list = function(callback){
   Web.find({}, '_id title url interval range, revisions', function(err, sites){
      callback(err, sites);
   });
};


var updateSites = function(callback) {
   var http = require('http');
   var async = require('async');
   Web.find({}, '_id url interval', function(err, sites){
      if (err) return handleError(err);
      var fSites = [];
      for (var i in sites) {
         console.log('%s %s %s', sites[i]._id, sites[i].url, sites[i]:interval);
         fSites.push((function(id, url){return function(callback){
            var request = http.request(url, function (res) {
               var data = '';
               res.on('data', function (chunk) {
                  data += chunk;
               });
               res.on('end', function () {
                  callback(null, data);

               });
            });
            request.on('error', function (e) {
               console.log(e.message);
            });
            request.end();
         }})(sites[i]._id, sites[i].url));
      }
      async.series(fSites, function(err, results){
         callback(err, results);
      });
   });
};
exports.updateSites = updateSites;

var getRangeFromHTML = function(range, html) {
   var cheerio = require('cheerio');
   var dom = cheerio.load(html);
   return dom(range).html();
};




