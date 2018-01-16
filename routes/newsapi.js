//const url = require('url');
const NewsAPI = require('newsapi');
const url = require('url')
const querystring = require('querystring');
/* GET home page. */
const apiKey = '16bb1647c69145dc8a5c8f18373cd2cf'
const Newsapi = new NewsAPI(apiKey);

function from() {
  let date = new Date();
  let yesterday = date - 1000 * 60 * 60 * 24 * 2;
  yesterday = new Date(yesterday);
  yesterday = JSON.stringify(yesterday)
  yesterday = yesterday.split('T')
  yesterday = yesterday[0].split('-')
  yesterday = `${yesterday[0]}-${yesterday[1]}-${yesterday[2]}`
  return yesterday.replace(/\"/g, "")
}

function to() {
  let d = new Date()
  var today = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
  return today
}

const o = Object.create(Object.prototype, {

  topHeadlines: {
    writable: false,
    configurable: false,
    value: function (req, client, res) {
      console.log('topHeadLines-', req)
      let string = JSON.stringify(req).indexOf('topHeadLines') > 0 ? req : 'topHeadLines-' + JSON.stringify(req)
      var obj = {type: 'topHeadLines'}
      try {
        client.get(string, function (error, result) {
          if (!result) {
            var arr = JSON.stringify(string.split('topHeadLines-').join(''))
            let parsed =  JSON.parse(arr)
            parsed =  JSON.parse(parsed)
            Newsapi.v2.topHeadlines(parsed).then((response) => {
              //image optimizer 
              console.log("server msg: <-response topHeadLines->", response)
              client.set(string, JSON.stringify(response), 'EX', 1800, function (err, data) {
                console.log(err, data)
              })
              obj.arr = response
              res(JSON.stringify(obj))
            })
          } else {           
            obj.arr = result
            console.log("server msg: <-result topHeadLines->")
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
    value: function (req, client, res) {
      req.from = from()
      req.to = to()     
      //console.log('everything-', typeof req)  
      let string =  JSON.stringify(req).indexOf('everything') > 0 ? req : 'everything-' + JSON.stringify(req) 
      var obj = { type: 'everything' }         
      try {
        client.get(string, function (error, result) {
          if (!result) {   
            var arr = JSON.stringify(string.split('everything-').join(''))
            let parsed =  JSON.parse(arr)
            parsed =  JSON.parse(parsed)                
           Newsapi.v2.everything(parsed).then((response) => {
              //image optimizer
              console.log("server msg: <-response everything->")
              let str = JSON.stringify(response)
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

function newsapi(req, client, res, goThrough, pathArr) {
  let reqObj, pathname = new Array()
  if (goThrough === false) {
    reqObj = querystring.parse(url.parse(req.url).query, null, null)
    pathname = url.parse(req.url).pathname.split('/').pop()
  //  console.log('pathname', pathname)
  } else {
    reqObj = req
    pathname = pathArr
  }
  if (o.hasOwnProperty(pathname)) {
    o[pathname](reqObj, client, res)
  }
}

module.exports = newsapi;
