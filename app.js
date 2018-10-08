const express = require('express');
const expressSession = require("express-session")
//var RedisStore = require('connect-redis')(expressSession);
const redis = require('redis');
//const RedisServer = require('redis-server');
var commands = require('redis-commands');
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
/*const server = new RedisServer({
  port: 6379,
  conf: 'redis.conf'
});*/
var obj = {
  everything: [],
  topHeadLines: [],
  date: function () {
    let t = new date()
    return t
  }
}
server.open((err) => {
  if (err === null) {
    // You may now connect a client to the Redis
    // server bound to `server.port` (e.g. 6379).
    console.log('server open')
  }
});

const client = redis.createClient(process.env.REDIS_URL)
//const client = redis.createClient()
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
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('malaguenhaaaaa'));
app.use(responseTime());
app.use('/publicbower', express.static(path.join(__dirname, 'build/modern/public/bower_components/webcomponentsjs')));
app.use('/public', express.static(path.join(__dirname, 'build/modern/public')));
app.use('/src', express.static(path.join(__dirname, 'build/modern/src')));
app.use('/publicbower', express.static(path.join(__dirname, 'public/bower_components/webcomponentsjs')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));


app.use(function (req, res, next) {
  if (req.session) {
    return next();
  }

  var tryCount = 1,
    maxTries = 3;

  function lookupSession(error) {
    var sessionMiddleware = expressSession;

    if (error) {
      return res.send(500);
    }

    console.log('Attempting to load the session: ' + tryCount + ' of ' + maxTries + '...');

    tryCount += 1;

    if (req.session) {
      return next();
    }

    if (tryCount > maxTries) {
      return res.send(500);
    }

    sessionMiddleware(req, res, lookupSession);
  }

  lookupSession();
});

app.use('/', index);
app.use('/news/*', index);
app.use('/blog/*', index);
app.use('/profile/*', index);

//app.use('/newsapi', newsapi);
//app.use('/youtube', youtube);
app.get('/youtube/*', function (req, res) {
  youtube(req, client, function (result) {
    res.send(result)
  })
})
app.get('/newsapi/*', function (req, res, ) {
  console.log('/newsapi/*', req)
  newsapi(req, client, function (result) {
    // console.log(req)
    console.log('/newsapi/*')
    res.send(result)
  }, false)
})

function update(pathName) {
  let arr = obj[pathName]
  arr.map((item) => {
    newsapi(item, client, function (resulto) {
      console.log("result updated", obj[pathName])
    }, true, pathName)
  })
}

//queries cached
setInterval(() => {
  let date = new Date()
  if (date === (obj.date + 1000 * 60 * 60 * 24 * 1)) {
    client.flushall((err, info) => {
      console.log('flushall', err, info)
      update('everything')
      update('topHeadLines')
      obj.date = date
      obj.everything = []
      obj.topHeadLines = []
    })
    console.log('date cahnged', date)
  }
  client.keys('*everything*', function (err, result) {
    //   console.log(result.length, i)
    if (result.length > obj.everything.length) {
      obj.everything = []
      result.map((item) => {
        obj.everything.push(item)
      })
      console.log("result everything cached", result)
    }
    if (result.length < obj.everything.length && result.length !== obj.everything.length) {
      update('everything')
    }
  })
  client.keys('*topHeadLines*', function (err, result) {
    //   console.log(result.length, i)
    if (result.length > obj.topHeadLines.length) {
      obj.topHeadLines = []
      result.map((item) => {
        obj.topHeadLines.push(item)
      })
      console.log("result topHeadLines cached", result)
    }
    if (result.length < obj.topHeadLines.length && result.length !== obj.topHeadLines.length) {
      update('topHeadLines')
    }
  })
}, 5000)

// catch 404 and forward to error handler

module.exports = app;
