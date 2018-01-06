const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const index = require('./routes/index');
const youtube = require('./routes/youtube');
const newsapi = require('./routes/newsapi');
const app = express();
const responseTime = require('response-time')
const redis = require('redis');
const RedisServer = require('redis-server');
var commands = require('redis-commands');
const server = new RedisServer({
  port: 6379,
  conf: 'redis.conf'
});
var obj = {
  cached: []
}
server.open((err) => {
  if (err === null) {
    // You may now connect a client to the Redis
    // server bound to `server.port` (e.g. 6379).
    console.log('server open')
  }
});

const client = redis.createClient();
client.on('connect', function (item) {
  console.log('redis conected port: 6379')
})

client.on('error', function (item) {
  console.log('an eror ocurred', item)
})


/*
  commands.list.forEach(function (command) {
      console.log(command);
    });
*/

//queries cached
setInterval(() => {
  client.keys('*sources*', function (err, result) {  
 //   console.log(result.length, i)
    if (result.length > obj.cached.length) {
      obj.cached = []
      result.map((item) => {
        obj.cached.push(JSON.parse(item))
      })
    }
    if (result.length < obj.cached.length) {     
      obj.cached.map((item) => {
        newsapi(item, client, function (result) {
          console.log("result updated", item)
       }, true)
      })
    }   
  })
}
  , 5000)

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(responseTime());
/*app.use('/publicbower', express.static(path.join(__dirname, 'build/modern/public/bower_components/webcomponentsjs')));
app.use('/public', express.static(path.join(__dirname, 'build/modern/public')));
app.use('/src', express.static(path.join(__dirname, 'build/modern/src')));*/

app.use('/publicbower', express.static(path.join(__dirname, 'public/bower_components/webcomponentsjs')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));

app.use('/', index);
app.use('/news/*', index);
app.use('/articles/*', index);
app.use('/sports', index);
app.use('/movies', index);
app.use('/radio', index);
app.use('/animation', index);
app.use('/music', index);
app.use('/technology', index);
app.use('/channels', index);
app.use('/finance', index);
app.use('/leran', index);
app.use('/teach', index);
app.use('/comedy', index);
//app.use('/newsapi', newsapi);
//app.use('/youtube', youtube);
app.get('/youtube/*', function (req, res) {
  youtube(req, client, function (result) {
    res.send(result)
  })
})
app.get('/newsapi/*', function (req, res, ) {
  newsapi(req, client, function (result) {
    res.send(result)
  }, false)
})

//

// catch 404 and forward to error handler

module.exports = app;
