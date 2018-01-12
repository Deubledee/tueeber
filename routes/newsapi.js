//const url = require('url');
const NewsAPI = require('newsapi');
const url = require('url')
const querystring = require('querystring');
/* GET home page. */
const apiKey = '16bb1647c69145dc8a5c8f18373cd2cf'
const Newsapi = new NewsAPI(apiKey);

function from () {
  let date = new Date();
  let yesterday = date - 1000 * 60 * 60 * 24 * 2;
  yesterday = new Date(yesterday);
  yesterday = JSON.stringify(yesterday)
  yesterday = yesterday.split('T')
  yesterday = yesterday[0].split('-')
  yesterday = `${yesterday[0]}-${yesterday[1]}-${yesterday[2]}`
  return yesterday.replace(/\"/g, "")
} 

function to () {
    let d = new Date()
    var today = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
    return today
  }

const o = Object.create(Object.prototype, {

  topHeadlines: {
    writable: false,
    configurable: false,
    value: function (req, client, res) {
      let string = 'topHeadLines' + req.sources + '-' + req.category + '-' + req.q
      var obj = { type: 'topHeadLines' }
      try {
        client.get(string, function (error, result) {
          if (!result) {
            console.log("<-response->")
            Newsapi.v2.topHeadlines(req).then((response) => {
              //image optimizer
              client.set(string, JSON.stringify(response), 'EX', 1500, function (err, data) {
                console.log(err, data)
              })
              obj.arr = response
              res(JSON.stringify(obj))
            })
          } else {
            console.log("<-result->")
            obj.arr = result
            res(JSON.stringify(obj))
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
    value: function (req, client, res, val) {     
      req.from = from()
      req.to = to()
     // console.log("reque", req)  
      let string = JSON.stringify(req)//.sources + '-' + req.q + '-' + req.from + '-' + req.to
      var obj = { type: 'everything' }
     // console.log("string", string)      
      try {
        client.get(string, function (error, result) {
          if (!result) {
            console.log("server msg: <-response everything->")
            Newsapi.v2.everything(req).then((response) => {
              //image optimizer
              let str = val === true ? resposnse : JSON.stringify(response)
              client.set(string, str, 'EX', 1800, function (err, data) {
                console.log(err, data)
              })
              obj.arr = response
              res(JSON.stringify(obj))
            })
          } else {
            console.log("server msg: <-result everything->")
            obj.arr = result
            res(JSON.stringify(obj))
          }
        })
      } catch (err) {
        console.log(err)
      }
    }
  }
})

function newsapi(req, client, res, goThrough) {
  let reqObj, pathname
  if (goThrough === false) {
    reqObj = querystring.parse(url.parse(req.url).query, null, null)
    pathname = url.parse(req.url).pathname.split('/').pop()
  } else {
    reqObj = req
    pathname = 'everything'
  }
  if (o.hasOwnProperty(pathname)) {
    o[pathname](reqObj, client, res)
  }
}

module.exports = newsapi;
