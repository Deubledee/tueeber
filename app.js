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

// view engine setup

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
/*app.use('/publicbower', express.static(path.join(__dirname, 'build/modern/public/bower_components/webcomponentsjs')));
app.use('/public', express.static(path.join(__dirname, 'build/modern/public')));
app.use('/src', express.static(path.join(__dirname, 'build/modern/src')));*/

app.use('/publicbower', express.static(path.join(__dirname, 'public/bower_components/webcomponentsjs')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));

app.use('/', index);
app.use('/video/', index);
app.use('/news', index);
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
app.get('/youtube/*', function(req, res){    
    youtube(req, res)
})
app.get('/newsapi/*', function(req, res){    
    newsapi(req, res)
})
//

// catch 404 and forward to error handler

module.exports = app;
