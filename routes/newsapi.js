//const url = require('url');
const NewsAPI = require('newsapi');
const url = require('url')
const querystring = require('querystring');
/* GET home page. */
var apiKey = '16bb1647c69145dc8a5c8f18373cd2cf'
const Newsapi = new NewsAPI(apiKey);

var o = Object.create(Object.prototype, {
  topHeadlines: {
    writable: false,
    configurable: false,
    value: function (req, res) {
      Newsapi.v2.topHeadlines(req).then((response) => {
        res.send(response)
      });
    }
  },
  everything: {
    writable: false,
    configurable: false,
    value: function (req, res) {
      Newsapi.v2.topHeadlines(req).then((response) => {
        res.send(response)
      });
    }
  }
});
function newsapi(req, res) {
  const reqObj = querystring.parse(url.parse(req.url).query, null, null)
  var pathname = url.parse(req.url).pathname.split('/').pop()
  if (o.hasOwnProperty(pathname)) {
    o[pathname](reqObj, res)
  }
}

module.exports = newsapi;
