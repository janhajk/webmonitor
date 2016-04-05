exports.baseurl = 'http://example.com';

exports.googlesuer  'googleUser-id';

exports.username = 'user1';
exports.password = 'VfKnRe$7gdBf';

exports.database     = "mongodb://localhost/webmonitor";
exports.port         = 27017;
exports.cookieSecret = "1234";


exports.login    = {};      // don't change

epxorts.GOOGLE_CLIENT_ID = "--insert-google-client-id-here--";
epxorts.GOOGLE_CLIENT_SECRET = "--insert-google-client-secret-here--";



exports.sites = [
   {url: 'http://www.steg-electronics.ch/de/articlelist/bargainProducts.aspx', range: '#articleList'}
];

exports.keepTime = 100; // days to keep movies in the database

exports.updateIntervalSites = 1000*60*20;
exports.updateIntervalInfos = 10000;

exports.cacheTime = 60 * 60 * 1000; // 1 hour in milliseconds

exports.dev = false;