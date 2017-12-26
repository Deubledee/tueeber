//const url = require('url');
const NewsAPI = require('newsapi');
const url = require('url')
const querystring = require('querystring');
/* GET home page. */
const apiKey = '16bb1647c69145dc8a5c8f18373cd2cf'
const Newsapi = new NewsAPI(apiKey);

const o = Object.create(Object.prototype, {
  topHeadlines: {
    writable: false,
    configurable: false,
    value: function (req, client, res) {
      let string = 'topHeadLines' + req.sources + req.category + req.q
      try {
        client.get(string, function (error, result) {
          if (!result) {
            console.log("<-response->")
            Newsapi.v2.topHeadlines(req).then((response) => {
              //image optimizer
              client.set(string, JSON.stringify(response), 'EX', 1500, function (err, data) {
                console.log(err, data)
              })
              res(response)
            })
          } else {
            console.log("<-result->")
            res(result)
          }
        })
      } catch (err) {
        console.log(err)
      }
    }
  },
  everything: {
    writable: false,
    configurable: false,
    value: function (req, client, res) {  
      let string = 'everything' + req.sources + req.q   
      try {
        client.get(string, function (error, result) {
          if (!result) {
            console.log("<-response everything->")
            Newsapi.v2.topHeadlines(req).then((response) => {
              //image optimizer
              client.set(string, JSON.stringify(response), 'EX', 3600, function (err, data) {
                console.log(err, data)
              })
              res(response)
            })
          } else {
            console.log("<-result everything->")
            res(result)
          }
        })
      } catch (err) {
        console.log(err)
      }
    }
  }
})

function newsapi(req, client, res) {
  const reqObj = querystring.parse(url.parse(req.url).query, null, null)
  var pathname = url.parse(req.url).pathname.split('/').pop()
  if (o.hasOwnProperty(pathname)) {
    o[pathname](reqObj, client, res)
  }
}

module.exports = newsapi;
