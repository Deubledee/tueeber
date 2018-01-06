const url = require('url')
const querystring = require('querystring');
var youtubeNode = require("youtube-node")
var youTubesearch = new youtubeNode();
/* GET home page. */
var key = 'AIzaSyAvZS0WP2y0M9Yczpi8F-4JeagLnFCDMwU'

function youtube(req, client, res) {
  const myURL = querystring.parse(url.parse(req.url).query, null, null)
  var pathname = url.parse(req.url).pathname.split('/').pop()
  let string = 'youtube' + JSON.stringify(myURL)
  youTubesearch.setKey(key);
  try {
    client.get(string, function (error, result) {
      if (!result) {
        console.log("server msg: <-response youtube->")
        youTubesearch.search(myURL.q, myURL.maxResults, function (error, resulto) {
          if (error) {
            console.log(error);
          }
          else {
            client.set(string, JSON.stringify(resulto), 'EX', 36000, function (err, data) {
              console.log(err, data)
            })
            res(JSON.stringify(resulto))
          }
        })
      } else {
        console.log("server msg: <-result youtube->")    
        res(JSON.stringify(result))
      }
    })
  } catch (err) {
    console.log(err)
  }
}
module.exports = youtube;
