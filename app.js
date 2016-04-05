// load modules
// 
// 
var config      = require(__dirname + '/config.js');

// Express
var express        = require('express');
var compression    = require('compression');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var cookieParser   = require('cookie-parser');
var session        = require('express-session');


// Auth
var passport       = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// User
var db       = require(__dirname + '/database/database.js');

// Setting up Express
var app = express();
app.use(compression());
app.use(methodOverride());  // simulate DELETE and PUT
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(cookieParser());
app.use(session({secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static((path.join(__dirname, 'public'))));


app.listen(process.env.PORT || config.port);

// Authentication
passport.serializeUser(function(user, done) {
   done(null, user);
});
passport.deserializeUser(function(obj, done) {
   done(null, obj);
});
passport.use(new GoogleStrategy({
   clientID: config.GOOGLE_CLIENT_ID,
   clientSecret: config.GOOGLE_CLIENT_SECRET,
   callbackURL: config.baseurl + "/auth/google/callback"
}, function(accessToken, refreshToken, profile, done) {
   utils.log(profile);
   process.nextTick(function() {
      if (profile.id === config.googleUser) {
         utils.log('Login in user "' + profile.displayName + '"');
         return done(null, profile);
      }
      else {
         utils.log('User not authorised!');
         return done(err);
      }
   });
}));

app.get('/auth/google', passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login']}), function(req, res) {});
app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/login'}), function(req, res) {
   res.redirect('/start');
});
app.get('/logout', function(req, res) {
   req.logout();
   res.redirect('/login');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}


// Router

app.get('/', function(req, res){
   fs.readFile(__dirname + '/public/index.html', 'utf-8', function (err, data){
      res.send(data);
   });
});
app.get('/login', function(req, res){
   fs.readFile(__dirname + '/public/index.html', 'utf-8', function (err, data){
      res.send(data);
   });
});
app.get('/start', ensureAuthenticated, function(req, res) {
    fs.readFile(__dirname + '/public/start.html', 'utf-8', function (err, data) {
        res.send(data);
    });
});
app.get('/list', ensureAuthenticated, function(req, res) {
   db.list(function(err, data){
      res.send(data);
   });
});
app.get('/update', ensureAuthenticated, function(req, res) {
   db.updateSites(function(err, data){
      res.send(data);
   });
});

/**
 * adds new url to monitor
 */
app.post('/add', ensureAuthenticated, function(req, res){
});



// Connects app to mongo database
db.connect(function() {
    app.listen(app.get('port'));
    /*
     * cronjobs
     *
     */
    setInterval((function() {
        
    })(), config.updateIntervalSites);
});


